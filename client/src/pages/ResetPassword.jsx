import React, { useContext, useState } from 'react'
import { assets } from '@/assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '@/context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { defaultToastOptions } from '@/config/toastConfig'
export const ResetPassword = () => {
 
  const {backendUrl} = useContext(AppContent);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [email,setEmail] = useState('');
  const [newPassword,setNewPassword] = useState('');
  const [isEmailSent , setIsEmailSent] = useState(false);
  const [otp , setOtp] = useState(0);
  const [isOtpSubmitted , setIsOtpSubmitted] = useState(false)


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
  
  const onSubmitEmail = async (e) =>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl+'api/auth/send-reset-otp',{email})
      data.success ? toast.success(data.message , defaultToastOptions):toast.error(data.message , defaultToastOptions)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message, defaultToastOptions);
    }
  }
  const onSubmitOTP = async (e) =>{
    e.preventDefault();
    const otpArray = inputRefs.current.map(e=>e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }

  const onSubmitNewPassword = async (e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl+'api/auth/reset-password',{email,otp,newPassword})
      data.success ? toast.success(data.message , defaultToastOptions):toast.error(data.message , defaultToastOptions)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message, defaultToastOptions);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-6 sm:px-0  bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={()=>navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28  sm:w-32 cursor-pointer"
      />
      {/* email form */}
      {!isEmailSent &&
        <form onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm ">

            <h1 className="text-white text-2xl font-semibold text-center mb-4"> Reset Password</h1>
            <p className="text-center mb-6 text-indigo-300">Enter Your registered email address</p>
            <div className='flex gap-6 items-center w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
              <img src={assets.mail_icon} alt="email"  className='w-4 h-4'/>
              <input type="email" placeholder='Email id'  
              value={email} onChange={e=> setEmail(e.target.value)}
              className='bg-transparent text-white outline-none' required/>
            </div>
            <button className='w-full rounded-full text-white font-semibold bg-gradient-to-r from-indigo-500 to-indigo-900 py-3 transition duration-300 ease-in-out transform hover:scale-105 hover:brightness-110 mt-5'>Submit</button>
        </form>
      }

      {/* otp form */}
      {!isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitOTP}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm ">
          <h1 className="text-white text-2xl font-semibold text-center mb-4"> Reset Password OTP</h1>
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
          <button className="w-full rounded-full text-white font-semibold bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5 transition duration-300 ease-in-out transform hover:scale-105 hover:brightness-110">
            Sumbit
          </button>
        </form>
      }

      {/* new password form */}
      {isEmailSent && isOtpSubmitted &&      
        <form onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm ">

            <h1 className="text-white text-2xl font-semibold text-center mb-4"> New Password</h1>
            <p className="text-center mb-6 text-indigo-300">Enter New Password Below</p>
            <div className='flex gap-6 items-center w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
              <img src={assets.lock_icon} alt="password"  className='w-4 h-4'/>
              <input type="password" placeholder='Password'  
              value={newPassword} onChange={e=> setNewPassword(e.target.value)}
              className='bg-transparent text-white outline-none'/>
            </div>
            <button className='w-full rounded-full text-white font-semibold bg-gradient-to-r from-indigo-500 to-indigo-900 py-3 transition duration-300 ease-in-out transform hover:scale-105 hover:brightness-110 mt-5'>Submit</button>
        </form>
      }
    </div>
  )
}
