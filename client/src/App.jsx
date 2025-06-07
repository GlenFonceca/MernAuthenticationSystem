import React from 'react'
import {Routes , Route, Navigate} from 'react-router-dom'
import { Login } from './pages/Login'
import { EmailVerify } from './pages/EmailVerify'
import { Home } from './pages/Home'
import { ResetPassword } from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <div >
      <ToastContainer/>
      <Routes>
        <Route path='/' element ={<Home/>}/>
        <Route path='/login' element ={<Login/>}/>
        <Route path='/verify-email' element ={<EmailVerify/>}/>
        <Route path='/reset-password' element ={<ResetPassword/>}/>
        <Route path='*' element={<Navigate to='/login' replace/>}/>
      </Routes>
    </div>
  )
}

export default App;
