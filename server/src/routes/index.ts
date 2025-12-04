import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { CompanyController } from '../controllers/CompanyController';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/auth';
import { prisma } from '../lib/prisma';
import { emailService } from '../services/EmailService';
import { PaymentRequestBody } from '../types';
import { storageService } from '../services/StorageService';

const router = Router();

const authController = new AuthController();
const companyController = new CompanyController();
const userController = new UserController();

// ============================================
// PUBLIC ROUTES
// ============================================
router.post('/api/login', authController.login);

// ============================================
// PROTECTED ROUTES
// ============================================

// Auth & User
router.get('/api/me', authenticate, authController.me);

// Company Settings
router.get('/api/company/settings', authenticate, companyController.getProfile);
router.put('/api/company/settings', authenticate, companyController.updateProfile);

// User Management
router.get('/api/users', authenticate, userController.list);
router.post('/api/users', authenticate, userController.create);
router.put('/api/users/:id', authenticate, userController.update);

// ============================================
// DATA ROUTES (Protected)
// ============================================

// Uploads
router.post('/api/uploads/signed-url', authenticate, async (req, res) => {
    try {
        const { fileName, fileType } = req.body;
        if (!fileName || !fileType) {
            return res.status(400).json({ error: 'fileName and fileType are required' });
        }

        const { uploadUrl, publicUrl } = await storageService.generateUploadUrl(fileName, fileType);
        return res.json({ uploadUrl, publicUrl });
    } catch (error) {
        console.error('Upload URL generation error:', error);
        return res.status(500).json({ error: 'Failed to generate upload URL' });
    }
});

router.get('/api/customers', authenticate, async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            include: { contracts: true },
            orderBy: { createdAt: 'desc' },
        });
        return res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

router.get('/api/contracts', authenticate, async (req, res) => {
    try {
        const contracts = await prisma.contract.findMany({
            include: { customer: true },
            orderBy: { createdAt: 'desc' },
        });
        return res.json(contracts);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch contracts' });
    }
});

router.get('/api/vehicles', authenticate, async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            orderBy: { plate: 'asc' },
        });
        return res.json(vehicles);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
});

router.get('/api/invoices', authenticate, async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return res.json(invoices);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

router.get('/api/deliveries', authenticate, async (req, res) => {
    try {
        const deliveries = await prisma.delivery.findMany({
            orderBy: { createdAt: 'desc' },
        });

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
        return res.status(500).json({ error: 'Failed to fetch deliveries' });
    }
});

router.get('/api/payment-requests', authenticate, async (req, res) => {
    try {
        const paymentRequests = await prisma.paymentRequest.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return res.json(paymentRequests);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch payment requests' });
    }
});

router.post('/api/payment-requests', authenticate, async (req, res) => {
    const { beneficiary, amount, dueDate, category, priority, description, attachmentUrl } = req.body as PaymentRequestBody;

    if (!beneficiary || !amount || !dueDate) {
        return res.status(400).json({ error: 'Beneficiary, amount, and due date are required.' });
    }

    try {
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
                requester: req.user?.email || 'Gestor',
                requestDate: new Date().toLocaleDateString('pt-BR'),
                status: 'Pendente',
            }
        });

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
            message: 'Payment request created successfully',
            id: newPaymentRequest.id
        });

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/api/people', authenticate, async (req, res) => {
    try {
        const people = await prisma.person.findMany({
            orderBy: { name: 'asc' },
        });
        return res.json(people);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch people' });
    }
});

router.get('/api/bot-messages', authenticate, async (req, res) => {
    try {
        const messages = await prisma.botMessage.findMany({
            orderBy: { id: 'asc' },
        });
        return res.json(messages);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch bot messages' });
    }
});

router.get('/api/dashboard-stats', authenticate, async (req, res) => {
    try {
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

        const contracts = await prisma.contract.findMany({
            where: { status: 'Ativo' },
            select: { consumedVolume: true, totalVolume: true },
        });

        const totalConsumedVolume = contracts.reduce((sum, c) => sum + c.consumedVolume, 0);
        const totalContractVolume = contracts.reduce((sum, c) => sum + c.totalVolume, 0);

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
        return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

export { router };
