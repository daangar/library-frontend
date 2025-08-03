import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Loan } from '../types/api';
import { apiService } from '../utils/api';

interface LoansState {
  loans: Loan[];
  selectedLoan: Loan | null;
  loading: boolean;
  error: string | null;
  filter: {
    status: 'all' | 'active' | 'returned';
    studentId: number | null;
  };
}

const initialState: LoansState = {
  loans: [],
  selectedLoan: null,
  loading: false,
  error: null,
  filter: {
    status: 'all',
    studentId: null,
  },
};

// Async thunks
export const fetchLoans = createAsyncThunk(
  'loans/fetchLoans',
  async (_, { rejectWithValue }) => {
    try {
      const loans = await apiService.getLoans();
      return loans;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar préstamos');
    }
  }
);

export const fetchLoanById = createAsyncThunk(
  'loans/fetchLoanById',
  async (loanId: number, { rejectWithValue }) => {
    try {
      const loan = await apiService.getLoan(loanId);
      return loan;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar préstamo');
    }
  }
);

export const returnLoan = createAsyncThunk(
  'loans/returnLoan',
  async (loanId: number, { rejectWithValue }) => {
    try {
      const returnedLoan = await apiService.returnLoan(loanId);
      return returnedLoan;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al devolver libro');
    }
  }
);

const loansSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    setSelectedLoan: (state, action: PayloadAction<Loan | null>) => {
      state.selectedLoan = action.payload;
    },
    setFilter: (state, action: PayloadAction<Partial<LoansState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchLoans
      .addCase(fetchLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchLoanById
      .addCase(fetchLoanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoanById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLoan = action.payload;
      })
      .addCase(fetchLoanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // returnLoan
      .addCase(returnLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(returnLoan.fulfilled, (state, action) => {
        state.loading = false;
        // Update the loan in the loans array
        const loanIndex = state.loans.findIndex(loan => loan.id === action.payload.id);
        if (loanIndex !== -1) {
          state.loans[loanIndex] = action.payload;
        }
        // Update selected loan if it's the same
        if (state.selectedLoan && state.selectedLoan.id === action.payload.id) {
          state.selectedLoan = action.payload;
        }
      })
      .addCase(returnLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedLoan, setFilter, clearError } = loansSlice.actions;

// Selectors
export const selectLoans = (state: { loans: LoansState }) => state.loans.loans;
export const selectSelectedLoan = (state: { loans: LoansState }) => state.loans.selectedLoan;
export const selectLoansLoading = (state: { loans: LoansState }) => state.loans.loading;
export const selectLoansError = (state: { loans: LoansState }) => state.loans.error;
export const selectLoansFilter = (state: { loans: LoansState }) => state.loans.filter;

export const selectFilteredLoans = (state: { loans: LoansState }) => {
  const { loans, filter } = state.loans;
  let filteredLoans = loans;

  // Filter by status
  switch (filter.status) {
    case 'active':
      filteredLoans = filteredLoans.filter(loan => !loan.is_returned);
      break;
    case 'returned':
      filteredLoans = filteredLoans.filter(loan => loan.is_returned);
      break;
    default:
      // 'all' - no filtering needed
      break;
  }

  // Filter by student
  if (filter.studentId) {
    filteredLoans = filteredLoans.filter(loan => loan.student.id === filter.studentId);
  }

  return filteredLoans;
};

export default loansSlice.reducer;