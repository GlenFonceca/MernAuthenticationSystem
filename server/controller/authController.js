import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import {EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE, WELCOME_EMAIL_TEMPLATE} from '../config/emailTemplates.js';

export const register = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ success: false, message: "Request body is missing" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        //Sending Welcome Emails
        const mailOptions = {
            from : process.env.SENDER_EMAIL ,
            to : email,
            subject:'Welcome to My Website',
            html : WELCOME_EMAIL_TEMPLATE.replace(/{{email}}/g, user.email)
        }
        await transporter.sendMail(mailOptions);

        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ success: false, message: "Request body is missing" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and Password are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid User" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//Send OTP to verify Email
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId; // Securely from middleware

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account already verified' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            // text: `Your OTP is ${otp}. It will expire in 24 hours.`,
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Verification OTP sent to your email.' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//verifying the OTP sent to Email
export const verifyEmail = async (req,res) =>{
    const { otp } = req.body;
    const userId = req.userId;


    if(!userId || !otp) {
        return res.json({ success: false, message: 'Missing Details'});
    }
    try{

        const user = await userModel.findById(userId);
        
        if(!user){
            return res.json({ success: false, message: 'User Not Found' });
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({ success: false, message: 'Invalid OTP' });
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({ success: false, message: 'OTP expired'});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Email Verified SuccesFully'})

    }catch(error){
       return res.json({ success: false, message: error.message });
    }
}

//Check is the User is Authenticated 
export const isAuthenticated = async (req,res) =>{

    try {
        return res.json({success:true});
    } catch (error) {
        return res.json({success:false , message: error.message});
    }
}

//Send Password reset OTP
export const sendResetPasswordOtp = async (req,res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: 'Email is required' });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000; 

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            // text: `Your OTP for password reset is ${otp}. It will expire in 15 minutes.`
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'OTP sent to your email.' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


//new Password Reset
export const resetPassword = async (req,res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpiredAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Password reset successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}