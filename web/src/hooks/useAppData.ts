import { useState, useEffect } from 'react';
import {
    Invoice,
    Delivery,
    ConsumptionData,
    PaymentRequest,
    Vehicle,
    Person,
    BotMessage,
    Customer,
    Contract
} from '../types';
import { api } from '../services/api';

/**
 * Custom hook to fetch all application data from the API
 * Replaces the old useMockData with real API calls
 */
export const useAppData = () => {
    // Entity states
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [consumptionData, setConsumptionData] = useState<ConsumptionData[]>([]);
    const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [botMessages, setBotMessages] = useState<BotMessage[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);

    // Credit data (calculated from dashboard stats)
    const [creditData, setCreditData] = useState({
        used: 0,
        total: 0,
    });

    // Price variation (mock for now - could come from dashboard stats)
    const [priceVariation] = useState(-2.5);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Generate consumption data from contracts
     * This is a temporary solution until we have real consumption tracking
     */
    const generateConsumptionData = (contracts: Contract[]): ConsumptionData[] => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const currentMonth = new Date().getMonth();
        const data: ConsumptionData[] = [];

        // Calculate total consumed volume
        const totalConsumed = contracts.reduce((sum, c) => sum + c.consumedVolume, 0);
        const avgPerMonth = totalConsumed / 6;

        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            data.push({
                month: months[monthIndex],
                liters: Math.floor(avgPerMonth * (0.8 + Math.random() * 0.4)), // Add some variation
            });
        }

        return data;
    };

    /**
     * Fetch all data from API
     */
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all data in parallel
            const [
                invoicesData,
                deliveriesData,
                paymentRequestsData,
                vehiclesData,
                peopleData,
                botMessagesData,
                customersData,
                contractsData,
                dashboardStats,
            ] = await Promise.all([
                api.invoices.getAll(),
                api.deliveries.getAll(),
                api.paymentRequests.getAll(),
                api.vehicles.getAll(),
                api.people.getAll(),
                api.botMessages.getAll(),
                api.customers.getAll(),
                api.contracts.getAll(),
                api.dashboard.getStats(),
            ]);

            // Update all states
            setInvoices(invoicesData);
            setDeliveries(deliveriesData);
            setPaymentRequests(paymentRequestsData);
            setVehicles(vehiclesData);
            setPeople(peopleData);
            setBotMessages(botMessagesData);
            setCustomers(customersData);
            setContracts(contractsData);

            // Generate consumption data from contracts
            setConsumptionData(generateConsumptionData(contractsData));

            // Calculate credit data from customers
            const totalCreditLimit = customersData
                .filter(c => c.status === 'Ativo')
                .reduce((sum, c) => sum + c.creditLimit, 0);

            const usedCredit = dashboardStats.totalOpenAmount || 0;

            setCreditData({
                used: usedCredit,
                total: totalCreditLimit,
            });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
            setError(errorMessage);
            console.error('Error fetching app data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    return {
        // Entity data
        invoices,
        deliveries,
        consumptionData,
        paymentRequests,
        vehicles,
        people,
        botMessages,
        customers,
        contracts,

        // Calculated data
        creditData,
        priceVariation,

        // State management
        loading,
        error,
        refetch: fetchData,
    };
};

// Export as default for backward compatibility
export default useAppData;

// Also export the old name for gradual migration
export { useAppData as useMockData };
