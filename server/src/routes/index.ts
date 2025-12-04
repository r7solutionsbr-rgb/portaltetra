import { Router, Request, Response } from 'express';
import { emailService } from '../services/EmailService';
import { PaymentRequestBody } from '../types';
import { prisma } from '../lib/prisma';

const router = Router();

// ============================================
// CUSTOMERS ENDPOINTS
// ============================================
router.get('/api/customers', async (req: Request, res: Response) => {
    try {
        const customers = await prisma.customer.findMany({
            include: {
                contracts: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.json(customers);
    } catch (error) {
        console.error('Failed to fetch customers:', error);
        return res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// ============================================
// CONTRACTS ENDPOINTS
// ============================================
router.get('/api/contracts', async (req: Request, res: Response) => {
    try {
        const contracts = await prisma.contract.findMany({
            include: {
                customer: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.json(contracts);
    } catch (error) {
        console.error('Failed to fetch contracts:', error);
        return res.status(500).json({ error: 'Failed to fetch contracts' });
    }
});

// ============================================
// VEHICLES ENDPOINTS
// ============================================
router.get('/api/vehicles', async (req: Request, res: Response) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            orderBy: {
                plate: 'asc',
            },
        });

        return res.json(vehicles);
    } catch (error) {
        console.error('Failed to fetch vehicles:', error);
        return res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
});

// ============================================
// INVOICES ENDPOINTS
// ============================================
router.get('/api/invoices', async (req: Request, res: Response) => {
    try {
        const invoices = await prisma.invoice.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.json(invoices);
    } catch (error) {
        console.error('Failed to fetch invoices:', error);
        return res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

// ============================================
// DELIVERIES ENDPOINTS
// ============================================
router.get('/api/deliveries', async (req: Request, res: Response) => {
    try {
        const deliveries = await prisma.delivery.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Transform flat structure to nested deliveryLocation object for frontend compatibility
        const transformedDeliveries = deliveries.map(delivery => ({
            id: delivery.id,
            orderId: delivery.orderId,
            date: delivery.date,
            product: delivery.product,
            volume: delivery.volume,
            status: delivery.status,
            deliveryLocation: {
                lat: delivery.deliveryLat,
                lng: delivery.deliveryLng,
                address: delivery.deliveryAddress,
            },
            proofOfDeliveryUrl: delivery.proofOfDeliveryUrl,
        }));

        return res.json(transformedDeliveries);
    } catch (error) {
        console.error('Failed to fetch deliveries:', error);
        return res.status(500).json({ error: 'Failed to fetch deliveries' });
    }
});

// ============================================
// PAYMENT REQUESTS ENDPOINTS
// ============================================
router.get('/api/payment-requests', async (req: Request, res: Response) => {
    try {
        const paymentRequests = await prisma.paymentRequest.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.json(paymentRequests);
    } catch (error) {
        console.error('Failed to fetch payment requests:', error);
        return res.status(500).json({ error: 'Failed to fetch payment requests' });
    }
});

router.post('/api/payment-requests', async (req: Request, res: Response) => {
    const { beneficiary, amount, dueDate, category, priority, description, attachmentUrl } = req.body as PaymentRequestBody;

    // Validação simples no servidor
    if (!beneficiary || !amount || !dueDate) {
        return res.status(400).json({ error: 'Beneficiary, amount, and due date are required.' });
    }

    try {
        // 1. Salvar a solicitação no banco de dados
        console.log('Saving payment request to database...');
        const newPaymentRequest = await prisma.paymentRequest.create({
            data: {
                beneficiary,
                amount: Number(amount),
                dueDate: dueDate,
                category: category,
                priority: priority,
                description: description || '',
                attachmentUrl: attachmentUrl || null,
                invoiceId: `N/A-${Date.now()}`,
                requester: 'Gestor Logado',
                requestDate: new Date().toLocaleDateString('pt-BR'),
                status: 'Pendente',
            }
        });
        console.log(`Payment request saved with ID: ${newPaymentRequest.id}`);

        // 2. Enviar a notificação por e-mail
        console.log('Sending email notification...');
        await emailService.sendPaymentRequestEmail({
            beneficiary,
            amount,
            dueDate,
            category,
            priority,
            description,
            attachmentUrl
        });

        return res.status(201).json({
            message: 'Payment request created successfully and notification sent.',
            id: newPaymentRequest.id
        });

    } catch (error) {
        console.error('Failed to process payment request:', error);
        return res.status(500).json({ error: 'Internal server error while processing the request.' });
    }
});

// ============================================
// PEOPLE ENDPOINTS
// ============================================
router.get('/api/people', async (req: Request, res: Response) => {
    try {
        const people = await prisma.person.findMany({
            orderBy: {
                name: 'asc',
            },
        });

        return res.json(people);
    } catch (error) {
        console.error('Failed to fetch people:', error);
        return res.status(500).json({ error: 'Failed to fetch people' });
    }
});

// ============================================
// BOT MESSAGES ENDPOINTS
// ============================================
router.get('/api/bot-messages', async (req: Request, res: Response) => {
    try {
        const messages = await prisma.botMessage.findMany({
            orderBy: {
                id: 'asc',
            },
        });

        return res.json(messages);
    } catch (error) {
        console.error('Failed to fetch bot messages:', error);
        return res.status(500).json({ error: 'Failed to fetch bot messages' });
    }
});

// ============================================
// DASHBOARD STATS ENDPOINT
// ============================================
router.get('/api/dashboard-stats', async (req: Request, res: Response) => {
    try {
        // Calcular estatísticas do dashboard
        const [
            totalInvoices,
            openInvoices,
            overdueInvoices,
            activeContracts,
            pendingPayments,
            totalCustomers,
            activeVehicles,
        ] = await Promise.all([
            prisma.invoice.count(),
            prisma.invoice.count({ where: { status: 'Em Aberto' } }),
            prisma.invoice.count({ where: { status: 'Vencida' } }),
            prisma.contract.count({ where: { status: 'Ativo' } }),
            prisma.paymentRequest.count({ where: { status: 'Pendente' } }),
            prisma.customer.count({ where: { status: 'Ativo' } }),
            prisma.vehicle.count({ where: { status: 'Operacional' } }),
        ]);

        // Calcular volume total consumido
        const contracts = await prisma.contract.findMany({
            where: { status: 'Ativo' },
            select: { consumedVolume: true, totalVolume: true },
        });

        const totalConsumedVolume = contracts.reduce((sum, c) => sum + c.consumedVolume, 0);
        const totalContractVolume = contracts.reduce((sum, c) => sum + c.totalVolume, 0);

        // Calcular total de faturas em aberto
        const openInvoicesData = await prisma.invoice.findMany({
            where: { status: 'Em Aberto' },
            select: { amount: true },
        });

        const totalOpenAmount = openInvoicesData.reduce((sum, inv) => sum + inv.amount, 0);

        const stats = {
            totalInvoices,
            openInvoices,
            overdueInvoices,
            activeContracts,
            pendingPayments,
            totalCustomers,
            activeVehicles,
            totalConsumedVolume: Math.round(totalConsumedVolume),
            totalContractVolume: Math.round(totalContractVolume),
            consumptionPercentage: totalContractVolume > 0
                ? Math.round((totalConsumedVolume / totalContractVolume) * 100)
                : 0,
            totalOpenAmount: Math.round(totalOpenAmount * 100) / 100,
        };

        return res.json(stats);
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

export { router };
