export const authMe = async (req, res) => {
  try {
    const user = req.user; // Lấy thông tin người dùng từ req.user được gán trong middleware
    return res.status(200).json({
      message: "Authenticated user",
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        displayName: req.user.displayName,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi authMe:", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
