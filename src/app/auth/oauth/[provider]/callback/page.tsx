import { OAuthCallbackContent } from "./OAuthCallbackContent";

function firstSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function OAuthCallbackPage({
  params,
  searchParams,
}: PageProps<"/auth/oauth/[provider]/callback">) {
  const { provider } = await params;
  const resolvedSearchParams = await searchParams;
  const code = firstSearchParam(resolvedSearchParams.code);
  const state = firstSearchParam(resolvedSearchParams.state) ?? undefined;

  return (
    <OAuthCallbackContent provider={provider} code={code} state={state} />
  );
}
