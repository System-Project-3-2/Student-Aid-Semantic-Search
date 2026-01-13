export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (protect middleware should have set it)
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized - no user found" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
