import type { Request, Response } from 'express';
import prisma from '../models/index.js';
import { createNotification } from './notificationController.js';

export const verifyTicketQR = async (req: Request, res: Response) => {
    const { qr_code } = req.body;

    if (!qr_code) {
        return res.status(400).json({ message: 'QR code is required' });
    }

    try {
        const ticket = await prisma.ticket.findUnique({
            where: { qr_code },
            include: {
                museum: {
                    select: {
                        museum_id: true,
                        name: true,
                        opening_hours: true,
                        gps_coordinates: true,
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                        user_id: true
                    }
                }
            }
        });

        if (!ticket) {
            return res.status(404).json({ message: 'Invalid ticket' });
        }

        if (ticket.status === 'checked_in') {
            return res.status(400).json({
                message: 'Ticket already checked in',
                ticket
            });
        }

        const updatedTicket = await prisma.ticket.update({
            where: { ticket_id: ticket.ticket_id },
            data: { status: 'checked_in' }
        });

        // Notify the user that their ticket has been scanned
        try {
            await createNotification(
                ticket.user_id,
                'booking',
                'Ticket Verified',
                `Your entry for ${ticket.museum.name} has been successfully scanned. Enjoy your visit!`,
                ticket.ticket_id
            );
        } catch (notifError) {
            console.error('Failed to send scan notification:', notifError);
            // Don't fail the verification if notification fails
        }

        return res.status(200).json({
            message: 'Ticket successfully checked in',
            ticket: {
                ...ticket,
                status: 'checked_in'
            }
        });

    } catch (error: any) {
        return res.status(500).json({
            message: 'Failed to verify ticket',
            error: error.message
        });
    }
};

export const getMyTickets = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                user_id: user.userId,
                payment_status: 'completed'
            },
            include: {
                museum: {
                    select: {
                        museum_id: true,
                        name: true,
                        description: true,
                        opening_hours: true,
                        gps_coordinates: true,
                    }
                }
            },
            orderBy: {
                purchase_date: 'desc'
            }
        });

        return res.status(200).json({ tickets });
    } catch (error: any) {
        return res.status(500).json({
            message: 'Failed to fetch tickets',
            error: error.message
        });
    }
};
