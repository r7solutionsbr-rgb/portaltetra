import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        try {
            // 1. Find user
            const user = await prisma.user.findUnique({
                where: { email },
                include: { company: true }
            });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // 2. Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            if (!user.isActive) {
                return res.status(403).json({ error: 'User is inactive' });
            }

            // 3. Generate Token
            const secret = process.env.JWT_SECRET || 'default_secret_change_me';
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    companyId: user.companyId
                },
                secret,
                { expiresIn: '1d' }
            );

            // 4. Return response (excluding password)
            const { password: _, ...userWithoutPassword } = user;

            return res.json({
                user: userWithoutPassword,
                token,
            });

        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async me(req: Request, res: Response) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { company: true }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const { password: _, ...userWithoutPassword } = user;

            return res.json(userWithoutPassword);
        } catch (error) {
            console.error('Me error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
