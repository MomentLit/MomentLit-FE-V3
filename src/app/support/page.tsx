import { SupportForm } from "@/widgets/support";

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-6 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-[40px] leading-[58px] font-bold text-black">
          건의함
        </h1>
        <p className="text-sm text-gray-600">
          이용하시면서 불편했던 점이나 버그, 제안하고 싶은 기능이 있다면
          편하게 알려주세요.
        </p>
      </div>

      <div className="max-w-[560px]">
        <SupportForm />
      </div>
    </div>
  );
}
