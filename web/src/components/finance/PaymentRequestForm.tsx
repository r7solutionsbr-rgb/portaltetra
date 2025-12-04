import React, { useState, useRef } from 'react';
import { PaymentCategory, PaymentPriority, PaymentRequest } from '../../types';
import api from '../../services/api';

interface PaymentRequestFormProps {
    onSuccess: (newRequest: PaymentRequest) => void;
}

const ClipIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
    </svg>
);

export const PaymentRequestForm: React.FC<PaymentRequestFormProps> = ({ onSuccess }) => {
    const [beneficiary, setBeneficiary] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState<PaymentCategory>('Fornecedor');
    const [priority, setPriority] = useState<PaymentPriority>('Normal');
    const [description, setDescription] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [attachmentName, setAttachmentName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setAttachmentName('Iniciando upload...');
        setError('');

        try {
            // 1. Get Signed URL
            const { uploadUrl, publicUrl } = await api.uploads.getSignedUrl(file.name, file.type);

            // 2. Upload to R2
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type
                }
            });

            if (!uploadResponse.ok) {
                throw new Error('Falha no upload do arquivo.');
            }

            // 3. Save public URL
            setAttachmentUrl(publicUrl);
            setAttachmentName(file.name);
        } catch (err: any) {
            console.error(err);
            setError('Erro ao fazer upload do arquivo. Tente novamente.');
            setAttachmentName('');
            setAttachmentUrl('');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!beneficiary || !amount || !dueDate) {
            setError('Por favor, preencha os campos obrigatórios.');
            return;
        }
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);

        const requestBody = {
            beneficiary,
            amount: Number(amount),
            dueDate,
            category,
            priority,
            description,
            attachmentUrl: attachmentUrl || undefined,
        };

        try {
            const responseData = await api.paymentRequests.create(requestBody) as any;

            // Criar o objeto completo para atualizar a UI localmente
            const newRequest: PaymentRequest = {
                ...requestBody,
                id: responseData.id,
                status: 'Pendente',
                requester: 'Gestor', // Assumindo que o usuário logado é o gestor
                requestDate: new Date().toLocaleDateString('pt-BR'),
                invoiceId: `N/A-${responseData.id.slice(-4)}`,
                attachmentUrl: attachmentUrl || undefined,
            };

            setSuccessMessage('Solicitação enviada e notificação disparada com sucesso!');

            setTimeout(() => {
                onSuccess(newRequest);
            }, 1500); // Dá tempo para o usuário ler a mensagem de sucesso

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
            {successMessage && <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">{successMessage}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700">Beneficiário*</label>
                    <input type="text" id="beneficiary" value={beneficiary} onChange={e => setBeneficiary(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor (R$)*</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Vencimento*</label>
                    <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value as PaymentCategory)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                        <option>Fornecedor</option>
                        <option>Imposto</option>
                        <option>Serviço</option>
                        <option>Reembolso</option>
                    </select>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                    <div className="mt-2 flex space-x-4">
                        <label className="inline-flex items-center">
                            <input type="radio" className="form-radio text-blue-600" name="priority" value="Normal" checked={priority === 'Normal'} onChange={() => setPriority('Normal')} />
                            <span className="ml-2">Normal</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="radio" className="form-radio text-red-600" name="priority" value="Alta" checked={priority === 'Alta'} onChange={() => setPriority('Alta')} />
                            <span className="ml-2">Alta</span>
                        </label>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Anexo</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <div
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${isUploading ? 'bg-gray-50 border-gray-300 cursor-wait' : 'border-gray-300 hover:border-blue-500'
                            }`}
                    >
                        <div className="space-y-1 text-center">
                            {isUploading ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                                    <p className="text-sm text-gray-500">Enviando arquivo...</p>
                                </div>
                            ) : (
                                <>
                                    <ClipIcon className={`mx-auto h-10 w-10 ${attachmentUrl ? 'text-green-500' : 'text-gray-400'}`} />
                                    {attachmentName ? (
                                        <p className="text-sm text-green-600 font-semibold">{attachmentName}</p>
                                    ) : (
                                        <div className="flex text-sm text-gray-600">
                                            <p className="pl-1">Clique para anexar o boleto ou comprovante</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSubmitting || isUploading || !!successMessage} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
                    {isSubmitting ? 'Enviando...' : 'Enviar para Aprovação'}
                </button>
            </div>
        </form>
    );
};
