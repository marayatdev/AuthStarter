import express, { Application } from "express";
import dotenv from "dotenv";
import prisma from "./utils/prisma";
import logger from "./utils/logger";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import morganMiddleware from "./shared/middlewares/logHttpMiddleware";

dotenv.config();

class App {
  private app: Application;
  private port: number = Number(process.env.PORT) || 3000;

  constructor() {
    this.app = express();
    this.setup();
  }

  private setup(): void {
    this.configureMiddleware();
    this.initializeDatabase()
      .then(() => this.initializeRoutes())
      .then(() => this.startServer())
      .catch((error) => {
        logger.error(`Setup failed: ${error.message}`);
        process.exit(1);
      });
  }

  private configureMiddleware(): void {
    this.app.use(morganMiddleware);
    this.app.use(cors());
    this.app.use(bodyParser.json());
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await prisma.$connect();
      logger.info("Connected to database");
    } catch (error) {
      throw new Error(`Database connection error: ${error}`);
    }
  }

  private async initializeRoutes(): Promise<void> {
    const routePath = path.resolve(__dirname, "routes");
    const routeFiles = fs
      .readdirSync(routePath)
      .filter((file) => file.endsWith(".ts"));

    for (const file of routeFiles) {
      try {
        const routeModule = await import(path.resolve(routePath, file));
        if (routeModule.default) {
          this.app.use("/api", routeModule.default);
          // http://localhost:3000/api/media/
          this.app.use('/api/media', express.static(path.join(__dirname, './uploads/')))
        }
      } catch (error) {
        logger.error(`Error loading route module ${file}: ${error}`);
      }
    }
  }

  private startServer(): void {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`========== Hello World ==========`);
      logger.info(`🚀 Server is running on port ${this.port}`);
      logger.info(`=================================`);
    });
  }


}

new App();
