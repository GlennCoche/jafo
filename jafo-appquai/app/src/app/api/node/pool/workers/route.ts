import { getQuaiApiBaseUrl } from "@/lib/quai";
import { NextResponse } from "next/server";

export async function GET() {
  const base = getQuaiApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/pool/workers`, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Node unreachable";
    return NextResponse.json(
      { error: message },
      { status: 502 }
    );
  }
}
