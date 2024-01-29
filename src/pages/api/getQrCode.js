// pages/api/getRecentQuestions.js

import prisma from '../../lib/prisma';
import { format, startOfDay, endOfDay } from 'date-fns';

export default async function handler(req, res) {
  const {userEmail} = req.body;
  try {
    const today = new Date();
    console.log(userEmail);
    
    if (userEmail === undefined) {
      return res.status(500).json({ error: 'error undefined' }); 
    }

    const recentQuestions = await prisma.question.findFirst({
      where: {
        userEmail: userEmail,
        questionType: "qrCode",
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        qrAnswers: true,
        user: { // Use PascalCase for the model name
          select: {
            id: true,
            name: true,
            // Add other user fields you want to include
          },
        },
      },
    });
    await prisma.$disconnect(); // Disconnect the Prisma client
    
    res.status(200).json(recentQuestions);
  } catch (error) {
    console.error('Error fetching recent questions:', error);
    await prisma.$disconnect(); // Disconnect the Prisma client
    res.status(500).json({ error: 'Internal server error' });
  }
}
