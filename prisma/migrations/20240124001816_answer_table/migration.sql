-- CreateTable
CREATE TABLE "QrAnswer" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answerName" TEXT NOT NULL,
    "answerEmail" TEXT NOT NULL,
    "answer" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QrAnswer_pkey" PRIMARY KEY ("id")
);
