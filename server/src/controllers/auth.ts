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
    req: Request,
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
        { id: user.user_id, email: user.email, username: user.username },
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
}
