import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const CONFIG_DIR = process.env.CONFIG_DIR || "./data/config";
const SETTINGS_FILE = "settings.json";

export type NodeConfig = {
  quaiCoinbases: string;
  qiCoinbases: string;
  minerPreference: number;
  coinbaseLockup: number;
};

const defaultConfig: NodeConfig = {
  quaiCoinbases: "0x00433b2AdDF610eA8280B9A929F1db8fbF0E3678",
  qiCoinbases: "0x00433b2AdDF610eA8280B9A929F1db8fbF0E3678",
  minerPreference: 0.5,
  coinbaseLockup: 0,
};

function getSettingsPath(): string {
  return join(CONFIG_DIR, SETTINGS_FILE);
}

export async function GET() {
  try {
    const path = getSettingsPath();
    const raw = await readFile(path, "utf-8");
    const data = JSON.parse(raw) as Partial<NodeConfig>;
    const mp = Number(data.minerPreference);
    const cl = Number(data.coinbaseLockup);
    const config: NodeConfig = {
      quaiCoinbases: data.quaiCoinbases ?? defaultConfig.quaiCoinbases,
      qiCoinbases: data.qiCoinbases ?? defaultConfig.qiCoinbases,
      minerPreference: Number.isFinite(mp) ? mp : defaultConfig.minerPreference,
      coinbaseLockup: Number.isFinite(cl) ? cl : defaultConfig.coinbaseLockup,
    };
    return NextResponse.json(config);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json(defaultConfig);
    }
    const message = e instanceof Error ? e.message : "Read failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<NodeConfig>;
    const config: NodeConfig = {
      quaiCoinbases:
        typeof body.quaiCoinbases === "string"
          ? body.quaiCoinbases
          : defaultConfig.quaiCoinbases,
      qiCoinbases:
        typeof body.qiCoinbases === "string"
          ? body.qiCoinbases
          : defaultConfig.qiCoinbases,
      minerPreference:
        typeof body.minerPreference === "number"
          ? body.minerPreference
          : defaultConfig.minerPreference,
      coinbaseLockup:
        typeof body.coinbaseLockup === "number"
          ? body.coinbaseLockup
          : defaultConfig.coinbaseLockup,
    };
    const path = getSettingsPath();
    await mkdir(CONFIG_DIR, { recursive: true });
    await writeFile(path, JSON.stringify(config, null, 2), "utf-8");
    return NextResponse.json(config);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Write failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
