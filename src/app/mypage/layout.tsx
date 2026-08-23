import { MyPagePanel } from "@/widgets/mypage";

export default function MyPageLayout({ children }: LayoutProps<"/mypage">) {
  return (
    <div className="flex">
      <MyPagePanel />
      <div className="flex-1 p-10">{children}</div>
    </div>
  );
}
