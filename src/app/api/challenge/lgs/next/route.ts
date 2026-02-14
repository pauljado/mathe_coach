import { NextRequest, NextResponse } from "next/server";

import { createLgsChallenge, normalizeLgsSize } from "@/lib/lgs/generator";

export function GET(request: NextRequest) {
  const sizeParam = request.nextUrl.searchParams.get("size");
  if (!sizeParam) {
    return NextResponse.json(createLgsChallenge());
  }

  const size = normalizeLgsSize(sizeParam);

  const challenge = createLgsChallenge(size);
  return NextResponse.json(challenge);
}
