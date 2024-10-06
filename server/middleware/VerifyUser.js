const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const VerifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SCRETE_KEY, async (err, user) => {
      try {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Unauthorizeds" });
        }
        req.user = user;
        next();
      } catch (error) {
        return res.status(500).json({ error });
      }
    });
  } else {
    return res.status(500).json({ success: false, message: "Forbidden" });
  }
};

module.exports = { VerifyUser };
