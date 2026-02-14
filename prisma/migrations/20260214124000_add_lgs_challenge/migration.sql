-- CreateTable
CREATE TABLE "LgsAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "challengeId" TEXT NOT NULL,
    "matrixLabel" TEXT NOT NULL,
    "systemSize" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "operationCount" INTEGER NOT NULL,
    "solvedValues" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "xpAwarded" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LgsAttempt_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
