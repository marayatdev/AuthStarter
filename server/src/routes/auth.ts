import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/auth";
import { authenticateToken } from "../middlewares/auth";

export class AuthRoutes {
  public path: string = "/auth";
  public router = Router();

  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.authController.loginUser);
    this.router.post(`${this.path}/register`, this.authController.createUser);
    this.router.post(`${this.path}/refresh`, this.authController.refreshToken);
    this.router.get(
      `${this.path}/me`,
      authenticateToken,
      this.authController.getUserMe
    );
  }
}

export default new AuthRoutes().router;
