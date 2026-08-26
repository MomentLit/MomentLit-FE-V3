"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/entities/auth";

interface LogoutModalProps {
  onClose: () => void;
}

export function LogoutModal({ onClose }: LogoutModalProps) {
  const router = useRouter();

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      onClose();
      router.push("/");
    },
  });

  const handleLogout = () => {
    signOutMutation.mutate();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[420px] flex-col items-center rounded-2xl bg-white px-8 pt-9 pb-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-primary-100">
          <LogOut size={24} className="text-primary-500" />
        </div>
        <p className="mt-5 text-center text-2xl font-semibold text-gray-900">
          로그아웃 하시겠어요?
        </p>
        <p className="mt-2.5 text-center text-[15px] text-gray-600">
          로그아웃하면 다시 로그인해야 서비스를 이용할 수 있어요.
        </p>
        <div className="mt-7 flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 py-3.5 text-base text-gray-900"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleLogout}
            disabled={signOutMutation.isPending}
            className="flex-1 rounded-xl bg-primary-500 py-3.5 text-base text-white disabled:bg-gray-300"
          >
            {signOutMutation.isPending ? "로그아웃 중" : "로그아웃"}
          </button>
        </div>
      </div>
    </div>
  );
}
