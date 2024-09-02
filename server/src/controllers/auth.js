"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const argon2_1 = __importDefault(require("argon2"));
const upload_1 = __importDefault(require("../shared/middlewares/upload"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
class AuthController {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || "default_secret";
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret";
        this.authService = new auth_service_1.AuthService();
        this.createUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                const imagePath = req.file ? req.file.path : null;
                const imageName = imagePath ? path_1.default.basename(imagePath) : "";
                const existingEmail = yield this.authService.findEmail(email);
                if (existingEmail) {
                    return res.status(409).json({
                        error: "email already exists",
                        path: "email",
                        hasError: true,
                    });
                }
                const hashPassword = yield argon2_1.default.hash(password);
                upload_1.default.single("image_profile")(req, res, (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ error: err.message });
                    }
                });
                const user = yield this.authService.createUser(username, email, hashPassword, imageName || "");
                return res.status(201).json(user);
            }
            catch (error) {
                next(error);
            }
        });
        this.loginUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.authService.findEmail(email);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const valid = yield argon2_1.default.verify(user.password, password);
                if (!valid) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }
                const token = jsonwebtoken_1.default.sign({
                    id: user.user_id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    image_profile: user.image_profile,
                }, this.jwtSecret, { expiresIn: "15m" } // Changed to 15 minutes for more security
                );
                const refreshToken = jsonwebtoken_1.default.sign({ id: user.user_id }, this.refreshTokenSecret, { expiresIn: "7d" } // Refresh token with longer lifespan
                );
                return res.json({ token, refreshToken });
            }
            catch (error) {
                next(error);
            }
        });
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    return res.status(400).json({ message: "Refresh token is required" });
                }
                jsonwebtoken_1.default.verify(refreshToken, this.refreshTokenSecret, (err, decoded) => {
                    if (err) {
                        return res.status(403).json({ message: "Invalid refresh token" });
                    }
                    const newToken = jsonwebtoken_1.default.sign({
                        id: decoded.id,
                    }, this.jwtSecret, { expiresIn: "15m" } // Changed to 15 minutes for consistency
                    );
                    return res.json({ token: newToken });
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getUserMe = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith("Bearer ")) {
                    return res.status(401).json({ message: "Token missing or invalid" });
                }
                const token = authHeader.split(" ")[1];
                const decodedToken = jsonwebtoken_1.default.verify(token, this.jwtSecret);
                const user = yield this.authService.findById(decodedToken.id);
                console.log("aaa", user);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                return res.json({
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    image_profile: user.image_profile,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
