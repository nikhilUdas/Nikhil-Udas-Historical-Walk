import crypto from 'crypto';
import "dotenv/config";
import prisma from '../models/index.js';
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const KHALTI_API_URL = "https://dev.khalti.com/api/v2"; // Sandbox URL
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY;
const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST'; // Default for testing
const ESEWA_API_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"; // For initiating payment
const ESEWA_VERIFY_URL = "https://rc-epay.esewa.com.np/api/epay/transaction/status/"; // For verification
// Helper function to generate eSewa signature
const generateEsewaSignature = (message, secret) => {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(message);
    return hmac.digest('base64');
};
export const initiateKhalti = async (req, res) => {
    const { museum_id, price, quantity, visit_date } = req.body;
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const parsedMuseumId = Number(museum_id);
    if (!museum_id || isNaN(parsedMuseumId)) {
        return res.status(400).json({ message: 'Invalid or missing museum_id' });
    }
    try {
        const museum = await prisma.museum.findUnique({
            where: { museum_id: parsedMuseumId },
        });
        if (!museum) {
            return res.status(404).json({ message: 'Museum not found' });
        }
        const fullUser = await prisma.user.findUnique({
            where: { user_id: user.userId }
        });
        // 1. Create a pending ticket record
        const ticket = await prisma.ticket.create({
            data: {
                user_id: user.userId,
                museum_id: parsedMuseumId,
                purchase_date: new Date(),
                ticket_pdf: "PENDING_PIDX",
                price: Number(price) * Number(quantity),
                payment_status: 'pending',
                qr_code: crypto.randomUUID(),
            },
        });
        // 2. Initiate payment with Khalti
        const payload = {
            return_url: process.env.PAYMENT_RETURN_URL || `https://success.historicalwalk.com/khalti`,
            website_url: process.env.WEBSITE_URL || "http://192.168.100.95:8000",
            amount: Math.round(Number(price) * Number(quantity) * 100),
            purchase_order_id: String(ticket.ticket_id),
            purchase_order_name: `Ticket for ${museum.name}`,
            customer_info: {
                name: fullUser?.name || "Guest",
                email: fullUser?.email || "guest@example.com",
                phone: "9800000000",
            },
        };
        const response = await fetch(`${KHALTI_API_URL}/epayment/initiate/`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({
                message: 'Khalti API Error',
                error: data
            });
        }
        if (data.pidx) {
            await prisma.ticket.update({
                where: { ticket_id: ticket.ticket_id },
                data: { ticket_pdf: data.pidx }
            });
            return res.status(200).json({
                message: 'Khalti payment initiated',
                ...data,
                ticket_id: ticket.ticket_id,
            });
        }
        return res.status(400).json({
            message: 'Failed to get pidx from Khalti',
            error: data
        });
    }
    catch (error) {
        console.error('KHALTI INITIATION ERROR:', error);
        return res.status(500).json({
            message: 'Failed to initiate Khalti payment',
            error: error.message,
        });
    }
};
export const verifyKhalti = async (req, res) => {
    const { pidx } = req.body;
    if (!pidx) {
        return res.status(400).json({ message: 'pidx is required' });
    }
    try {
        const response = await fetch(`${KHALTI_API_URL}/epayment/lookup/`, {
            method: "POST",
            body: JSON.stringify({ pidx }),
            headers: {
                'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const khaltiData = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({
                message: 'Khalti Lookup API Error',
                error: khaltiData
            });
        }
        if (khaltiData.status?.toLowerCase() === 'completed') {
            const ticket = await prisma.ticket.findFirst({
                where: { ticket_pdf: pidx }
            });
            if (!ticket) {
                return res.status(404).json({ message: 'Ticket not found for this pidx' });
            }
            const updatedData = await prisma.$transaction(async (tx) => {
                const updatedTicket = await tx.ticket.update({
                    where: { ticket_id: ticket.ticket_id },
                    data: {
                        payment_status: 'completed',
                        purchase_date: new Date(),
                    },
                });
                const payment = await tx.payment.create({
                    data: {
                        ticket_id: updatedTicket.ticket_id,
                        payment_method: 'khalti',
                        amount: Number(khaltiData.total_amount) / 100,
                        payment_date: new Date(),
                    },
                });
                return { ticket: updatedTicket, payment };
            });
            return res.status(200).json({
                message: 'Payment verified successfully',
                ...updatedData,
            });
        }
        else {
            return res.status(400).json({
                message: 'Payment not completed or failed',
                status: khaltiData.status,
                pidx: pidx
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: 'Failed to verify Khalti payment',
            error: error.message,
        });
    }
};
export const initiateEsewa = async (req, res) => {
    const { museum_id, price, quantity, visit_date } = req.body;
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const museum = await prisma.museum.findUnique({
            where: { museum_id: Number(museum_id) },
        });
        if (!museum) {
            return res.status(404).json({ message: 'Museum not found' });
        }
        const ticket = await prisma.ticket.create({
            data: {
                user_id: user.userId,
                museum_id: Number(museum_id),
                purchase_date: new Date(),
                ticket_pdf: "PENDING_ESEWA",
                price: Number(price) * Number(quantity),
                payment_status: 'pending',
                qr_code: crypto.randomUUID(),
            },
        });
        const total_amount = Number(price) * Number(quantity);
        const transaction_uuid = `${ticket.ticket_id}-${Date.now()}`;
        const product_code = ESEWA_MERCHANT_CODE;
        const secret = ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
        await prisma.ticket.update({
            where: { ticket_id: ticket.ticket_id },
            data: { ticket_pdf: transaction_uuid }
        });
        const signatureString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        const signature = generateEsewaSignature(signatureString, secret);
        return res.status(200).json({
            message: 'eSewa payment initiated',
            amount: total_amount,
            tax_amount: 0,
            total_amount: total_amount,
            transaction_uuid,
            product_code,
            product_service_charge: 0,
            product_delivery_charge: 0,
            success_url: process.env.PAYMENT_SUCCESS_URL || `http://192.168.100.95:8000/api/payment/esewa/success`,
            failure_url: process.env.PAYMENT_FAILURE_URL || `http://192.168.100.95:8000/api/payment/esewa/failure`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature,
            gateway_url: ESEWA_API_URL
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Failed to initiate eSewa payment',
            error: error.message,
        });
    }
};
export const verifyEsewa = async (req, res) => {
    const { encodedData } = req.body;
    if (!encodedData) {
        return res.status(400).json({ message: 'Missing encoded data' });
    }
    try {
        const decodedString = Buffer.from(encodedData, 'base64').toString('utf-8');
        const data = JSON.parse(decodedString);
        const { transaction_uuid, total_amount, status } = data;
        if (status === 'COMPLETE') {
            const ticket = await prisma.ticket.findFirst({
                where: { ticket_pdf: transaction_uuid }
            });
            if (!ticket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }
            const updatedData = await prisma.$transaction(async (tx) => {
                const updatedTicket = await tx.ticket.update({
                    where: { ticket_id: ticket.ticket_id },
                    data: {
                        payment_status: 'completed',
                        purchase_date: new Date(),
                    },
                });
                const payment = await tx.payment.create({
                    data: {
                        ticket_id: updatedTicket.ticket_id,
                        payment_method: 'esewa',
                        amount: Number(total_amount.replace(/,/g, '')),
                        payment_date: new Date(),
                    },
                });
                return { ticket: updatedTicket, payment };
            });
            return res.status(200).json({
                message: 'eSewa payment verified successfully',
                ...updatedData
            });
        }
        return res.status(400).json({
            message: 'eSewa payment not completed',
            status
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Failed to verify eSewa payment',
            error: error.message,
        });
    }
};
export const initiateStoryKhalti = async (req, res) => {
    const { story_id, price } = req.body;
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const parsedStoryId = Number(story_id);
    if (!story_id || isNaN(parsedStoryId)) {
        return res.status(400).json({ message: 'Invalid or missing story_id' });
    }
    try {
        const story = await prisma.story.findUnique({
            where: { story_id: parsedStoryId },
        });
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        const fullUser = await prisma.user.findUnique({
            where: { user_id: user.userId }
        });
        // 1. Create a pending story payment record
        const payment = await prisma.storyPayment.create({
            data: {
                user_id: user.userId,
                story_id: parsedStoryId,
                amount: Number(price),
                payment_method: 'khalti',
                status: 'pending',
            },
        });
        // 2. Initiate payment with Khalti
        const payload = {
            return_url: process.env.PAYMENT_RETURN_URL || `https://success.historicalwalk.com/khalti`,
            website_url: process.env.WEBSITE_URL || "http://192.168.100.95:8000",
            amount: Math.round(Number(price) * 100), // Rs in paisa
            purchase_order_id: `STORY-${payment.payment_id}`,
            purchase_order_name: `Unlock Story: ${story.title}`,
            customer_info: {
                name: fullUser?.name || "Guest",
                email: fullUser?.email || "guest@example.com",
                phone: "9800000000",
            },
        };
        const response = await fetch(`${KHALTI_API_URL}/epayment/initiate/`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({
                message: 'Khalti API Error',
                error: data
            });
        }
        if (data.pidx) {
            await prisma.storyPayment.update({
                where: { payment_id: payment.payment_id },
                data: { pidx: data.pidx }
            });
            return res.status(200).json({
                message: 'Khalti payment initiated',
                ...data,
                payment_id: payment.payment_id,
            });
        }
        return res.status(400).json({
            message: 'Failed to get pidx from Khalti',
            error: data
        });
    }
    catch (error) {
        console.error('KHALTI INITIATION ERROR:', error);
        return res.status(500).json({
            message: 'Failed to initiate Khalti payment',
            error: error.message,
        });
    }
};
export const verifyStoryKhalti = async (req, res) => {
    const { pidx } = req.body;
    if (!pidx) {
        return res.status(400).json({ message: 'pidx is required' });
    }
    try {
        const response = await fetch(`${KHALTI_API_URL}/epayment/lookup/`, {
            method: "POST",
            body: JSON.stringify({ pidx }),
            headers: {
                'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const khaltiData = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({
                message: 'Khalti Lookup API Error',
                error: khaltiData
            });
        }
        if (khaltiData.status?.toLowerCase() === 'completed') {
            const payment = await prisma.storyPayment.findFirst({
                where: { pidx: pidx }
            });
            if (!payment) {
                return res.status(404).json({ message: 'Payment record not found for this pidx' });
            }
            const updatedPayment = await prisma.storyPayment.update({
                where: { payment_id: payment.payment_id },
                data: {
                    status: 'completed',
                },
            });
            return res.status(200).json({
                message: 'Payment verified successfully',
                payment: updatedPayment,
            });
        }
        else {
            return res.status(400).json({
                message: 'Payment not completed or failed',
                status: khaltiData.status,
                pidx: pidx
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: 'Failed to verify Khalti payment',
            error: error.message,
        });
    }
};
export const initiateStoryEsewa = async (req, res) => {
    const { story_id, price } = req.body;
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const story = await prisma.story.findUnique({
            where: { story_id: Number(story_id) },
        });
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        const payment = await prisma.storyPayment.create({
            data: {
                user_id: user.userId,
                story_id: Number(story_id),
                amount: Number(price),
                payment_method: 'esewa',
                status: 'pending',
            },
        });
        const total_amount = Number(price);
        const transaction_uuid = `STORY-${payment.payment_id}-${Date.now()}`;
        const product_code = ESEWA_MERCHANT_CODE;
        const secret = ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
        await prisma.storyPayment.update({
            where: { payment_id: payment.payment_id },
            data: { transaction_uuid: transaction_uuid }
        });
        const signatureString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        const signature = generateEsewaSignature(signatureString, secret);
        return res.status(200).json({
            message: 'eSewa payment initiated',
            amount: total_amount,
            tax_amount: 0,
            total_amount: total_amount,
            transaction_uuid,
            product_code,
            product_service_charge: 0,
            product_delivery_charge: 0,
            success_url: process.env.PAYMENT_SUCCESS_URL || `http://192.168.100.95:8000/api/payment/esewa/success`,
            failure_url: process.env.PAYMENT_FAILURE_URL || `http://192.168.100.95:8000/api/payment/esewa/failure`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature,
            gateway_url: ESEWA_API_URL
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Failed to initiate eSewa payment',
            error: error.message,
        });
    }
};
export const verifyStoryEsewa = async (req, res) => {
    const { encodedData } = req.body;
    if (!encodedData) {
        return res.status(400).json({ message: 'Missing encoded data' });
    }
    try {
        const decodedString = Buffer.from(encodedData, 'base64').toString('utf-8');
        const data = JSON.parse(decodedString);
        const { transaction_uuid, total_amount, status } = data;
        if (status === 'COMPLETE') {
            const payment = await prisma.storyPayment.findFirst({
                where: { transaction_uuid: transaction_uuid }
            });
            if (!payment) {
                return res.status(404).json({ message: 'Payment record not found' });
            }
            const updatedPayment = await prisma.storyPayment.update({
                where: { payment_id: payment.payment_id },
                data: {
                    status: 'completed',
                },
            });
            return res.status(200).json({
                message: 'eSewa payment verified successfully',
                payment: updatedPayment
            });
        }
        return res.status(400).json({
            message: 'eSewa payment not completed',
            status
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Failed to verify eSewa payment',
            error: error.message,
        });
    }
};
export const initiateSiteKhalti = async (req, res) => {
    const { site_id, price } = req.body;
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const parsedSiteId = Number(site_id);
    if (!site_id || isNaN(parsedSiteId)) {
        return res.status(400).json({ message: 'Invalid or missing site_id' });
    }
    try {
        const site = await prisma.heritageSite.findUnique({
            where: { site_id: parsedSiteId },
        });
        if (!site) {
            return res.status(404).json({ message: 'Site not found' });
        }
        const fullUser = await prisma.user.findUnique({
            where: { user_id: user.userId }
        });
        // 1. Create a pending site payment record
        const payment = await prisma.sitePayment.create({
            data: {
                user_id: user.userId,
                site_id: parsedSiteId,
                amount: Number(price),
                payment_method: 'khalti',
                status: 'pending',
            },
        });
        // 2. Initiate payment with Khalti
        const payload = {
            return_url: process.env.PAYMENT_RETURN_URL || `https://success.historicalwalk.com/khalti`,
            website_url: process.env.WEBSITE_URL || "http://192.168.100.95:8000",
            amount: Math.round(Number(price) * 100), // Rs in paisa
            purchase_order_id: `SITE-${payment.payment_id}`,
            purchase_order_name: `Unlock Site: ${site.name}`,
            customer_info: {
                name: fullUser?.name || "Guest",
                email: fullUser?.email || "guest@example.com",
                phone: "9800000000",
            },
        };
        const response = await fetch(`${KHALTI_API_URL}/epayment/initiate/`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({
                message: 'Khalti API Error',
                error: data
            });
        }
        if (data.pidx) {
            await prisma.sitePayment.update({
                where: { payment_id: payment.payment_id },
                data: { pidx: data.pidx }
            });
            return res.status(200).json({
                message: 'Khalti payment initiated',
                ...data,
                payment_id: payment.payment_id,
            });
        }
        return res.status(400).json({
            message: 'Failed to get pidx from Khalti',
            error: data
        });
    }
    catch (error) {
        console.error('SITE KHALTI INITIATION ERROR:', error);
        console.error('KHALTI_SECRET_KEY set:', !!KHALTI_SECRET_KEY, '| value prefix:', KHALTI_SECRET_KEY ? KHALTI_SECRET_KEY.substring(0, 8) + '...' : 'UNDEFINED');
        return res.status(500).json({
            message: 'Failed to initiate Khalti payment',
            error: error.message || String(error),
        });
    }
};
export const verifySiteKhalti = async (req, res) => {
    const { pidx } = req.body;
    if (!pidx) {
        return res.status(400).json({ message: 'pidx is required' });
    }
    try {
        const response = await fetch(`${KHALTI_API_URL}/epayment/lookup/`, {
            method: "POST",
            body: JSON.stringify({ pidx }),
            headers: {
                'Authorization': `Key ${KHALTI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const khaltiData = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({
                message: 'Khalti Lookup API Error',
                error: khaltiData
            });
        }
        if (khaltiData.status?.toLowerCase() === 'completed') {
            const payment = await prisma.sitePayment.findFirst({
                where: { pidx: pidx }
            });
            if (!payment) {
                return res.status(404).json({ message: 'Payment record not found for this pidx' });
            }
            const updatedPayment = await prisma.sitePayment.update({
                where: { payment_id: payment.payment_id },
                data: {
                    status: 'completed',
                },
            });
            return res.status(200).json({
                message: 'Payment verified successfully',
                payment: updatedPayment,
            });
        }
        else {
            return res.status(400).json({
                message: 'Payment not completed or failed',
                status: khaltiData.status,
                pidx: pidx
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: 'Failed to verify Khalti payment',
            error: error.message,
        });
    }
};
export const initiateSiteEsewa = async (req, res) => {
    const { site_id, price } = req.body;
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const site = await prisma.heritageSite.findUnique({
            where: { site_id: Number(site_id) },
        });
        if (!site) {
            return res.status(404).json({ message: 'Site not found' });
        }
        const payment = await prisma.sitePayment.create({
            data: {
                user_id: user.userId,
                site_id: Number(site_id),
                amount: Number(price),
                payment_method: 'esewa',
                status: 'pending',
            },
        });
        const total_amount = Number(price);
        const transaction_uuid = `SITE-${payment.payment_id}-${Date.now()}`;
        const product_code = ESEWA_MERCHANT_CODE;
        const secret = ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
        await prisma.sitePayment.update({
            where: { payment_id: payment.payment_id },
            data: { transaction_uuid: transaction_uuid }
        });
        const signatureString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        const signature = generateEsewaSignature(signatureString, secret);
        return res.status(200).json({
            message: 'eSewa payment initiated',
            amount: total_amount,
            tax_amount: 0,
            total_amount: total_amount,
            transaction_uuid,
            product_code,
            product_service_charge: 0,
            product_delivery_charge: 0,
            success_url: process.env.PAYMENT_SUCCESS_URL || `http://192.168.100.95:8000/api/payment/esewa/success`,
            failure_url: process.env.PAYMENT_FAILURE_URL || `http://192.168.100.95:8000/api/payment/esewa/failure`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature,
            gateway_url: ESEWA_API_URL
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Failed to initiate eSewa payment',
            error: error.message,
        });
    }
};
export const verifySiteEsewa = async (req, res) => {
    const { encodedData } = req.body;
    if (!encodedData) {
        return res.status(400).json({ message: 'Missing encoded data' });
    }
    try {
        const decodedString = Buffer.from(encodedData, 'base64').toString('utf-8');
        const data = JSON.parse(decodedString);
        const { transaction_uuid, total_amount, status } = data;
        if (status === 'COMPLETE') {
            const payment = await prisma.sitePayment.findFirst({
                where: { transaction_uuid: transaction_uuid }
            });
            if (!payment) {
                return res.status(404).json({ message: 'Payment record not found' });
            }
            const updatedPayment = await prisma.sitePayment.update({
                where: { payment_id: payment.payment_id },
                data: {
                    status: 'completed',
                },
            });
            return res.status(200).json({
                message: 'eSewa payment verified successfully',
                payment: updatedPayment
            });
        }
        return res.status(400).json({
            message: 'eSewa payment not completed',
            status
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Failed to verify eSewa payment',
            error: error.message,
        });
    }
};
export const getPaymentHistory = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const [ticketPayments, storyPayments, sitePayments] = await Promise.all([
            prisma.payment.findMany({
                where: { ticket: { user_id: userId } },
                include: {
                    ticket: {
                        include: {
                            museum: {
                                select: { name: true }
                            }
                        }
                    }
                },
                orderBy: { payment_date: 'desc' }
            }),
            prisma.storyPayment.findMany({
                where: { user_id: userId, status: 'completed' },
                include: {
                    story: {
                        select: { title: true }
                    }
                },
                orderBy: { created_at: 'desc' }
            }),
            prisma.sitePayment.findMany({
                where: { user_id: userId, status: 'completed' },
                include: {
                    site: {
                        select: { name: true }
                    }
                },
                orderBy: { created_at: 'desc' }
            })
        ]);
        const history = [
            ...ticketPayments.map(p => ({
                id: p.payment_id,
                type: 'ticket',
                item_name: p.ticket.museum.name,
                amount: p.amount,
                method: p.payment_method,
                date: p.payment_date,
                status: 'completed'
            })),
            ...storyPayments.map(p => ({
                id: p.payment_id,
                type: 'story',
                item_name: p.story.title,
                amount: p.amount,
                method: p.payment_method,
                date: p.created_at,
                status: p.status
            })),
            ...sitePayments.map(p => ({
                id: p.payment_id,
                type: 'site',
                item_name: p.site.name,
                amount: p.amount,
                method: p.payment_method,
                date: p.created_at,
                status: p.status
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return res.status(200).json({ history });
    }
    catch (error) {
        console.error('ERROR FETCHING PAYMENT HISTORY:', error);
        return res.status(500).json({ message: 'Failed to fetch payment history', error: error.message });
    }
};
export const getAllPaymentHistory = async (req, res) => {
    if (req.user?.type !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin only' });
    }
    try {
        const [ticketPayments, storyPayments, sitePayments] = await Promise.all([
            prisma.payment.findMany({
                include: {
                    ticket: {
                        include: {
                            museum: { select: { name: true } },
                            user: { select: { name: true, email: true } }
                        }
                    }
                },
                orderBy: { payment_date: 'desc' }
            }),
            prisma.storyPayment.findMany({
                include: {
                    story: { select: { title: true } },
                    user: { select: { name: true, email: true } }
                },
                orderBy: { created_at: 'desc' }
            }),
            prisma.sitePayment.findMany({
                include: {
                    site: { select: { name: true } },
                    user: { select: { name: true, email: true } }
                },
                orderBy: { created_at: 'desc' }
            })
        ]);
        const history = [
            ...ticketPayments.map(p => ({
                id: p.payment_id,
                type: 'ticket',
                item_name: p.ticket.museum.name,
                user: p.ticket.user,
                amount: p.amount,
                method: p.payment_method,
                date: p.payment_date,
                status: 'completed'
            })),
            ...storyPayments.map(p => ({
                id: p.payment_id,
                type: 'story',
                item_name: p.story.title,
                user: p.user,
                amount: p.amount,
                method: p.payment_method,
                date: p.created_at,
                status: p.status
            })),
            ...sitePayments.map(p => ({
                id: p.payment_id,
                type: 'site',
                item_name: p.site.name,
                user: p.user,
                amount: p.amount,
                method: p.payment_method,
                date: p.created_at,
                status: p.status
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return res.status(200).json({ history });
    }
    catch (error) {
        console.error('ERROR FETCHING ALL PAYMENT HISTORY:', error);
        return res.status(500).json({ message: 'Failed to fetch all payment history', error: error.message });
    }
};
//# sourceMappingURL=paymentController.js.map