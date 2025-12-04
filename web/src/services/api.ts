/**
 * Centralized API Service
 * All API calls should go through this service to ensure consistent configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const api = {
  /**
   * Payment Requests API
   */
  paymentRequests: {
    create: async (data: {
      beneficiary: string;
      amount: number;
      dueDate: string;
      category: string;
      priority: string;
      description: string;
      attachmentUrl?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/api/payment-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to create payment request: ${response.statusText}`);
      }

      return response.json();
    },

    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/api/payment-requests`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch payment requests: ${response.statusText}`);
      }

      return response.json();
    },
  },

  /**
   * Add more API endpoints here as needed
   * Example:
   * 
   * customers: {
   *   getAll: async () => { ... },
   *   getById: async (id: string) => { ... },
   *   create: async (data) => { ... },
   * }
   */
};

export default api;
