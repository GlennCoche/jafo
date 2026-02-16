import { getMinerIp } from "@/lib/miner";
import { NextResponse } from "next/server";

export async function GET() {
  const minerIp = getMinerIp();
  return NextResponse.json({ minerIp: minerIp || null });
}
