"use client";

import { Search } from "lucide-react";
import type { KeyboardEvent } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "검색어를 입력해주세요.",
  className = "",
}: SearchInputProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit?.(value);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-full border-[2.5px] border-primary-500 bg-white py-1.5 pl-[18px] pr-1.5 ${className}`}
    >
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-base text-gray-600 outline-none placeholder:text-gray-600"
      />
      <button
        type="button"
        aria-label="검색"
        onClick={() => onSubmit?.(value)}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white"
      >
        <Search size={16} />
      </button>
    </div>
  );
}
