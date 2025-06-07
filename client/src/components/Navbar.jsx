import { assets } from '@/assets/assets'
import { defaultToastOptions } from '@/config/toastConfig'
import { AppContent } from '@/context/AppContext'
import axios from 'axios'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


const Navbar = () => {

  const navigate = useNavigate()
  const {userData,backendUrl,setUserData , setIsLoggedin} = useContext(AppContent);

  const logout = async()=>{

    try {
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendUrl+'api/auth/logout')
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      navigate('/')
      toast.success(data.message , defaultToastOptions);
    } catch (error) {
      toast.error(error.message , defaultToastOptions);
    }
  }

  const sendVerifcationOtp = async()=>{
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl+'api/auth/send-verify-otp')

      if(data.success){
        navigate('/verify-email')
        toast.success(data.message,defaultToastOptions)
      }
    } catch (error) {
      toast.error(error.message,defaultToastOptions)
    }
  }
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 top-0'>

        <img  src={assets.logo} alt='' className='w-28 sm:w-32' />
        {
          userData? (
            <div className='w-10 h-10 flex justify-center items-center rounded-full bg-black text-white relative group'>
              {userData.name[0].toUpperCase()}
              <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded-full pt-10'> 
                <ul className='list-none mt-2 p-2 bg-gray-100 text-sm'>
                  {userData.isAccountVerified == false && ( <li onClick={sendVerifcationOtp}
                   className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>) }
                  <li onClick={logout}
                   className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
                </ul>
              </div>
            </div>
          ): (<button onClick={()=>navigate('/login')}
          className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bggray-100 transition-all hover:bg-gray-100 '>Login <img src={assets.arrow_icon} alt='' /> </button>)
        }
        
    </div>
  )
}

export default Navbar;
