import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class CompanyController {
    async getProfile(req: Request, res: Response) {
        try {
            const companyId = req.user?.companyId;

            if (!companyId) {
                return res.status(400).json({ error: 'User does not belong to a company' });
            }

            const company = await prisma.company.findUnique({
                where: { id: companyId },
                include: {
                    _count: {
                        select: { users: true }
                    }
                }
            });

            if (!company) {
                return res.status(404).json({ error: 'Company not found' });
            }

            return res.json(company);
        } catch (error) {
            console.error('Get company profile error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const companyId = req.user?.companyId;
            const { name, primaryColor, logoUrl } = req.body;

            if (!companyId) {
                return res.status(400).json({ error: 'User does not belong to a company' });
            }

            const company = await prisma.company.update({
                where: { id: companyId },
                data: {
                    name,
                    primaryColor,
                    logoUrl,
                }
            });

            return res.json(company);
        } catch (error) {
            console.error('Update company profile error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
