import { configureStore } from "@reduxjs/toolkit";
import columnsReducer from "./columns";
import tasksReducer from "./tasks";

export const store = configureStore({
  reducer: {
    columns: columnsReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
