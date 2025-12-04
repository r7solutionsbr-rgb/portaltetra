import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

export class UserController {
    async list(req: Request, res: Response) {
        try {
            const companyId = req.user?.companyId;

            const users = await prisma.user.findMany({
                where: { companyId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                    avatarUrl: true,
                    createdAt: true,
                },
                orderBy: { name: 'asc' }
            });

            return res.json(users);
        } catch (error) {
            console.error('List users error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const companyId = req.user?.companyId;
            const { name, email, password, role } = req.body;

            if (!name || !email || !password || !role) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    companyId,
                }
            });

            const { password: _, ...userWithoutPassword } = user;

            return res.status(201).json(userWithoutPassword);
        } catch (error) {
            console.error('Create user error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, role, isActive } = req.body;

            const user = await prisma.user.update({
                where: { id },
                data: {
                    name,
                    role,
                    isActive
                }
            });

            const { password: _, ...userWithoutPassword } = user;
            return res.json(userWithoutPassword);
        } catch (error) {
            console.error('Update user error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
