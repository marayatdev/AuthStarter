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
    this.router.get(`${this.path}/login`, this.authController.loginUser);
    this.router.post(`${this.path}/register`, this.authController.createUser);
  }
}

export default new AuthRoutes().router;
