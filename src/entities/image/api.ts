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

  return response.data.data.image_url;
}
