import nodemailer from "nodemailer";
import { CustomError } from "../custom-class/CustomError";
import { accountOpeningTemplate } from "../email-templates/account-opening";

export class EmailService {
	private transporter: nodemailer.Transporter;
	private readonly host: string;
	private readonly port: number;
	private readonly secure: boolean;
	private readonly user: string;
	private readonly pass: string;

	constructor() {
		this.host = process.env.MAIL_HOST as string;
		this.port = Number(process.env.MAIL_PORT);
		this.user = process.env.MAIL_USERNAME as string;
		this.pass = process.env.MAIL_PASSWORD as string;
		this.secure = Boolean(process.env.MAIL_SECURE === "true");

		// Validate required environment variables
		if (!this.host || !this.port || !this.user || !this.pass) {
			throw new CustomError(
				"Missing email configuration. Please check your environment variables.",
				500,
				"ConfigError"
			);
		}

		this.transporter = nodemailer.createTransport({
			host: this.host,
			port: this.port,
			secure: this.secure,
			auth: {
				user: this.user,
				pass: this.pass,
			},
			// Add timeout settings
			tl: {
				rejectUnauthorized: false, // For development only - remove in production
			},
			connectionTimeout: 5000, // 5 seconds
			greetingTimeout: 5000,
			socketTimeout: 5000,
		} as nodemailer.TransportOptions);
	}

	/**
	 * @description Verify SMTP connection
	 */
	private verifyConnection = async (): Promise<void> => {
		try {
			await this.transporter.verify();
		} catch (error: any) {
			throw new CustomError(
				`Failed to connect to email server: ${error.message}`,
				500,
				"EmailConnectionError"
			);
		}
	};

	/**
	 * @description Send email using nodemailer
	 * @param to string
	 * @param subject string
	 * @param html string
	 */
	sendEmail = async (
		to: string,
		subject: string,
		html: string
	): Promise<void> => {
		try {
			// Verify connection before sending
			await this.verifyConnection();

			await this.transporter.sendMail({
				from: `"SUST Research Center" <${this.user}>`,
				to,
				subject,
				html,
			});
		} catch (error: any) {
			// Log the error for debugging
			console.error("Email Error:", error);

			throw new CustomError(
				"Failed to send email. Please try again later.",
				500,
				"EmailError"
			);
		}
	};

	/**
	 * @description Send welcome email to new users
	 * @param email string
	 * @param name string
	 */
	sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
		const subject = "Account Opening | Welcome to SUST Research Center";
		const html = accountOpeningTemplate(name);

		await this.sendEmail(email, subject, html);
	};
}

// Export singleton instance
export const emailService = new EmailService();
