const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "chessmasterjwtsecret"
      );

      req.session.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again."
      });
    }
  }

  return res.status(401).json({ success: false, message: "Please login first." });
}
module.exports = {
  isAuthenticated,
  isGuest,
  isAdmin
};
