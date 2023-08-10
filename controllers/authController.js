import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    //token
    //token
    const accessToken = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = JWT.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    //create secure cookies with refresh token
    res.cookie("jwt", refreshToken, {
      httponly: true, //accesible only to web browser
      // secure: true, //https
      // sameSite: "None", //cross site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //expiry
    });
    console.log(user);
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
export const refreshController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorised" });
    const refreshToken = cookies.jwt;
    const decoded = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const foundUser = await User.findOne({ _id: decoded._id });
    if (!foundUser) return res.status(401).send({ message: "Unauthorised" });

    const accessToken = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15min",
    });

    res.send({ accessToken });
  } catch (error) {
    return res.status(500).send({ message: "Something Went Wrong" });
  }
};
// //logout
export const logoutController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies) return res.sendstatus(204);
  res.clearCookie("jwt", {
    httpOnly: true,
    //  sameSite: "None", secure: true
  });
  res.send({ message: "Cookie Cleared" });
};
//forgotPassword controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) res.status(400).send({ message: "Email is Required" });
    if (!answer) res.status(400).send({ message: "Answer is Required" });
    if (!newPassword)
      res.status(400).send({ message: "New Password is Required" });

    //check in db
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "Wrog Email or Answer" });
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res
      .status(200)
      .send({ success: true, message: "Password Reset Succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};
