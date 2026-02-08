import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { persistReducer,persistStore,FLUSH,REHYDRATE,PAUSE,PURGE,PERSIST,REGISTER} from 'redux-persist'
import userReducer, { UserState } from './slice/userSlice'
import cartReducer, { CartSlice } from './slice/cartSlice'
import wishlistReducer, { WishlistState } from './slice/wishlistSlice'
import { api } from './api'
import type { PersistPartial } from 'redux-persist/es/persistReducer'
import checkoutReducer, { CheckoutState } from './slice/checkoutSlice'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'




const createNoopStorage = () => {
    return {
        getItem(_key: string) {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: any) {
            return Promise.resolve(value);
        },
        removeItem(_key: string) {
            return Promise.resolve();
        },
    };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();


//persist(user's data saved in local storage when reload and login) configuration for user
const userPersistConfig = {key: 'user', storage, whitelist: ['user', 'isEmailVerified', 'isLoggedIn']}
const cartPersistConfig = {key: 'cart', storage, whitelist: ['items']}
const wishlistPersistConfig = {key: 'wishlist', storage}
const checkoutPersistConfig = {key: 'checkout', storage}

//wrap reducers with persist config
const persitedUserReducer = persistReducer(userPersistConfig, userReducer)
const persitedCartReducer = persistReducer(cartPersistConfig, cartReducer)
const persitedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer)
const persitedCheckoutReducer = persistReducer(checkoutPersistConfig, checkoutReducer)

export const store = configureStore({
    reducer:{
        [api.reducerPath] : api.reducer, //rtk wuery api
        user: persitedUserReducer,
        cart: persitedCartReducer,
        wishlist: persitedWishlistReducer,
        checkout: persitedCheckoutReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH,REHYDRATE,PAUSE,PURGE,PERSIST,REGISTER],
            },
        }).concat(api.middleware)
})

//setup the listener for RTK Query
setupListeners(store.dispatch);

//create persist store
// Get the type of our store variable
export const persistor = persistStore(store);
// Explicit RootState to avoid widening to unknown with persisted reducers
export interface RootState {
    user: UserState & PersistPartial;
    cart: CartSlice;
    wishlist: WishlistState;
    checkout: CheckoutState & PersistPartial;
    [api.reducerPath]: ReturnType<typeof api.reducer>;
}
export type AppDispatch = typeof store.dispatch 