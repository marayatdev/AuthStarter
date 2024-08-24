import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  user_id: string;
  username: string;
  email: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).json({ message: "Token required" });

  jwt.verify(
    token,
    process.env.JWT_SECRET || "default_secret",
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      if (decoded && typeof decoded !== "string") {
        (req as any).user = decoded as CustomJwtPayload;
        next();
      } else {
        res.status(401).json({ message: "Invalid token" });
      }
    }
  );
};
