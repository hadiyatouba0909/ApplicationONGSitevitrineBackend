const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Helper ───────────────────────────────────────────────────────
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Erreur serveur');
  return data as T;
}

// ─── Types ────────────────────────────────────────────────────────
export interface Activite {
  id: number;
  titre: string;
  description: string;
  image_url: string;
  date_activite: string | null;
  published: boolean;
  created_at: string;
}

export interface Service {
  id: number;
  titre: string;
  description: string;
  icone: string | null;
  ordre: number;
  published: boolean;
}

export interface ContactMessage {
  id: number;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  lu: boolean;
  created_at: string;
}

export interface AdminInfo {
  id: number;
  email: string;
  nom: string;
}

// ─── Auth ─────────────────────────────────────────────────────────
export const authAPI = {
  login: async (email: string, password: string): Promise<{ token: string; admin: AdminInfo }> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },
};

// ─── Activités ────────────────────────────────────────────────────
export const activitesAPI = {
  getAll: async (): Promise<Activite[]> => {
    const res = await fetch(`${API_URL}/activites`);
    return handleResponse(res);
  },

  getAllAdmin: async (): Promise<Activite[]> => {
    const res = await fetch(`${API_URL}/activites/admin`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  create: async (formData: FormData): Promise<Activite> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    const res = await fetch(`${API_URL}/activites`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return handleResponse(res);
  },

  update: async (id: number, formData: FormData): Promise<Activite> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    const res = await fetch(`${API_URL}/activites/${id}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return handleResponse(res);
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/activites/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};

// ─── Services ─────────────────────────────────────────────────────
export const servicesAPI = {
  getAll: async (): Promise<Service[]> => {
    const res = await fetch(`${API_URL}/services`);
    return handleResponse(res);
  },

  getAllAdmin: async (): Promise<Service[]> => {
    const res = await fetch(`${API_URL}/services/admin`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  create: async (data: Partial<Service>): Promise<Service> => {
    const res = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  update: async (id: number, data: Partial<Service>): Promise<Service> => {
    const res = await fetch(`${API_URL}/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};

// ─── Contact ──────────────────────────────────────────────────────
export const contactAPI = {
  send: async (data: { nom: string; email: string; sujet: string; message: string }): Promise<{ message: string }> => {
    const res = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  getMessages: async (lu?: boolean): Promise<ContactMessage[]> => {
    const url = lu !== undefined ? `${API_URL}/contact/messages?lu=${lu}` : `${API_URL}/contact/messages`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  markAsRead: async (id: number): Promise<ContactMessage> => {
    const res = await fetch(`${API_URL}/contact/messages/${id}/lu`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/contact/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
