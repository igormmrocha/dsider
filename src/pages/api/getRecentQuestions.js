// pages/api/getRecentQuestions.js

import prisma from '../../lib/prisma';
import { format, startOfDay, endOfDay } from 'date-fns';

export default async function handler(_, res) {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const recentQuestions = await prisma.question.findMany({
      where: {
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, userEmail: true, question: true, answer: true },
    });

    await prisma.$disconnect(); // Disconnect the Prisma client

    res.status(200).json(recentQuestions);
  } catch (error) {
    console.error('Error fetching recent questions:', error);
    await prisma.$disconnect(); // Disconnect the Prisma client
    res.status(500).json({ error: 'Internal server error' });
  }
}
