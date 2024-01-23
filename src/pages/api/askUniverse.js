// import the required dependencies and modules
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { question, userEmail, questionType, possibleAnswers } = req.body;

  if (!question.trim() || !userEmail || !questionType) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  let newAnswer;

  if (questionType === 'yesNo') {
    const randomNumber = Math.floor(Math.random() * 2);
    newAnswer = randomNumber === 0 ? 'Yes' : 'No';
  } else if (questionType === 'multipleChoice' && possibleAnswers) {
    const answersArray = possibleAnswers.split(',').map(answer => answer.trim());

    if (answersArray.length >= 2 && answersArray.every(answer => answer.length <= 40)) {
      const randomIndex = Math.floor(Math.random() * answersArray.length);
      newAnswer = answersArray[randomIndex];
    } else {
      return res.status(400).json({ error: 'At least two possible answers, each with a maximum of 40 characters, are required for Multiple Choice questions.' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid question type or missing possible answers for Multiple Choice questions.' });
  }

  try {
    const savedQuestion = await prisma.question.create({
      data: {
        question: question,
        answer: newAnswer,
        questionType: questionType,
        possibleAnswers: questionType === 'multipleChoice' ? { set: possibleAnswers.split(',').map(answer => answer.trim()) } : { set: [] },
        userEmail: userEmail,
        createdAt: new Date(),
      },
    });

    return res.status(200).json({ answer: newAnswer, question: savedQuestion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error prisma', prismaError: error.message });
  }
}
