import { NextRequest, NextResponse } from "next/server";

import { createGraphingChallenge } from "@/lib/challenges/generator";
import { functionFamilies, type FunctionFamily } from "@/types/challenge";

export function GET(request: NextRequest) {
  const familyParam = request.nextUrl.searchParams.get("family") ?? "all";
  const family = functionFamilies.includes(familyParam as FunctionFamily)
    ? (familyParam as FunctionFamily)
    : "all";

  const challenge = createGraphingChallenge(family);
  return NextResponse.json(challenge);
}
