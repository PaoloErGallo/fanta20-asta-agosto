import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sections = await prisma.auctionSection.findMany({
      orderBy: [{ day: 'asc' }, { order: 'asc' }],
    });

    return res.status(200).json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return res.status(500).json({ error: 'Failed to fetch sections' });
  }
}
