"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../shared/middlewares/auth");
const upload_1 = __importDefault(require("../shared/middlewares/upload"));
class AuthRoutes {
    constructor() {
        this.path = "/auth";
        this.router = (0, express_1.Router)();
        this.authController = new auth_1.AuthController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/login`, this.authController.loginUser);
        this.router.post(`${this.path}/register`, upload_1.default.single("image_profile"), this.authController.createUser);
        this.router.post(`${this.path}/refresh`, this.authController.refreshToken);
        this.router.get(`${this.path}/me`, auth_2.authenticateToken, this.authController.getUserMe);
    }
}
exports.AuthRoutes = AuthRoutes;
exports.default = new AuthRoutes().router;
