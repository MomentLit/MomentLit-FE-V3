import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markSpaceLiked, patchBookmarkInCache } from "@/shared/lib/bookmarks";
import { likeSpace, unlikeSpace } from "./api";

export function useToggleSpaceBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, liked }: { id: string; liked: boolean }) =>
      liked ? unlikeSpace(id) : likeSpace(id),
    onMutate: ({ id, liked }) => {
      patchBookmarkInCache(queryClient, id, !liked);
      markSpaceLiked(id, !liked);
    },
    onError: (_error, { id, liked }) => {
      patchBookmarkInCache(queryClient, id, liked);
      markSpaceLiked(id, liked);
    },
    onSuccess: (result, { id }) => {
      patchBookmarkInCache(queryClient, id, result.liked);
      markSpaceLiked(id, result.liked);
    },
  });
}
