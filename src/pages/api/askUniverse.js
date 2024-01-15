import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { question, userEmail } = req.body;

  if (!question.trim() || !userEmail) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const randomNumber = Math.floor(Math.random() * 2);
  const newAnswer = randomNumber === 0 ? 'Yes' : 'No';

  try {
    const savedQuestion = await prisma.question.create({
      data: {
        question: question,
        answer: newAnswer,
        userEmail: userEmail,
        createdAt: new Date(),
      },
    });

    return res.status(200).json({ answer: newAnswer, question: savedQuestion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}