import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface WishlistItem{
    _id:string;
    products: string[];
}

export interface WishlistState{
    items:WishlistItem[];
}

const initialState:WishlistState={
    items:[],
}

const wishlistSlice = createSlice({
    name:"wishlist",
    initialState,
    reducers:{
        setWishlist:(state, action:PayloadAction<WishlistItem[]>)=>{ 
            state.items = action.payload;
        },
        addToWishlistAction:(state, action:PayloadAction<WishlistItem>)=>{
            const existingItemIndex = state.items.findIndex(item=> item._id===action.payload._id);
            if(existingItemIndex !== -1){  //-1 used for checking if the item is already in the wishlist
                state.items[existingItemIndex] = action.payload;
            }else{
                state.items.push(action.payload);
            }
        },
        removeFromWishlistAction:(state, action:PayloadAction<string>)=>{
            state.items=state.items.map(item=>({
                ...item,
                products:item.products.filter(productId=>productId!==action.payload)
            })).filter(item=>item.products.length>0);
        },
        clearWishlist:(state)=>{
            state.items = [];
        }
    }
})


export const {setWishlist, addToWishlistAction, removeFromWishlistAction, clearWishlist} = wishlistSlice.actions;
export default wishlistSlice.reducer;
