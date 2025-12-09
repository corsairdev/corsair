import { tool } from "ai";
import { promises as fs } from "fs";
import path from "path";
import z from "zod";

export const readFile = (pwd: string) =>
	tool({
		description: "Read the current contents of the target TypeScript file.",
		inputSchema: z.object({}),
		execute: async () => {
			const targetPath = path.resolve(process.cwd(), pwd);

			try {
				const content = await fs.readFile(targetPath, "utf8");
				return { content };
			} catch (error: any) {
				if (
					error &&
					typeof error === "object" &&
					(error as any).code === "ENOENT"
				) {
					return { content: "" };
				}
				throw error;
			}
		},
	});
