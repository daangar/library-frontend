import type {
    Book,
    CreateBookRequest,
    CreateLoanRequest,
    CreateUserRequest,
    Loan,
    LoginRequest,
    LoginResponse,
    User,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Debug logging para development
    if (import.meta.env.DEV) {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-cache',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error del servidor' }));
        const errorMsg = errorData.error || errorData.detail || `Error ${response.status}`;
        if (import.meta.env.DEV) {
          console.error(`❌ API Error: ${response.status} - ${errorMsg}`);
        }
        throw new Error(errorMsg);
      }

      // Respuestas sin contenido
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      if (import.meta.env.DEV) {
        console.log(`✅ API Response: ${options.method || 'GET'} ${url}`, data);
      }
      return data;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`🚨 Fetch Error for ${url}:`, error);
      }
      
      // Si es un error de red o CORS, lanzar mensaje más específico
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Error CORS: El backend no permite requests desde localhost:3000. Contactar al administrador del backend para configurar CORS.');
      }
      
      throw error;
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/token/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/users/me/');
  }

  // Users management (Librarians only)
  async getUsers(role?: 'student' | 'librarian'): Promise<User[]> {
    const queryParams = role ? `?role=${role}` : '';
    return this.request<User[]>(`/api/users/${queryParams}`);
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    return this.request<User>('/api/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: Partial<CreateUserRequest>): Promise<User> {
    return this.request<User>(`/api/users/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<void> {
    return this.request<void>(`/api/users/${id}/`, {
      method: 'DELETE',
    });
  }

  // Books management
  async getBooks(filters?: {
    title?: string;
    author_name?: string;
    genre_name?: string;
    available?: boolean;
  }): Promise<Book[]> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<Book[]>(`/api/books/${queryString}`);
  }

  async createBook(bookData: CreateBookRequest): Promise<Book> {
    return this.request<Book>('/api/books/', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(id: number, bookData: Partial<CreateBookRequest>): Promise<Book> {
    return this.request<Book>(`/api/books/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(id: number): Promise<void> {
    return this.request<void>(`/api/books/${id}/`, {
      method: 'DELETE',
    });
  }

  // Loans management
  async getLoans(filters?: {
    is_returned?: boolean;
  }): Promise<Loan[]> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<Loan[]>(`/api/loans/${queryString}`);
  }

  async getLoan(id: number): Promise<Loan> {
    return this.request<Loan>(`/api/loans/${id}/`);
  }

  async createLoan(loanData: CreateLoanRequest): Promise<Loan> {
    return this.request<Loan>('/api/loans/', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });
  }

  async returnLoan(id: number): Promise<Loan> {
    return this.request<Loan>(`/api/loans/${id}/return/`, {
      method: 'PATCH',
    });
  }

  async deleteLoan(id: number): Promise<void> {
    return this.request<void>(`/api/loans/${id}/`, {
      method: 'DELETE',
    });
  }

  // Authors y genres ahora son strings directamente en la API
}

export const apiService = new ApiService();
