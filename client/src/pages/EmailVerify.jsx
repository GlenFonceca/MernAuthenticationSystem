import React, { useContext, useEffect } from "react";
import { assets } from "@/assets/assets";
import { AppContent } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { defaultToastOptions } from "@/config/toastConfig";

export const EmailVerify = () => {

  axios.defaults.withCredentials = true;
  const {backendUrl,isLoggedin,userData,getUserData} = useContext(AppContent);

  const navigate = useNavigate()

  const inputRefs= React.useRef([]);
  const handleInput=(e,index)=>{
    if(e.target.value.length > 0 && index < inputRefs.current.length-1){
      inputRefs.current[index+1].focus();
    }
  }
  const handleKeyDown= (e,index) =>{
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) =>{
    e.preventDefault(); // Prevent default paste behavior
    const paste = e.clipboardData.getData('text').trim();
    const pasteArray = paste.split(''); // Split into individual characters

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        const cleanedChar = char.replace(/[^0-9]/g, ''); // Accept digits only
        inputRefs.current[index].value = cleanedChar;

        // Auto focus next if current char is valid
        if (cleanedChar && index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1].focus();
        }
      }
    });
  }

  const onSubmitHandler = async (e) =>{
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e=> e.value)
      const otp = otpArray.join('')
      const {data} = await axios.post(backendUrl +'api/auth/verify-account',{otp})
      
      if(data.success){
        toast.success(data.message,defaultToastOptions)
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message , defaultToastOptions)
      }
    } catch (error) {
      toast.error(error.message,defaultToastOptions)
    }
  }

  useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedin,userData])

  return (
    <div className="flex justify-center items-center min-h-screen px-6 sm:px-0  bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => naviagte("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28  sm:w-32 cursor-pointer"
      />

      <form onSubmit={onSubmitHandler}
       className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm ">
        <h1 className="text-white text-2xl font-semibold text-center mb-4"> Email Verify OTP</h1>
        <p className="text-center mb-6 text-indigo-300">Enter the 6 Digit code sent to your Email Id</p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6).fill(0).map((_,index)=>(
            <input type="text" maxLength={1} key={index} required
            className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"

            ref={e=>inputRefs.current[index] = e}

            onKeyDown={(e) =>{handleKeyDown(e,index)}}
            onInput={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, ''); 
              e.target.value = val;
              handleInput(e, index);
            }}
            
            />
          ))} 
        </div>
        <button className="w-full rounded-full text-white font-semibold bg-gradient-to-r from-indigo-500 to-indigo-900 py-3 transition duration-300 ease-in-out transform hover:scale-105 hover:brightness-110">
          Verify Email
        </button>
      </form>
    </div>
  );
};
