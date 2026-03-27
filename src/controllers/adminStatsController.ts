import type { Request, Response } from 'express';
import prisma from '../models/index.js';

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        // Verify user is admin
        if (req.user?.type !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admins can access statistics' });
        }

        const [userCount, museumCount, siteCount, ticketCount, ticketRevenue, storyRevenue, siteRevenue] = await Promise.all([
            prisma.user.count(),
            prisma.museum.count(),
            prisma.heritageSite.count(),
            prisma.ticket.count({ where: { payment_status: 'completed' } }),
            prisma.payment.aggregate({ _sum: { amount: true } }),
            prisma.storyPayment.aggregate({
                where: { status: 'completed' },
                _sum: { amount: true }
            }),
            prisma.sitePayment.aggregate({
                where: { status: 'completed' },
                _sum: { amount: true }
            }),
        ]);

        const totalRevenue = (ticketRevenue._sum.amount || 0) +
            (storyRevenue._sum.amount || 0) +
            (siteRevenue._sum.amount || 0);

        return res.status(200).json({
            totalUsers: userCount,
            totalMuseums: museumCount,
            totalHeritageSites: siteCount,
            totalTickets: ticketCount,
            totalRevenue: totalRevenue,
        });
    } catch (error: any) {
        console.error('Error fetching admin stats:', error);
        return res.status(500).json({ message: 'Error fetching admin stats', error: error.message });
    }
};
