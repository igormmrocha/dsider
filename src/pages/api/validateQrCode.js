// components/QrCodeValidator.tsx
// ... other imports

export default async function handler(req, res) {
  const { question, userEmail, userPhoto, userName } = req.body;
  var question_int = parseInt(question, 10);

  if (!question.trim() || !userEmail || !userPhoto || !userName) {
    return res.status(400);
  }

  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const existingQuestion = await prisma.question.findFirst({
      where: {
        id: question_int,
        questionType: 'qrCode',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            // Add other user fields you want to include
          },
        },
      },
      //select: { question: true, userEmail: true, createdAt: true, refreshTime: true, lastRefreshed: true },
    });

    if (existingQuestion) {
      const { lastRefreshed, refreshTime } = existingQuestion;
      const currentTime = new Date().getTime();
      const minutesSinceLastRefresh = (currentTime - lastRefreshed) / (1000 * 60);
      const randomNumber = Math.floor(Math.random() * 2);
      let newAnswer = randomNumber === 0 ? true : false;

      if (minutesSinceLastRefresh >= refreshTime) {
        await prisma.question.update({
          where: { id: question_int },
          data: { lastRefreshed: new Date(currentTime) },
        });

        const existingAnswer = await prisma.qrAnswer.create({
          data: {
            question_id: question_int,
            answerName: userName,
            answerEmail: userEmail,
            answer: newAnswer,
            createdAt: new Date(currentTime),
          },
        });

        if (existingAnswer) {
          res.status(200).json({
            question: existingQuestion,
            answer: existingAnswer,
            timeRemaining: null, // Set timeRemaining to null when there is an answer
          });
        }
      } else {
        const timeRemaining = refreshTime - minutesSinceLastRefresh;
        res.status(200).json({
          question: existingQuestion,
          answer: null, // Set answer to null when there is time remaining
          timeRemaining,
        });
      }
    }
  } catch (error) {
    console.error('Error validating QR code:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
