import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BidInput {
  playerId: string;
  sectionId: string;
  amount: number;
  preference: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { bids } = req.body as { bids: BidInput[] };

    if (!Array.isArray(bids) || bids.length === 0) {
      return res.status(400).json({ error: 'Invalid bids data' });
    }

    // Get user and their budget info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sectionId = bids[0].sectionId;

    // Get the maximum bid in this section
    const maxBidInSection = Math.max(...bids.map((b) => b.amount));

    // Check if user has enough budget
    const availableBudget = user.totalBudget - user.spentBudget;
    if (maxBidInSection > availableBudget) {
      return res.status(400).json({
        error: 'Insufficient budget for this bid',
        availableBudget,
        requiredBudget: maxBidInSection,
      });
    }

    // Delete existing bids for this section from this user
    await prisma.bid.deleteMany({
      where: {
        userId: session.user.id,
        sectionId: sectionId,
      },
    });

    // Create new bids
    const createdBids = await Promise.all(
      bids.map((bid) =>
        prisma.bid.create({
          data: {
            userId: session.user.id,
            playerId: bid.playerId,
            sectionId: bid.sectionId,
            amount: bid.amount,
            preference: bid.preference,
            status: 'pending',
          },
          include: {
            player: true,
            section: true,
          },
        })
      )
    );

    // Update section budget
    await prisma.sectionBudget.upsert({
      where: {
        userId_sectionId: {
          userId: session.user.id,
          sectionId: sectionId,
        },
      },
      update: {
        maxBidInSection: maxBidInSection,
      },
      create: {
        userId: session.user.id,
        sectionId: sectionId,
        maxBidInSection: maxBidInSection,
      },
    });

    // Update user's spent budget
    const totalSectionBudgets = await prisma.sectionBudget.aggregate({
      where: { userId: session.user.id },
      _sum: { maxBidInSection: true },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        spentBudget: totalSectionBudgets._sum.maxBidInSection || 0,
      },
    });

    return res.status(201).json({
      message: 'Bids submitted successfully',
      bids: createdBids,
      remainingBudget: user.totalBudget - (totalSectionBudgets._sum.maxBidInSection || 0),
    });
  } catch (error) {
    console.error('Bid submission error:', error);
    return res.status(500).json({ error: 'Failed to submit bids' });
  }
}
