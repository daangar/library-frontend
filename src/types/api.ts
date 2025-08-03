// API Types based on the Library Management API documentation

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'librarian';
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role?: 'student' | 'librarian';
}

// Author y Genre ahora son strings en la API
export interface Author {
  id: number;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
  description?: string;
}

export interface Book {
  id: number;
  title: string;
  author_name: string;    // Changed from nested Author object
  published_year: number;
  genre_name: string;     // Changed from nested Genre object
  stock: number;
  is_available: boolean;
}

export interface CreateBookRequest {
  title: string;
  author_name: string;    // Changed from author_id
  genre_name: string;     // Changed from genre_id
  published_year: number;
  stock?: number;
}

export interface Loan {
  id: number;
  student: User;
  book: Book;
  borrowed_at: string;
  returned_at: string | null;
  is_returned: boolean;
}

export interface CreateLoanRequest {
  book_id: number;
  student_id?: number; // Optional - defaults to current user if student
}

export interface ApiError {
  error: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
