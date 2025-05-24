import { upsertStreamUser } from "../lib/stream.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  try {
    const { email, password, fullname } = req.body;
    if (!email || !password || !fullname) {
      return res.status(400).json({ message: "All fields are required" });
    }
    

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "Email already exist,please use different one" });
    }

    //for avatar
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullname,
      password,
      profilePic: randomAvatar,
    });

    try {
      //Stream

      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullname,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullname}`);
    } catch (error) {
      console.log("Error creating Stream user", error);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "10d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in sign up", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
          console.log("Email login",email)
        console.log("Email login",password)

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPassMatch = await userExist.matchPassword(password);
    if (!isPassMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: userExist._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "10d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, userExist });
  } catch (error) {
    console.log("Error in login", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function logout(req, res) {
  res.clearCookie("jwt", "");
  res.status(200).json({ success: true, message: "logout Successfully" });
}

export async function onboard(req, res) {
  console.log(req.user);

  try {
    const userId = req.user._id;

    const { fullname, bio, nativeLanguage, location, learningLanguage } =
      req.body;

    if (
      !fullname ||
      !bio ||
      !nativeLanguage ||
      !location ||
      !learningLanguage
    ) {
      return res
        .status(400)
        .json({
          message: "All fields are required",
          missingField: [
            !fullname && "fullname",
            !bio && "bio",
            !nativeLanguage && "nativeLanguage",
            !location && "location",
            !learningLanguage && "learningLanguage",
          ].filter(Boolean),
        });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnBoarded: true,
      },
      { new: true }
    ).select("-password");

    if(!updatedUser){
            res.status(404).json({ message: "User not found" });

    }

    //stream
  try {
      //Stream

      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullname,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated is ${updatedUser.fullname}`);
    } catch (error) {
      console.log("Error updation Stream user", error);
    }
    

        res.status(200).json({ success:true,user:updatedUser });



  } catch (error) {
    console.error("Onboarding Error",error);

    res.status(500).json({ message: "Internal Server Error" });
  }
}
