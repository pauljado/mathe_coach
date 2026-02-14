import { NextRequest, NextResponse } from "next/server";

import { createTrigonometryChallenge, normalizeTrigCategories } from "@/lib/trigonometry/generator";

export function GET(request: NextRequest) {
  const categoriesParam = request.nextUrl.searchParams.get("categories") ?? "";
  const requestedCategories = categoriesParam.split(",").map((item) => item.trim()).filter(Boolean);
  const categories = normalizeTrigCategories(requestedCategories);

  const challenge = createTrigonometryChallenge(categories);
  return NextResponse.json(challenge);
}
