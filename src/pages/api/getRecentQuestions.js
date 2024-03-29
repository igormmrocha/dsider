// pages/api/getRecentQuestions.js

import prisma from '../../lib/prisma';
import { format, startOfDay, endOfDay } from 'date-fns';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const {userEmail} = req.body;
  console.log(userEmail);
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    if (userEmail === undefined) {
      return res.status(500).json({ error: 'error undefined' }); 
    }

    const recentQuestions = await prisma.question.findMany({
      where: {
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
        userEmail: userEmail,
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, questionType:true, question: true, answer: true, possibleAnswers: true },
    });

    await prisma.$disconnect(); // Disconnect the Prisma client

    res.status(200).json(recentQuestions);
  } catch (error) {
    console.error('Error fetching recent questions:', error);
    await prisma.$disconnect(); // Disconnect the Prisma client
    res.status(500).json({ error: 'Internal server error' });
  }
}
