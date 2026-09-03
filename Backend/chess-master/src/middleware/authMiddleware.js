function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  return res.status(401).json({ success: false, message: "Please login first." });
}

function isGuest(req, res, next) {
  if (req.session && req.session.user) {
    return res.status(400).json({ success: false, message: "Already logged in." });
  }

  return next();
}

function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ success: false, message: "You are not allowed to access this resource." });
}

module.exports = {
  isAuthenticated,
  isGuest,
  isAdmin
};
