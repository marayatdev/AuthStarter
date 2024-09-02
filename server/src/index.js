"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("./utils/prisma"));
const logger_1 = __importDefault(require("./utils/logger"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logHttpMiddleware_1 = __importDefault(require("./shared/middlewares/logHttpMiddleware"));
dotenv_1.default.config();
class App {
    constructor() {
        this.port = Number(process.env.PORT) || 3000;
        this.app = (0, express_1.default)();
        this.setup();
    }
    setup() {
        this.configureMiddleware();
        this.initializeDatabase()
            .then(() => this.initializeRoutes())
            .then(() => this.startServer())
            .catch((error) => {
            logger_1.default.error(`Setup failed: ${error.message}`);
            process.exit(1);
        });
    }
    configureMiddleware() {
        this.app.use(logHttpMiddleware_1.default);
        this.app.use((0, cors_1.default)());
        this.app.use(body_parser_1.default.json());
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.$connect();
                logger_1.default.info("Connected to database");
            }
            catch (error) {
                throw new Error(`Database connection error: ${error}`);
            }
        });
    }
    initializeRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            const routePath = path_1.default.resolve(__dirname, "routes");
            const routeFiles = fs_1.default
                .readdirSync(routePath)
                .filter((file) => file.endsWith(".ts"));
            for (const file of routeFiles) {
                try {
                    const routeModule = yield Promise.resolve(`${path_1.default.resolve(routePath, file)}`).then(s => __importStar(require(s)));
                    if (routeModule.default) {
                        this.app.use("/api", routeModule.default);
                        // http://localhost:3000/api/media/
                        this.app.use('/api/media', express_1.default.static(path_1.default.join(__dirname, './uploads/')));
                    }
                }
                catch (error) {
                    logger_1.default.error(`Error loading route module ${file}: ${error}`);
                }
            }
        });
    }
    startServer() {
        this.app.listen(this.port, () => {
            logger_1.default.info(`=================================`);
            logger_1.default.info(`========== Hello World ==========`);
            logger_1.default.info(`🚀 Server is running on port ${this.port}`);
            logger_1.default.info(`=================================`);
        });
    }
}
new App();
