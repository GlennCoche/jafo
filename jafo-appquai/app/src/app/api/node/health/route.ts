import { getQuaiApiBaseUrl } from "@/lib/quai";
import { NextResponse } from "next/server";

export async function GET() {
  const base = getQuaiApiBaseUrl();
  try {
    const res = await fetch(`${base}/health`, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    const data = res.ok ? await res.json().catch(() => ({})) : null;
    return NextResponse.json(
      { ok: res.ok, status: res.status, ...data },
      { status: res.ok ? 200 : 502 }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Node unreachable";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 502 }
    );
  }
}
