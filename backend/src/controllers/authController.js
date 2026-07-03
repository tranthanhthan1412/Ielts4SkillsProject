import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";
import User from "../models/User.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days theo milliseconds

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const duplicate = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase() }],
    });

    if (duplicate) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      displayName: `${firstName} ${lastName}`,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi signUp:", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Thiếu tên người dùng hoặc mật khẩu" });
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Tên người dùng hoặc mật khẩu không đúng" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Tên người dùng hoặc mật khẩu không đúng" });
    }
    // Tạo access token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    // Tạo refresh token và lưu vào cơ sở dữ liệu
    const refreshToken = crypto.randomBytes(64).toString("hex");

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    const isProduction = process.env.NODE_ENV === "production";
    // Set cookie cho refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // cookie chỉ có thể được truy cập thông qua HTTP(S), không thể truy cập bằng JavaScript
      secure: isProduction, // cookie chỉ được gửi qua HTTPS trong môi trường production
      sameSite: isProduction ? "none" : "lax", // cookie sẽ được gửi trong các yêu cầu cùng nguồn (same-site) hoặc trong các yêu cầu từ các nguồn khác (cross-site) tùy thuộc vào môi trường
      maxAge: REFRESH_TOKEN_TTL,
    });
    // Trả về access token và thông tin người dùng
    return res.status(200).json({
      message: `User ${user.displayName} đã đăng nhập thành công`,
      accessToken,
    });
  } catch (error) {
    console.error("Lỗi khi gọi signIn:", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const signOut = async (req, res) => {
  try {
    // lay refresh token tu cookie
    const token = req.cookies.refreshToken;

    if (token) {
      // Xóa refresh token trong session
      await Session.findOneAndDelete({ refreshToken: token });
      // xoa cookie refresh token
      res.clearCookie("refreshToken");
    }

    return res.status(204);
  } catch (error) {
    console.error("Lỗi khi gọi signOut:", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
