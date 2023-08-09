import winston, {format} from "winston";

export const LOG = winston.createLogger({
    level: "info",
    transports: [new winston.transports.Console()],
    format: format.combine(
        format.timestamp({format: 'DD.MM.YYYY HH:mm:ss'}),
        format.align(),
        format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        //format.prettyPrint()
    ),
});