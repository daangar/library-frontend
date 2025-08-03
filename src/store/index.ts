import { configureStore } from '@reduxjs/toolkit';
import loansReducer from './loansSlice';

export const store = configureStore({
  reducer: {
    loans: loansReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['loans/setSelectedLoan'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;