export type ReservationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Reservation {
  id: string;
  spaceName: string;
  location: string;
  requestedStart: string;
  requestedEnd: string;
  timeStart: string;
  timeEnd: string;
  status: ReservationStatus;
}
