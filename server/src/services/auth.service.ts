import { PrismaClient } from "@prisma/client";
import logger, { logDebug, logError } from "../utils/logger";

export class AuthService {
  private prisma = new PrismaClient();

  public async findEmail(email: string) {
    return this.prisma.users.findFirst({
      where: { email },
    });
  }

  public async createUser(
    username: string,
    email: string,
    password: string,
    imagePath: string
  ) {
    return this.prisma.users.create({
      data: { username, email, password, image_profile: imagePath },
    });
  }
}
