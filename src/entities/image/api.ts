import { apiClient, type ApiResponse } from "@/shared/api";

interface ImageUploadResponse {
  image_url: string;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<ImageUploadResponse>>(
    "/images/upload",
    formData,
  );

  const imageUrl = response.data.data.image_url;

  if (!imageUrl) {
    throw new Error("이미지 업로드 응답에 이미지 URL이 없습니다.");
  }

  return imageUrl;
}
