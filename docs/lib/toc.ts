import fs from "fs";
import path from "path";

export interface TOCItem {
	title: string;
	url: string;
	depth: number;
}

const slugToFilePath: Record<string, string> = {
	index: "0-getting-started/0-introduction.mdx",
	installation: "0-getting-started/1-installation.mdx",
	"basic-usage": "0-getting-started/2-basic-usage.mdx",
	api: "1-concepts/0-api.mdx",
	client: "1-concepts/1-client.mdx",
	cli: "1-concepts/2-cli.mdx",
	plugins: "1-concepts/3-plugins.mdx",
	database: "1-concepts/4-database.mdx",
	typescript: "1-concepts/5-typescript.mdx",
	"integrations/next": "2-integrations/0-next.mdx",
	"integrations/vite": "2-integrations/1-vite.mdx",
	"integrations/hono": "2-integrations/2-hono.mdx",
	"integrations/prisma": "2-integrations/3-prisma.mdx",
	"integrations/drizzle": "2-integrations/4-drizzle.mdx",
	"plugins/slack": "3-plugins/slack.mdx",
};

export function extractTOC(mdxPath: string): TOCItem[] {
	const filePath = slugToFilePath[mdxPath];
	if (!filePath) {
		return [];
	}

	const fullPath = path.join(process.cwd(), "content", filePath);
	const content = fs.readFileSync(fullPath, "utf-8");

	const lines = content.split("\n");
	const toc: TOCItem[] = [];

	let inFrontmatter = false;
	let inCodeBlock = false;

	for (const line of lines) {
		if (line.trim() === "---") {
			inFrontmatter = !inFrontmatter;
			continue;
		}

		if (inFrontmatter) continue;

		if (line.trim().startsWith("```")) {
			inCodeBlock = !inCodeBlock;
			continue;
		}

		if (inCodeBlock) continue;

		const match = line.match(/^(#{2,6})\s+(.+)$/);
		if (match) {
			const depth = match[1].length;
			const title = match[2].trim();
			const url = `#${title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "")}`;

			toc.push({
				title,
				url,
				depth,
			});
		}
	}

	return toc;
}
