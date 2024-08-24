import winston from "winston";

// การตั้งค่าโลเกเตอร์
const { combine, timestamp, printf, errors, colorize } = winston.format;

// ฟอร์แมตการล็อก
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// การสร้างโลเกเตอร์
const logger = winston.createLogger({
  level: "info", // ระดับการล็อก (info, warn, error, debug)
  format: combine(
    timestamp(),
    errors({ stack: true }), // จัดการกับข้อผิดพลาดและสแตก
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(), // เพิ่มสีให้กับข้อความล็อกในคอนโซล
        timestamp(),
        printf(({ level, message, timestamp, stack }) => {
          return `${timestamp} [${level}]: ${stack || message}`;
        })
      ),
      level: "debug", // แสดงข้อมูลล็อกระดับ debug และสูงกว่าในคอนโซล
    }),
    new winston.transports.File({ filename: "logs/app.log", level: "info" }), // ล็อกไปยังไฟล์ (บันทึกข้อมูลระดับ info และสูงกว่า)
  ],
});

// ฟังก์ชันสำหรับล็อกข้อมูล
export function logInfo(message: string) {
  logger.info(message);
}

// ฟังก์ชันสำหรับล็อกข้อผิดพลาด
export function logError(message: string, error?: Error) {
  logger.error(message, { error });
}

// ฟังก์ชันสำหรับล็อกการเตือน
export function logWarn(message: string) {
  logger.warn(message);
}

// ฟังก์ชันสำหรับล็อกการดีบัก
export function logDebug(message: string) {
  logger.debug(message);
}

export default logger;
