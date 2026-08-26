import { apiClient, type ApiResponse } from "@/shared/api";
import type { UserProfileUpdate } from "./model";

export interface UserProfile extends UserProfileUpdate {
  email: string;
  role: string;
  created_at: string;
}

export async function getMyProfile() {
  const response =
    await apiClient.get<ApiResponse<UserProfile>>("/users/me");

  return response.data.data;
}

export async function updateMyProfile(payload: UserProfileUpdate) {
  await apiClient.patch("/users/me", payload);
}
