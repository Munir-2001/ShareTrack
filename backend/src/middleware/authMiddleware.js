import jwt from "jsonwebtoken";

/**
 * Middleware to authenticate admins
 */
export const authenticateAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Not an admin" });
    }

    req.admin = decoded; // Store admin details in request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
