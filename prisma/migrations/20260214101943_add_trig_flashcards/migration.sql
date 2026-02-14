-- CreateTable
CREATE TABLE "TrigFlashcardAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "challengeId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "promptEn" TEXT NOT NULL,
    "promptDe" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "answerDe" TEXT NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "xpAwarded" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrigFlashcardAttempt_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
