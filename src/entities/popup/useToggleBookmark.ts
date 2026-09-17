import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markPopupLiked, patchBookmarkInCache } from "@/shared/lib/bookmarks";
import { likePopup, unlikePopup } from "./api";

export function useTogglePopupBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, liked }: { id: string; liked: boolean }) =>
      liked ? unlikePopup(id) : likePopup(id),
    onMutate: ({ id, liked }) => {
      patchBookmarkInCache(queryClient, id, !liked);
      markPopupLiked(id, !liked);
    },
    onError: (_error, { id, liked }) => {
      patchBookmarkInCache(queryClient, id, liked);
      markPopupLiked(id, liked);
    },
    onSuccess: (result, { id }) => {
      patchBookmarkInCache(queryClient, id, result.liked);
      markPopupLiked(id, result.liked);
    },
  });
}
