import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { TypedRequestBody } from "../utils/request";
import argon2 from "argon2";
import upload from "../middlewares/upload";
import jwt from "jsonwebtoken";

export class AuthController {
  private jwtSecret = process.env.JWT_SECRET || "default_secret";
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
    upload.single("image_profile")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      try {
        const { username, email, password } = req.body;
        const imagePath = req.file?.path;

        const hashPassword = await argon2.hash(password);

        const existingEmail = await this.authService.findEmail(email);
        if (existingEmail) {
          return res.status(409).json({ message: "Email already exists" });
        }

        const user = await this.authService.createUser(
          username,
          email,
          hashPassword,
          imagePath ?? ""
        );

        return res.status(201).json(user);
      } catch (error) {
        next(error);
      }
    });
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
        return res.status(404).json({ message: "user not found" });
      }

      const valid = await argon2.verify(user.password, password);
      if (!valid) {
        return res.status(401).json({ message: "invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user.user_id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        this.jwtSecret,
        {
          expiresIn: "1h",
        }
      );
      return res.json({ token });
    } catch (error) {
      console.log(error);
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

  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Extract refresh token from the request
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
      }

      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        this.jwtSecret
      ) as jwt.JwtPayload;

      // Generate a new access token
      const newToken = jwt.sign(
        {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username,
          role: decoded.role,
        },
        this.jwtSecret,
        {
          expiresIn: "1h", // Set expiration time as needed
        }
      );

      return res.json({ token: newToken });
    } catch (error) {
      next(error);
    }
  };
}
