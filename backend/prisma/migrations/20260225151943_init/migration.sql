-- CreateTable
CREATE TABLE "InterviewSession" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'STARTED',

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);
