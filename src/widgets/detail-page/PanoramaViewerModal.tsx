"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  BackSide,
  MathUtils,
  SRGBColorSpace,
  TextureLoader,
  type PerspectiveCamera,
  type Texture,
} from "three";
import { Maximize, Minimize, Pause, Play, X } from "lucide-react";

interface ViewAngle {
  lon: number;
  lat: number;
  fov: number;
}

interface TextureResult {
  url: string;
  texture: Texture | null;
}

const SPHERE_RADIUS = 500;
const DEFAULT_FOV = 75;
const MIN_FOV = 30;
const MAX_FOV = 100;
// 위아래로 완전히 넘어가면 화면이 뒤집히므로 각도를 제한합니다.
const MAX_LAT = 85;
const DRAG_SPEED = 0.1;
const WHEEL_SPEED = 0.05;
// 1초에 회전하는 각도
const AUTO_ROTATE_SPEED = 6;
const VIEWER_HEIGHT = "min(560px, 70vh)";

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

interface PanoramaSphereProps {
  texture: Texture;
  angleRef: RefObject<ViewAngle>;
  isAutoRotating: boolean;
  isDraggingRef: RefObject<boolean>;
}

function PanoramaSphere({
  texture,
  angleRef,
  isAutoRotating,
  isDraggingRef,
}: PanoramaSphereProps) {
  useFrame(({ camera }, delta) => {
    const angle = angleRef.current;
    if (isAutoRotating && !isDraggingRef.current) {
      angle.lon += AUTO_ROTATE_SPEED * delta;
    }

    const perspectiveCamera = camera as PerspectiveCamera;
    if (perspectiveCamera.fov !== angle.fov) {
      perspectiveCamera.fov = angle.fov;
      perspectiveCamera.updateProjectionMatrix();
    }

    const phi = MathUtils.degToRad(90 - angle.lat);
    const theta = MathUtils.degToRad(angle.lon);
    camera.lookAt(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta),
    );
  });

  // 구의 안쪽 면에 사진을 그리고, 안에서 봤을 때 좌우가 뒤집히지 않도록 x축을 뒤집습니다.
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[SPHERE_RADIUS, 60, 40]} />
      <meshBasicMaterial map={texture} side={BackSide} />
    </mesh>
  );
}

interface PanoramaViewerModalProps {
  imageUrl: string;
  onClose: () => void;
}

export function PanoramaViewerModal({
  imageUrl,
  onClose,
}: PanoramaViewerModalProps) {
  const [textureResult, setTextureResult] = useState<TextureResult | null>(
    null,
  );
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canUseWebGL] = useState(isWebGLAvailable);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef<ViewAngle>({ lon: 0, lat: 0, fov: DEFAULT_FOV });
  const isDraggingRef = useRef(false);
  const dragRef = useRef<{ lastX: number; lastY: number } | null>(null);

  const isLoaded = textureResult?.url === imageUrl;
  const texture = isLoaded ? textureResult.texture : null;
  const isFailed = isLoaded && !texture;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.fullscreenElement) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!canUseWebGL) return;

    let isCancelled = false;
    let loadedTexture: Texture | null = null;

    // TextureLoader는 crossOrigin="anonymous"로 이미지를 불러옵니다.
    new TextureLoader().load(
      imageUrl,
      (texture) => {
        texture.colorSpace = SRGBColorSpace;
        loadedTexture = texture;
        if (isCancelled) {
          texture.dispose();
          return;
        }
        setTextureResult({ url: imageUrl, texture });
      },
      undefined,
      () => {
        if (!isCancelled) setTextureResult({ url: imageUrl, texture: null });
      },
    );

    return () => {
      isCancelled = true;
      loadedTexture?.dispose();
    };
  }, [canUseWebGL, imageUrl]);

  useEffect(() => {
    const container = containerRef.current;
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(container) && document.fullscreenElement === container,
      );
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      // 전체화면인 채로 모달이 닫히면 전체화면도 함께 종료합니다.
      if (container && document.fullscreenElement === container) {
        void document.exitFullscreen();
      }
    };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // 휠은 페이지 스크롤을 막아야 하므로 passive가 아닌 리스너로 등록합니다.
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const angle = angleRef.current;
      angle.fov = MathUtils.clamp(
        angle.fov + event.deltaY * WHEEL_SPEED,
        MIN_FOV,
        MAX_FOV,
      );
    };

    viewer.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewer.removeEventListener("wheel", handleWheel);
  }, []);

  const handleToggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
      }
    } catch {
      // 브라우저가 전체화면을 허용하지 않으면 현재 화면을 유지합니다.
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    isDraggingRef.current = true;
    dragRef.current = { lastX: event.clientX, lastY: event.clientY };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    // 확대했을 때 너무 빨리 돌지 않도록 시야각에 비례해 회전합니다.
    const angle = angleRef.current;
    const speed = DRAG_SPEED * (angle.fov / DEFAULT_FOV);
    angle.lon -= (event.clientX - drag.lastX) * speed;
    angle.lat = MathUtils.clamp(
      angle.lat + (event.clientY - drag.lastY) * speed,
      -MAX_LAT,
      MAX_LAT,
    );
    dragRef.current = { lastX: event.clientX, lastY: event.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    dragRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/55 px-4">
      <div
        ref={containerRef}
        className={`flex w-full flex-col bg-white ${
          isFullscreen
            ? "h-full px-6 py-5"
            : "max-w-[1200px] rounded-[20px] px-8 py-7 shadow-[0px_16px_40px_0px_rgba(33,41,48,0.2)]"
        }`}
      >
        <div className="flex w-full items-center justify-between gap-4">
          <h2 className="text-xl leading-7 font-semibold text-gray-900">
            360도 화면보기
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={isAutoRotating}
              onClick={() => setIsAutoRotating((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-[13px] leading-5 text-gray-900 hover:bg-gray-100"
            >
              {isAutoRotating ? <Pause size={14} /> : <Play size={14} />}
              {isAutoRotating ? "자동 회전 멈춤" : "자동 회전"}
            </button>
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-[13px] leading-5 text-gray-900 hover:bg-gray-100"
            >
              {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
              {isFullscreen ? "전체화면 종료" : "전체화면"}
            </button>
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className="flex size-7 items-center justify-center text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="h-5 shrink-0" />

        <div
          ref={viewerRef}
          className={`relative w-full cursor-grab touch-none overflow-hidden rounded-2xl bg-gray-100 select-none active:cursor-grabbing ${
            isFullscreen ? "min-h-0 flex-1" : ""
          }`}
          style={isFullscreen ? undefined : { height: VIEWER_HEIGHT }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {texture ? (
            <Canvas
              flat
              camera={{
                fov: DEFAULT_FOV,
                near: 1,
                far: SPHERE_RADIUS * 2,
                position: [0, 0, 0],
              }}
            >
              <PanoramaSphere
                texture={texture}
                angleRef={angleRef}
                isAutoRotating={isAutoRotating}
                isDraggingRef={isDraggingRef}
              />
            </Canvas>
          ) : (
            <p
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm ${
                !canUseWebGL || isFailed ? "text-red-700" : "text-gray-600"
              }`}
            >
              {!canUseWebGL
                ? "이 브라우저에서는 360도 화면보기를 사용할 수 없습니다."
                : isFailed
                  ? "360도 사진을 불러오지 못했습니다."
                  : "360도 사진을 불러오는 중입니다."}
            </p>
          )}
        </div>

        <p className="mt-3 text-sm leading-5 text-gray-600">
          드래그해서 둘러보고, 휠을 굴려 확대·축소할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
