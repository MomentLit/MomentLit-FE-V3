import Image from "next/image";

export function Footer() {
  return (
    <footer className="flex flex-col gap-2.5 py-7 pl-[10px]">
      <Image
        src="/images/footer-symbol.svg"
        alt="모먼트릿"
        width={41}
        height={26}
      />
      <p className="text-[15px] leading-[22px] text-gray-600">
        모먼트릿은 공간 제공자와 이용자를 연결하는 플랫폼입니다.
        <br />
        예약 이후의 이용 조건, 결제, 환불 및 분쟁에 관한 사항은 공간
        제공자와 이용자 간의 책임입니다.
        <br />
        본 서비스는 학교 프로젝트로 제작되었으며 결제 기능은 지원하지
        않습니다.
      </p>
      <p className="text-[15px] leading-[22px] text-gray-600">
        © 2026 MomentLit. All rights reserved.
      </p>
    </footer>
  );
}
