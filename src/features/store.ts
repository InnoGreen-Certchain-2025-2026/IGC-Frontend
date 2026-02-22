import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import persistStorage from "redux-persist/lib/storage";

const storage =
  (persistStorage as unknown as { default?: typeof persistStorage }).default ||
  persistStorage;
import authReducer from "./auth/authSlice";
import organizationReducer from "./organization/organizationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  organization: organizationReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "organization"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
