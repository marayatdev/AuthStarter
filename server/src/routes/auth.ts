import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/auth";
import { authenticateToken } from "../middlewares/auth";

export class AuthRoutes {
  public router = Router();

  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/auth`, this.authController.loginUser);
    this.router.post(`/auth`, this.authController.createUser);
  }
}

export default new AuthRoutes().router;
