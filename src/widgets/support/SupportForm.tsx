"use client";

import { useState, type FormEvent } from "react";

type SupportCategory = "BUG" | "FEATURE" | "ETC";

const CATEGORIES: { value: SupportCategory; label: string }[] = [
  { value: "BUG", label: "버그 신고" },
  { value: "FEATURE", label: "기능 제안" },
  { value: "ETC", label: "기타" },
];

export function SupportForm() {
  const [category, setCategory] = useState<SupportCategory>("BUG");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    // TODO: 건의사항 저장 API가 아직 없어서 로컬에서만 접수 처리함.
    setIsSubmitted(true);
  };

  const handleWriteAnother = () => {
    setCategory("BUG");
    setTitle("");
    setContent("");
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white px-8 py-16 text-center">
        <p className="text-xl font-semibold text-gray-900">
          건의사항이 접수되었어요
        </p>
        <p className="text-sm text-gray-600">
          소중한 의견 감사합니다. 검토 후 서비스 개선에 반영할게요.
        </p>
        <button
          type="button"
          onClick={handleWriteAnother}
          className="mt-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-medium text-white"
        >
          건의사항 더 남기기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8"
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-gray-600">유형</span>
        <div className="flex gap-2">
          {CATEGORIES.map((item) => {
            const isActive = item.value === category;
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setCategory(item.value)}
                className={`flex-1 rounded-xl border py-3 text-sm font-medium ${
                  isActive
                    ? "border-primary-500 bg-primary-100 text-primary-600"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-gray-600">제목</span>
        <input
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="어떤 내용인지 한 줄로 알려주세요"
          className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary-500"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-gray-600">내용</span>
        <textarea
          required
          rows={8}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="불편했던 점이나 제안하고 싶은 기능을 자세히 적어주세요"
          className="resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary-500"
        />
      </label>

      <button
        type="submit"
        disabled={!isValid}
        className="rounded-xl bg-primary-500 py-3.5 text-base font-medium text-white disabled:bg-gray-300"
      >
        건의사항 보내기
      </button>
    </form>
  );
}
