import { prisma } from "@/lib/prisma";

const DEFAULT_PROFILE_ID = 1;

export async function getOrCreateProfile() {
  const existing = await prisma.profile.findUnique({ where: { id: DEFAULT_PROFILE_ID } });
  if (existing) {
    return existing;
  }

  return prisma.profile.create({
    data: {
      id: DEFAULT_PROFILE_ID,
      displayName: "Learner"
    }
  });
}

export { DEFAULT_PROFILE_ID };
