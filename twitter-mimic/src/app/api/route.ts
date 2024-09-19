import { NextResponse } from "next/server";

export interface UserData {
    userName: string;
}

export async function GET() {
  const data = { name: '@Juan' };

  return NextResponse.json(data, { status: 200 });
}
