import { configureStore, createSlice } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import your reducers

import adminReducer from './slices/adminslice/adminSlice';
import adminActivityReducer from './slices/adminslice/adminActivitySlice';
import usersReducer from './slices/adminslice/all-user-details';



// Temporary placeholder slice until you add your own slices
const placeholderSlice = createSlice({
  name: 'placeholder',
  initialState: {},
  reducers: {},
});

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add your reducers here
      admin: adminReducer,  
      placeholder: placeholderSlice.reducer,
      adminActivity: adminActivityReducer,
       users: usersReducer, 
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Export pre-typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;