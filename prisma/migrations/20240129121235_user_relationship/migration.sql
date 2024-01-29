-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
