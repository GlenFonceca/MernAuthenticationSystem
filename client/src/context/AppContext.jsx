import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { defaultToastOptions } from "@/config/toastConfig";

export const AppContent = createContext()

export const AppContextProvider = (props) =>{

    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn,setIsLoggedin] = useState(false)
    const [userData,setUserData] = useState(false)

    const getAuthState = async () =>{
        try {
            const {data}  = await axios.get(backendUrl+'api/auth/is-auth')
            if(data.success){
                setIsLoggedin(true);
                getUserData()
            }
            
        } catch (error) {
            toast.error(data.message,defaultToastOptions)
        }
    }

    const getUserData = async () =>{
        try {
            const {data} = await axios.get(backendUrl+'api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message,defaultToastOptions)
        } catch (error) {
            toast.error(data.message,defaultToastOptions)
        }
    }

    useEffect(()=>{
        getAuthState();  
    },[])

    const value  ={
        backendUrl,
        isLoggedIn,setIsLoggedin,
        userData,setUserData,
        getUserData
    }
    return(
        <AppContent.Provider value = {value}>
            {props.children}
        </AppContent.Provider>
    )
}