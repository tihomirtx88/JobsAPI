const User = require("./../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("./../errors");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const testUser = payload.userId === "62f801d0510a7c1ed2312d52";

    // Fetch user from DB
    //   const user = await User.findById(payload.userId).select("-password");

    //   if (!user) {
    //     return res.status(401).json({ error: "User not found" });
    //   }

    req.user = { userId: payload.userId, testUser };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};
module.exports = auth;
