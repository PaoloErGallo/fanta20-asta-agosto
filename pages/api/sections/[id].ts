import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const section = await prisma.auctionSection.findUnique({
        where: { id: String(id) },
        include: {
          players: true,
        },
      });

      if (!section) {
        return res.status(404).json({ error: 'Section not found' });
      }

      return res.status(200).json(section);
    } catch (error) {
      console.error('Error fetching section:', error);
      return res.status(500).json({ error: 'Failed to fetch section' });
    }
  }

  if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized: Admin access required' });
    }

    try {
      const { name, day, order, status } = req.body;

      const updatedSection = await prisma.auctionSection.update({
        where: { id: String(id) },
        data: {
          ...(name && { name }),
          ...(day && { day }),
          ...(order && { order }),
          ...(status && { status }),
        },
      });

      return res.status(200).json(updatedSection);
    } catch (error) {
      console.error('Error updating section:', error);
      return res.status(500).json({ error: 'Failed to update section' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
