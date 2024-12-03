import Logger from "../config/logger.conf";

export const logger = {
	error: (message: string, meta?: any) => {
		Logger.error(message, meta);
	},
	warn: (message: string, meta?: any) => {
		Logger.warn(message, meta);
	},
	info: (message: string, meta?: any) => {
		Logger.info(message, meta);
	},
	http: (message: string, meta?: any) => {
		Logger.http(message, meta);
	},
	debug: (message: string, meta?: any) => {
		Logger.debug(message, meta);
	},
};
