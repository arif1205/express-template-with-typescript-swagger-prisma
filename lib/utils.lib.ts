import fs from "fs";
class UtilsLib {
	jsonToObj = (json: any) => {
		return JSON.parse(JSON.stringify(json));
	};

	saveBase64AsFile = (base64Data: string, filePath: string): string => {
		const base64WithoutHeader = base64Data.replace(
			/^data:[a-zA-Z0-9\/]+;base64,/,
			""
		);
		const buffer = Buffer.from(base64WithoutHeader, "base64");

		try {
			fs.writeFileSync(filePath, buffer);
			return filePath;
		} catch (err) {
			console.error(err);
			return "";
		}
	};

	generateRandomNumber = (min: number, max: number): number => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
}

export const utilsLib = new UtilsLib();
