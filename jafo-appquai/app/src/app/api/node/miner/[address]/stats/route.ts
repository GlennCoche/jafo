import { getQuaiApiBaseUrl } from "@/lib/quai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  if (!address) {
    return NextResponse.json({ error: "address required" }, { status: 400 });
  }
  const base = getQuaiApiBaseUrl();
  const encoded = encodeURIComponent(address);
  try {
    const res = await fetch(`${base}/api/miner/${encoded}/stats`, {
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
