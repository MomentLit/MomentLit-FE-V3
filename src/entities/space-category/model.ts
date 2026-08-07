export type SpaceCategory =
  | "PRACTICE_ROOM"
  | "STUDIO"
  | "MEETING_ROOM"
  | "PARTY_ROOM"
  | "CLASSROOM"
  | "POPUP_STORE"
  | "OFFICE"
  | "HALL"
  | "CAFE"
  | "OTHER";

export const SPACE_CATEGORY_LABELS: Record<SpaceCategory, string> = {
  PRACTICE_ROOM: "연습실",
  STUDIO: "스튜디오",
  MEETING_ROOM: "회의실",
  PARTY_ROOM: "파티룸",
  CLASSROOM: "강의실",
  POPUP_STORE: "팝업스토어",
  OFFICE: "오피스",
  HALL: "홀",
  CAFE: "카페",
  OTHER: "기타",
};

export const SPACE_CATEGORIES = Object.keys(
  SPACE_CATEGORY_LABELS,
) as SpaceCategory[];
