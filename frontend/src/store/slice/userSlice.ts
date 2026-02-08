// UserState used for deining what kind of data developer pick in typescript
import {createSlice, PayloadAction} from '@reduxjs/toolkit'


//first difned the UserState
export interface UserState{
    user: any|null;
    isEmailVerified: boolean;
    isLoginDialogOpen: boolean;
    isLoggedIn: boolean;
}
const initialState : UserState={
    user: null,
    isEmailVerified: false,
    isLoginDialogOpen: false,
    isLoggedIn: false,
}

//importing createSlice  
const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser:(state,action:PayloadAction<any>)=>{
            state.user=action.payload;
            state.isLoggedIn = true;
        },
        setEmailVerified:(state,action:PayloadAction<any>)=>{
            state.isEmailVerified=action.payload;
        },
        logout:(state)=>{
            state.user = null;
            state.isLoggedIn = false;
            state.isEmailVerified = false;
        },
        toggleLoginDialog:(state)=>{
            state.isLoginDialogOpen = !state.isLoginDialogOpen;
        },
        authStatus:(state)=>{
            state.isLoggedIn = true;
        }
    }      //have 2 thing, state(if any user do anything, in this state, the user's value will be updated) & action, 
});

export const {setUser, setEmailVerified, logout, toggleLoginDialog, authStatus} = userSlice.actions;
export default userSlice.reducer;