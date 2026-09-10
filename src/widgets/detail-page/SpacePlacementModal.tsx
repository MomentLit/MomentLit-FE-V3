"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type PointerEvent,
  type SetStateAction,
} from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface PlacementItem {
  id: string;
  src: string;
  fileName: string;
  // x, y, width는 공간 사진 크기 대비 % 값이고, x, y는 물품 사진의 중심점입니다.
  x: number;
  y: number;
  width: number;
  aspectRatio: number;
  rotation: number;
  opacity: number;
}

// 공간 사진 URL별로 배치한 물품 사진 목록 (배열 뒤쪽일수록 앞에 겹쳐 보입니다)
export type SpacePlacements = Record<string, PlacementItem[]>;

type Interaction =
  | {
      type: "move";
      id: string;
      startClientX: number;
      startClientY: number;
      startX: number;
      startY: number;
    }
  | { type: "resize"; id: string };

type LayerAction = "front" | "forward" | "backward" | "back";

const MAX_ITEM_COUNT = 10;
const MIN_ITEM_WIDTH = 5;
const MAX_ITEM_WIDTH = 100;
const DEFAULT_ITEM_WIDTH = 25;
const CANVAS_HEIGHT = "min(560px, 70vh)";

const LAYER_ACTIONS: { value: LayerAction; label: string }[] = [
  { value: "front", label: "맨 앞" },
  { value: "forward", label: "앞으로" },
  { value: "backward", label: "뒤로" },
  { value: "back", label: "맨 뒤" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createItemId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadImageRatio(src: string) {
  return new Promise<number>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) {
        reject(new Error("이미지 크기를 확인할 수 없습니다."));
        return;
      }
      resolve(image.naturalWidth / image.naturalHeight);
    };
    image.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
    image.src = src;
  });
}

interface RangeFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}

function RangeField({ label, value, min, max, unit, onChange }: RangeFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center justify-between text-sm leading-5 text-gray-900">
        {label}
        <span className="text-gray-600">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-primary-500"
      />
    </label>
  );
}

interface SpacePlacementModalProps {
  images: string[];
  initialIndex: number;
  placements: SpacePlacements;
  onPlacementsChange: Dispatch<SetStateAction<SpacePlacements>>;
  onClose: () => void;
}

