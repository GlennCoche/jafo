import { getMinerBaseUrl, normalizeMinerInfo } from "@/lib/miner";
import { NextResponse } from "next/server";

export async function GET() {
  const base = getMinerBaseUrl();
  if (!base) {
    return NextResponse.json(
      { error: "MINER_IP not configured" },
      { status: 503 }
    );
  }
  try {
    const res = await fetch(`${base}/api/system/info`, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return NextResponse.json(normalizeMinerInfo(data));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Miner unreachable";
    return NextResponse.json(
      { error: message },
      { status: 502 }
    );
  }
}
