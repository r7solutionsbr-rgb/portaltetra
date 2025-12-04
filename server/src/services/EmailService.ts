import nodemailer from 'nodemailer';
import { PaymentRequestBody } from '../types';

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Para produção, usar variáveis de ambiente
        if (process.env.NODE_ENV === 'production') {
            this.transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: Number(process.env.MAIL_PORT),
                secure: Number(process.env.MAIL_PORT) === 465, // true for 465, false for other ports
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            });
        } else {
            // Para desenvolvimento, usamos uma conta de teste do Ethereal
            // A cada reinicialização do servidor, uma nova conta é criada.
            nodemailer.createTestAccount((err, account) => {
                if (err) {
                    console.error('Failed to create a testing account. ' + err.message);
                    return;
                }
                console.log('Credentials obtained, sending message...');
                this.transporter = nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass,
                    },
                });
            });
        }
    }

    private async sendMail({ from, to, subject, html }: MailOptions): Promise<void> {
        if (!this.transporter) {
            console.error('Email transporter is not initialized. Retrying in 2s...');
            // Simples retry para dar tempo ao createTestAccount
            await new Promise(resolve => setTimeout(resolve, 2000));
            if (!this.transporter) {
                 throw new Error('Email transporter failed to initialize.');
            }
        }

        const message = { from, to, subject, html };
        
        try {
            const info = await this.transporter.sendMail(message);
            console.log('Message sent: %s', info.messageId);
            // URL de preview do Ethereal
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email.');
        }
    }

    public async sendPaymentRequestEmail(data: PaymentRequestBody): Promise<void> {
        const amountFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.amount);
        const dueDateFormatted = new Date(data.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

        const html = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h1 style="color: #0056b3;">Nova Solicitação de Pagamento</h1>
                <p>Uma nova solicitação de pagamento foi submetida e requer aprovação.</p>
                <hr>
                <h3 style="margin-top: 20px;">Detalhes:</h3>
                <ul>
                    <li><strong>Beneficiário:</strong> ${data.beneficiary}</li>
                    <li><strong>Valor:</strong> ${amountFormatted}</li>
                    <li><strong>Vencimento:</strong> ${dueDateFormatted}</li>
                    <li><strong>Categoria:</strong> ${data.category}</li>
                    <li><strong>Prioridade:</strong> <span style="font-weight: bold; color: ${data.priority === 'Alta' ? '#dc2626' : '#16a34a'};">${data.priority}</span></li>
                    <li><strong>Descrição:</strong> ${data.description || 'N/A'}</li>
                </ul>
                <hr>
                <p style="margin-top: 20px;">
                    Por favor, acesse o <a href="#" style="color: #0056b3; text-decoration: none;">Portal do Cliente</a> para aprovar ou rejeitar esta solicitação.
                </p>
                <p style="font-size: 12px; color: #777;">Este é um e-mail automático. Não responda.</p>
            </div>
        `;

        await this.sendMail({
            from: '"Sistema Tetra OIL" <no-reply@tetraoil.com>',
            to: 'financeiro@tetraoil.com, gestor@transportadoraveloz.com', // Destinatários
            subject: `[URGENTE] Nova Solicitação de Pagamento - ${data.beneficiary} - ${amountFormatted}`,
            html
        });
    }
}

export const emailService = new EmailService();
