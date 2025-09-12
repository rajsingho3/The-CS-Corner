import mongoose from "mongoose";
import User from "../models/user.model.js";
import TempUser from "../models/tempUser.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { SendVerificationCode } from "../middleware/Email.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === "" || email === "" || password === "") {
        next(errorHandler(400, "All fields are required"));
    }

    try {
       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, "Email already registered"));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        
        const tempUser = new TempUser({
            username,
            email,
            password: hashedPassword,
            verificationCode
        });
        await tempUser.save();

        
        await SendVerificationCode(email, verificationCode);
        res.json({ success: true, message: "Verification code sent successfully" });
        
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res,next) => {
    const {email, password} = req.body;
    if (!email || !password || email === "" || password === "") {
        next(errorHandler(400, "All fields are required"));
    }
    try {
        const validuser = await User.findOne({ email });
        if (!validuser) {
           return next(errorHandler(404, "User not found"));
        }
        const validPassword = bcryptjs.compareSync(password, validuser.password);
        if (!validPassword) {
          return  next(errorHandler(401, "Invalid password"));
        }
        const token = jwt.sign({ id: validuser._id, isAdmin:validuser.isAdmin }, process.env.JWT_SECRET
        );
        const { password: pass, ...rest } = validuser._doc;
        res.status(200).cookie('access_token', token, {
            httpOnly: true,
            
        }).json(rest);
        
    } catch (error) {
        next(error);
        
    }
};

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign(
          { id: user._id, isAdmin:user.isAdmin },
          process.env.JWT_SECRET
        );
        const { password, ...rest } = user._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            name.toLowerCase().split(' ').join('') +
            Math.random().toString(9).slice(-4),
          email,
          password: hashedPassword,
          profilePicture: googlePhotoUrl,
        });
        await newUser.save();
        const token = jwt.sign(
          { id: newUser._id, isAdmin:newUser.isAdmin },
          process.env.JWT_SECRET
        );
        const { password, ...rest } = newUser._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  };

export const verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(errorHandler(400, "Email and OTP are required"));
    }

    try {
        const tempUser = await TempUser.findOne({ email });
        
        if (!tempUser) {
            return next(errorHandler(404, "User not found"));
        }

        if (tempUser.verificationCode !== otp) {
            return next(errorHandler(400, "Invalid OTP"));
        }

        
        const newUser = new User({
            username: tempUser.username,
            email: tempUser.email,
            password: tempUser.password,
            isVerified: true
        });
        await newUser.save();

        
        await TempUser.deleteOne({ email });

       
        const token = jwt.sign(
            { id: newUser._id, isAdmin: newUser.isAdmin },
            process.env.JWT_SECRET
        );

        const { password, ...rest } = newUser._doc;

        res
            .status(200)
            .cookie('access_token', token, {
                httpOnly: true,
            })
            .json({
                success: true,
                message: "Email verified successfully",
                user: rest
            });

    } catch (error) {
        next(error);
    }
};