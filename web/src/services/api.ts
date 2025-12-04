/**
 * Centralized API Service
 * All API calls should go through this service to ensure consistent configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

/**
 * Generic fetch helper with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('@PortalTRR:token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText} (${response.status})`);
  }

  return response.json();
}

export const api = {
  /**
   * Uploads API
   */
  uploads: {
    getSignedUrl: async (fileName: string, fileType: string) => {
      return fetchAPI<{ uploadUrl: string; publicUrl: string }>('/api/uploads/signed-url', {
        method: 'POST',
        body: JSON.stringify({ fileName, fileType }),
      });
    },
  },

  /**
   * Customers API
   */
  customers: {
    getAll: async () => {
      return fetchAPI('/api/customers');
    },
  },

  /**
   * Contracts API
   */
  contracts: {
    getAll: async () => {
      return fetchAPI('/api/contracts');
    },
  },

  /**
   * Vehicles API
   */
  vehicles: {
    getAll: async () => {
      return fetchAPI('/api/vehicles');
    },
  },

  /**
   * Invoices API
   */
  invoices: {
    getAll: async () => {
      return fetchAPI('/api/invoices');
    },
  },

  /**
   * Deliveries API
   */
  deliveries: {
    getAll: async () => {
      return fetchAPI('/api/deliveries');
    },
  },

  /**
   * People API
   */
  people: {
    getAll: async () => {
      return fetchAPI('/api/people');
    },
  },

  /**
   * Bot Messages API
   */
  botMessages: {
    getAll: async () => {
      return fetchAPI('/api/bot-messages');
    },
  },

  /**
   * Dashboard Stats API
   */
  dashboard: {
    getStats: async () => {
      return fetchAPI('/api/dashboard-stats');
    },
  },

  /**
   * Payment Requests API
   */
  paymentRequests: {
    getAll: async () => {
      return fetchAPI('/api/payment-requests');
    },

    create: async (data: {
      beneficiary: string;
      amount: number;
      dueDate: string;
      category: string;
      priority: string;
      description: string;
      attachmentUrl?: string;
    }) => {
      return fetchAPI('/api/payment-requests', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
};

export default api;
