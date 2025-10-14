export const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.inclues(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
