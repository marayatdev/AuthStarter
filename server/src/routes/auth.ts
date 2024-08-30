import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/auth";
import { authenticateToken } from "../shared/middlewares/auth";
import upload from "../shared/middlewares/upload";

export class AuthRoutes {
  public path: string = "/auth";
  public router = Router();

  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.authController.loginUser);
    this.router.post(`${this.path}/register`, upload.single('image_profile'), this.authController.createUser);
    this.router.post(`${this.path}/refresh`, this.authController.refreshToken);
    this.router.get(
      `${this.path}/me`,
      authenticateToken,
      this.authController.getUserMe
    );
  }
}

export default new AuthRoutes().router;
