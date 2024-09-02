"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res.status(401).json({ message: "Token required" });
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default_secret", (err, decoded) => {
        if (err)
            return res.status(403).json({ message: "Forbidden" });
        if (decoded && typeof decoded !== "string") {
            req.user = decoded;
            next();
        }
        else {
            res.status(401).json({ message: "Invalid token" });
        }
    });
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map