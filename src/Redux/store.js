import { configureStore } from "@reduxjs/toolkit";
import { postApi } from "../Redux/post.js";
import authSlice  from "../Redux/appSlice.js";



export const store = configureStore({
    reducer :{
        [postApi.reducerPath]: postApi.reducer,
       auth:authSlice,
    },
    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware().concat(postApi.middleware),
})