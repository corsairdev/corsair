import { promises as fs } from "fs";

export function toKebabCase(str: string): string {
	return str
		.trim()
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, "");
}

export function kebabToCamelCase(str: string): string {
	return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function camelCaseToWords(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
}

export async function sortIndexFile(indexPath: string) {
	try {
		const content = await fs.readFile(indexPath, "utf8");
		const lines = content.split("\n").filter((line) => line.trim());
		const sortedLines = lines.sort((a, b) => a.localeCompare(b));
		await fs.writeFile(indexPath, sortedLines.join("\n") + "\n");
	} catch (error: any) {
		if (error?.code !== "ENOENT") {
			throw error;
		}
	}
}

export class Spinner {
	private frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
	private interval: NodeJS.Timeout | null = null;
	private currentFrame = 0;
	private text = "";

	start(text: string) {
		this.text = text;
		this.currentFrame = 0;

		process.stdout.write("\x1B[?25l");

		this.interval = setInterval(() => {
			const frame = this.frames[this.currentFrame];
			process.stdout.write(`\r${frame} ${this.text}`);
			this.currentFrame = (this.currentFrame + 1) % this.frames.length;
		}, 80);
	}

	succeed(text: string) {
		this.stop();
		console.log(`\r✅ ${text}`);
	}

	fail(text: string) {
		this.stop();
		console.log(`\r❌ ${text}`);
	}

	stop() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
		process.stdout.write("\r\x1B[K");
		process.stdout.write("\x1B[?25h");
	}
}
