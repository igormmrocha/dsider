-- AddForeignKey
ALTER TABLE "QrAnswer" ADD CONSTRAINT "QrAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
