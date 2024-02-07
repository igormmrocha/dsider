// import the required dependencies and modules
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { question, userEmail, questionType, possibleAnswers, refreshTime } = req.body;

  if (!question.trim() || !userEmail || !questionType) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  let newAnswer;

  if (questionType === 'yesNo') {
    const randomNumber = Math.floor(Math.random() * 2);
    newAnswer = randomNumber === 0 ? 'Sim' : 'Não';
  } else if (questionType === 'multipleChoice' && possibleAnswers) {
    const answersArray = possibleAnswers.split(',').map(answer => answer.trim());

    if (answersArray.length >= 2 && answersArray.every(answer => answer.length <= 40)) {
      const randomIndex = Math.floor(Math.random() * answersArray.length);
      newAnswer = answersArray[randomIndex];
    } else {
      return res.status(400).json({ error: 'Pelo menos duas respostas possíveis separadas por vírgula.' });
    }
  } 
  else if (questionType === 'qrCode') {
    newAnswer = null;
  } 
  
  else{
    return res.status(400).json({ error: 'Questão inválida ou não tem respostas possíveis' });
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
        refreshTime: 0
      },
    });

    return res.status(200).json({ answer: newAnswer, question: savedQuestion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error prisma', prismaError: error.message });
  }
}
