// pages/api/getRecentQuestions.js

import prisma from '../../lib/prisma';


export default async function handler(_, res) {
  
  try {
    
    const BaseLink = await prisma.param.findFirst({
        select: {
          baselink: true,
        },
      });
    await prisma.$disconnect(); // Disconnect the Prisma client
    
    res.status(200).json(BaseLink);
  } catch (error) {
    console.error('Error fetching base link:', error);
    await prisma.$disconnect(); // Disconnect the Prisma client
    res.status(500).json({ error: 'Internal server error' });
  }
}
