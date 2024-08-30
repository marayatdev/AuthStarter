import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { TypedRequestBody } from "../utils/request";
import argon2 from "argon2";
import upload from "../shared/middlewares/upload";
import jwt from "jsonwebtoken";

export class AuthController {
  private jwtSecret = process.env.JWT_SECRET || "default_secret";
  private refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret";
  private authService = new AuthService();

  public createUser = async (
    req: TypedRequestBody<{
      username: string;
      email: string;
      password: string;
    }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Handle file upload
      upload.single("image_profile")(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        const { username, email, password } = req.body;
        const imagePath = req.file?.path;

        // Check if email already exists
        const existingEmail = await this.authService.findEmail(email);
        if (existingEmail) {
          return res.status(409).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashPassword = await argon2.hash(password);

        // Create the user
        const user = await this.authService.createUser(
          username,
          email,
          hashPassword,
          imagePath ?? ""
        );

        return res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  };

  public loginUser = async (
    req: TypedRequestBody<{
      email: string;
      password: string;
    }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;

      const user = await this.authService.findEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const valid = await argon2.verify(user.password, password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user.user_id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        this.jwtSecret,
        { expiresIn: "1m" }
      );

      const refreshToken = jwt.sign(
        { id: user.user_id },
        this.refreshTokenSecret,
        { expiresIn: "7d" } // Refresh token with longer lifespan
      );

      return res.json({ token, refreshToken });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }

      jwt.verify(refreshToken, this.refreshTokenSecret, (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newToken = jwt.sign(
          {
            id: decoded.id,
          },
          this.jwtSecret,
          { expiresIn: "15m" }
        );

        return res.json({ token: newToken });
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing or invalid" });
      }

      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload;

      const user = await this.authService.findById(decodedToken.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        email: user.email,
        username: user.username,
      });
    } catch (error) {
      next(error);
    }
  };


}
