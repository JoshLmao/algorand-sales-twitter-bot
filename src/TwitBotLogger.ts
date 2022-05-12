import winston from "winston";

// Init dotenv for checking any .env vars for file
const path = require('path'); 
require('dotenv').config({ 
    path: path.join(__dirname, '../.env') 
});

const logFormat = (logObject: any) => {
    return `[${logObject.timestamp}] ${logObject.level}: ${logObject.message.trim()}`;
};

const logger = winston.createLogger({
    level: 'info',
    format:  winston.format.combine(
        // Set to use colors
        winston.format.colorize({
            message: true,
            level: true,
        }),
        winston.format.timestamp({ format:'YY-MM-DD HH:mm:ss' }),
        winston.format.align(),
        // Specify custom print format for Winston logging
        winston.format.printf(logFormat),
    ),
    transports: [
        
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(logFormat)
            ),
        })
    ],
});

const outputFile: string | null =  process.env.LOG_OUTPUT_FILENAME ? process.env.LOG_OUTPUT_FILENAME : null;
if (outputFile) {
    logger.add(
        new winston.transports.File({ filename: outputFile })
    );
}

export default logger;