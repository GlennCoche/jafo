export function getQuaiApiBaseUrl(): string {
  const url = process.env.GO_QUAI_API_URL || "http://go-quai:3336";
  return url.replace(/\/$/, "");
}
