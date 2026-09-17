import type { QueryClient } from "@tanstack/react-query";

const SPACE_KEY = "momentlit_liked_space_ids";
const POPUP_KEY = "momentlit_liked_popup_ids";

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(ids));
}

function markLiked(key: string, id: string, liked: boolean) {
  const ids = new Set(readIds(key));
  if (liked) {
    ids.add(id);
  } else {
    ids.delete(id);
  }
  writeIds(key, [...ids]);
}

export function getLikedSpaceIds() {
  return readIds(SPACE_KEY);
}

export function getLikedPopupIds() {
  return readIds(POPUP_KEY);
}

export function markSpaceLiked(id: string, liked: boolean) {
  markLiked(SPACE_KEY, id, liked);
}

export function markPopupLiked(id: string, liked: boolean) {
  markLiked(POPUP_KEY, id, liked);
}

// The backend has no bulk "my liked items" endpoint, so bookmark state is
// tracked per-item in every list/detail query cache. This patches every
// cached query that holds the matching item (list arrays and single detail
// objects alike) so all pages stay in sync after a like/unlike.
export function patchBookmarkInCache(
  queryClient: QueryClient,
  id: string,
  liked: boolean,
) {
  queryClient.setQueriesData<unknown>({ predicate: () => true }, (old: unknown) => {
    if (Array.isArray(old)) {
      return old.map((item) =>
        item &&
        typeof item === "object" &&
        "id" in item &&
        "bookmarked" in item &&
        (item as { id: unknown }).id === id
          ? { ...item, bookmarked: liked }
          : item,
      );
    }
    if (
      old &&
      typeof old === "object" &&
      "id" in old &&
      "bookmarked" in old &&
      (old as { id: unknown }).id === id
    ) {
      return { ...old, bookmarked: liked };
    }
    return old;
  });
}