export function SpacePlacementModal({
  images,
  initialIndex,
  placements,
  onPlacementsChange,
  onClose,
}: SpacePlacementModalProps) {
  const [index, setIndex] = useState(initialIndex);
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<Interaction | null>(null);

  const imageCount = images.length;
  const imageUrl = images[index];
  const imageRatio = imageRatios[imageUrl];
  const items = placements[imageUrl] ?? [];
  const selectedIndex = items.findIndex((item) => item.id === selectedId);
  const selectedItem = items[selectedIndex];
  const isFull = items.length >= MAX_ITEM_COUNT;
  const canAdd = Boolean(imageRatio) && !isFull && !isAdding;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const updateItems = (
    updater: (items: PlacementItem[]) => PlacementItem[],
  ) => {
    onPlacementsChange((prev) => ({
      ...prev,
      [imageUrl]: updater(prev[imageUrl] ?? []),
    }));
  };

  const updateItem = (id: string, changes: Partial<PlacementItem>) => {
    updateItems((items) =>
      items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  };

  const changeImage = (nextIndex: number) => {
    setIndex(nextIndex);
    setSelectedId(null);
    setError(null);
  };

  const goPrev = () => {
    if (imageCount === 0) return;
    changeImage((index - 1 + imageCount) % imageCount);
  };
  const goNext = () => {
    if (imageCount === 0) return;
    changeImage((index + 1) % imageCount);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !imageRatio) return;

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 추가할 수 있습니다.");
      return;
    }

    if (isFull) {
      setError(`물품 사진은 최대 ${MAX_ITEM_COUNT}장까지 넣을 수 있습니다.`);
      return;
    }

    setError(null);
    setIsAdding(true);

    const src = URL.createObjectURL(file);

    try {
      const aspectRatio = await loadImageRatio(src);
      // 세로로 긴 사진이 공간 사진 높이의 절반을 넘지 않도록 기본 너비를 줄입니다.
      const width = clamp(
        Math.min(DEFAULT_ITEM_WIDTH, (50 * aspectRatio) / imageRatio),
        MIN_ITEM_WIDTH,
        MAX_ITEM_WIDTH,
      );
      const item: PlacementItem = {
        id: createItemId(),
        src,
        fileName: file.name,
        x: 50,
        y: 50,
        width,
        aspectRatio,
        rotation: 0,
        opacity: 100,
      };

      updateItems((items) => [...items, item]);
      setSelectedId(item.id);
    } catch {
      URL.revokeObjectURL(src);
      setError("사진을 불러오지 못했습니다. 다른 사진을 선택해주세요.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    URL.revokeObjectURL(target.src);
    updateItems((items) => items.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleLayerChange = (id: string, action: LayerAction) => {
    updateItems((items) => {
      const from = items.findIndex((item) => item.id === id);
      if (from === -1) return items;

      const lastIndex = items.length - 1;
      const to =
        action === "front"
          ? lastIndex
          : action === "back"
            ? 0
            : action === "forward"
              ? Math.min(from + 1, lastIndex)
              : Math.max(from - 1, 0);

      if (from === to) return items;

      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleItemPointerDown = (
    event: PointerEvent<HTMLDivElement>,
    item: PlacementItem,
  ) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedId(item.id);
    interactionRef.current = {
      type: "move",
      id: item.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: item.x,
      startY: item.y,
    };
  };

  const handleResizePointerDown = (
    event: PointerEvent<HTMLSpanElement>,
    item: PlacementItem,
  ) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    interactionRef.current = { type: "resize", id: item.id };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current;
    const canvas = canvasRef.current;
    if (!interaction || !canvas) return;

    const rect = canvas.getBoundingClientRect();

    if (interaction.type === "move") {
      updateItem(interaction.id, {
        x: clamp(
          interaction.startX +
            ((event.clientX - interaction.startClientX) / rect.width) * 100,
          0,
          100,
        ),
        y: clamp(
          interaction.startY +
            ((event.clientY - interaction.startClientY) / rect.height) * 100,
          0,
          100,
        ),
      });
      return;
    }

    const item = items.find((item) => item.id === interaction.id);
    if (!item) return;

    // 중심점에서 포인터까지의 거리를 대각선 절반으로 보고 너비를 계산합니다.
    // 회전 여부와 상관없이 원본 비율을 유지한 채 중심 기준으로 커지고 작아집니다.
    const centerX = rect.left + (item.x / 100) * rect.width;
    const centerY = rect.top + (item.y / 100) * rect.height;
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
    const width = (2 * distance) / Math.sqrt(1 + 1 / item.aspectRatio ** 2);

    updateItem(interaction.id, {
      width: clamp((width / rect.width) * 100, MIN_ITEM_WIDTH, MAX_ITEM_WIDTH),
    });
  };

  const handlePointerUp = () => {
    interactionRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/55 px-4">
      <div className="flex w-full max-w-[1200px] flex-col rounded-[20px] bg-white px-8 py-7 shadow-[0px_16px_40px_0px_rgba(33,41,48,0.2)]">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-xl leading-7 font-semibold text-gray-900">
            배치 미리보기
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex size-7 items-center justify-center text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-5" />

        <div className="flex w-full gap-6">
          <div
            className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-gray-100 px-4"
            style={{ height: CANVAS_HEIGHT }}
          >
            <div
              ref={canvasRef}
              className="relative"
              onPointerDown={() => setSelectedId(null)}
              style={
                imageRatio
                  ? {
                      width: `min(100%, calc(${CANVAS_HEIGHT} * ${imageRatio}))`,
                      aspectRatio: imageRatio,
                    }
                  : { width: "100%", height: "100%" }
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={imageUrl}
                src={imageUrl}
                alt={`${index + 1}번째 공간 사진`}
                draggable={false}
                onLoad={(event) => {
                  const { naturalWidth, naturalHeight } = event.currentTarget;
                  if (!naturalWidth || !naturalHeight) return;
                  setImageRatios((prev) => ({
                    ...prev,
                    [imageUrl]: naturalWidth / naturalHeight,
                  }));
                }}
                onError={() => setError("공간 사진을 불러오지 못했습니다.")}
                className="size-full object-contain select-none"
              />

              {imageRatio &&
                items.map((item) => {
                  const isSelected = item.id === selectedId;

                  return (
                    <div
                      key={item.id}
                      onPointerDown={(event) => handleItemPointerDown(event, item)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                      className={`absolute cursor-move touch-none select-none ${
                        isSelected ? "outline-2 outline-primary-500" : ""
                      }`}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        width: `${item.width}%`,
                        aspectRatio: item.aspectRatio,
                        transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.src}
                        alt={item.fileName}
                        draggable={false}
                        className="size-full"
                        style={{ opacity: item.opacity / 100 }}
                      />
                      {isSelected && (
                        <>
                          <button
                            type="button"
                            aria-label="물품 사진 삭제"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={() => handleRemove(item.id)}
                            className="absolute -top-3 -right-3 flex size-6 items-center justify-center rounded-full bg-white text-gray-600 shadow-[0px_2px_8px_0px_rgba(33,41,48,0.15)]"
                          >
                            <X size={14} />
                          </button>
                          <span
                            aria-hidden
                            onPointerDown={(event) =>
                              handleResizePointerDown(event, item)
                            }
                            className="absolute -right-1.5 -bottom-1.5 size-3 cursor-nwse-resize rounded-full border-2 border-white bg-primary-500"
                          />
                        </>
                      )}
                    </div>
                  );
                })}
            </div>

            <button
              type="button"
              aria-label="이전 이미지"
              onClick={goPrev}
              disabled={imageCount <= 1}
              className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-600 shadow-[0px_2px_8px_0px_rgba(33,41,48,0.15)]"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white">
              {index + 1} / {imageCount}
            </span>
            <button
              type="button"
              aria-label="다음 이미지"
              onClick={goNext}
              disabled={imageCount <= 1}
              className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-600 shadow-[0px_2px_8px_0px_rgba(33,41,48,0.15)]"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div
            className="flex w-[320px] shrink-0 flex-col gap-5 overflow-y-auto"
            style={{ height: CANVAS_HEIGHT }}
          >
            <div className="flex items-center justify-between">
              <p className="text-base leading-[25px] font-semibold text-gray-900">
                물품 사진
              </p>
              <span className="text-sm leading-5 text-gray-600">
                {items.length} / {MAX_ITEM_COUNT}
              </span>
            </div>

            <label
              className={`flex h-[120px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-600 transition-colors ${
                canAdd
                  ? "cursor-pointer hover:border-primary-400 hover:bg-primary-50"
                  : "cursor-not-allowed opacity-60"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                disabled={!canAdd}
                onChange={handleFileChange}
                className="sr-only"
              />
              <span className="text-[26px] leading-none">+</span>
              <span className="px-3 text-center text-[13px] leading-5 font-medium">
                {isAdding
                  ? "불러오는 중"
                  : isFull
                    ? `최대 ${MAX_ITEM_COUNT}장까지 넣을 수 있습니다`
                    : "물품 사진 추가"}
              </span>
            </label>

            {error && <p className="text-sm text-red-700">{error}</p>}

            {selectedItem ? (
              <div className="flex shrink-0 flex-col gap-4 rounded-xl border border-gray-300 p-4">
                <RangeField
                  label="회전"
                  value={selectedItem.rotation}
                  min={-180}
                  max={180}
                  unit="°"
                  onChange={(rotation) =>
                    updateItem(selectedItem.id, { rotation })
                  }
                />
                <RangeField
                  label="투명도"
                  value={selectedItem.opacity}
                  min={10}
                  max={100}
                  unit="%"
                  onChange={(opacity) => updateItem(selectedItem.id, { opacity })}
                />
                <div className="flex flex-col gap-2">
                  <span className="text-sm leading-5 text-gray-900">
                    겹침 순서
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {LAYER_ACTIONS.map((action) => {
                      const disabled =
                        action.value === "front" || action.value === "forward"
                          ? selectedIndex === items.length - 1
                          : selectedIndex === 0;

                      return (
                        <button
                          key={action.value}
                          type="button"
                          disabled={disabled}
                          onClick={() =>
                            handleLayerChange(selectedItem.id, action.value)
                          }
                          className="rounded-lg border border-gray-300 py-2 text-[13px] leading-5 text-gray-900 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                        >
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              items.length > 0 && (
                <p className="text-sm leading-5 text-gray-600">
                  사진을 선택하면 회전, 투명도, 겹침 순서를 바꿀 수 있습니다.
                </p>
              )
            )}

            {items.length > 0 && (
              <ul className="flex flex-col gap-2">
                {[...items].reverse().map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-center gap-3 rounded-xl border p-2 ${
                      item.id === selectedId
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span
                        className="size-10 shrink-0 rounded-lg bg-gray-100 bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${item.src})` }}
                      />
                      <span className="truncate text-sm leading-5 text-gray-900">
                        {item.fileName}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`${item.fileName} 삭제`}
                      onClick={() => handleRemove(item.id)}
                      className="flex size-7 shrink-0 items-center justify-center text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
