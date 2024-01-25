import prisma from '../../lib/prisma';
//import { getSession } from 'next-auth/server';

export default async function handler(req, res) {
  //const session = await getSession({ req });

  //if (!session) {
  //  return res.status(401).json({ error: 'Unauthorized' });
  //}
  const { question, userEmail, userPhoto, userName } = req.body;
  var question_int = parseInt(question, 10)

  if (!question.trim() || !userEmail || !userPhoto || !userName) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  try {
    
    const existingQuestion = await prisma.question.findFirst({
      where: {
        id: question_int,
        questionType: 'qrCode',
      },
      select: {  userEmail:true, createdAt:true, refreshTime: true, lastRefreshed:true },
    });

    if (existingQuestion) {
      const { lastRefreshed, refreshTime } = existingQuestion;
      const currentTime = new Date().getTime();
      const minutesSinceLastRefresh = (currentTime - lastRefreshed) / (1000 * 60);
      const randomNumber = Math.floor(Math.random() * 2);
      let newAnswer = randomNumber === 0 ? true : false;

      if (minutesSinceLastRefresh >= refreshTime) {
        await prisma.question.update({
          where: { id:question_int },
          data: { lastRefreshed: new Date(currentTime)},
        });

        await prisma.qrAnswer.create({
          data: {
            question_id: question_int,
            answerName: userName,
            answerEmail: userEmail,
            answer: newAnswer,
            createdAt: new Date(currentTime)
          },
        });

        res.status(200).json(existingQuestion);
      } 
      
     else {
      const timeRemaining = refreshTime - minutesSinceLastRefresh
      res.status(200).json({timeRemaining});
    }
  }
  } catch (error) {
    console.error('Error validating QR code:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
