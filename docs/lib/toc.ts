import fs from 'fs';
import path from 'path';

export interface TOCItem {
	title: string;
	url: string;
	depth: number;
}

const slugToFilePath: Record<string, string> = {
	// getting-started
	index: 'getting-started/introduction.mdx',
	comparison: 'getting-started/comparison.mdx',
	// concepts
	api: 'concepts/api.mdx',
	auth: 'concepts/auth.mdx',
	database: 'concepts/database.mdx',
	'error-handling': 'concepts/error-handling.mdx',
	hooks: 'concepts/hooks.mdx',
	integrations: 'concepts/integrations.mdx',
	'multi-tenancy': 'concepts/multi-tenancy.mdx',
	typescript: 'concepts/typescript.mdx',
	webhooks: 'concepts/webhooks.mdx',
	// plugins
	'plugins/slack': 'plugins/slack/main.mdx',
	'plugins/slack/api-endpoints': 'plugins/slack/api-endpoints.mdx',
	'plugins/slack/webhooks': 'plugins/slack/webhooks.mdx',
	'plugins/slack/database': 'plugins/slack/database.mdx',
	'plugins/slack/error-handlers': 'plugins/slack/error-handlers.mdx',
	'plugins/linear': 'plugins/linear/main.mdx',
	'plugins/linear/api-endpoints': 'plugins/linear/api-endpoints.mdx',
	'plugins/linear/webhooks': 'plugins/linear/webhooks.mdx',
	'plugins/linear/database': 'plugins/linear/database.mdx',
	'plugins/linear/error-handlers': 'plugins/linear/error-handlers.mdx',
	// guides
	'guides/create-your-own-plugin': 'guides/create-your-own-plugin.mdx',
};

export function extractTOC(mdxPath: string): TOCItem[] {
	const filePath = slugToFilePath[mdxPath];
	if (!filePath) {
		return [];
	}

	const fullPath = path.join(process.cwd(), 'content', filePath);
	const content = fs.readFileSync(fullPath, 'utf-8');

	const lines = content.split('\n');
	const toc: TOCItem[] = [];

	let inFrontmatter = false;
	let inCodeBlock = false;

	for (const line of lines) {
		if (line.trim() === '---') {
			inFrontmatter = !inFrontmatter;
			continue;
		}

		if (inFrontmatter) continue;

		if (line.trim().startsWith('```')) {
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
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '')}`;

			toc.push({
				title,
				url,
				depth,
			});
		}
	}

	return toc;
}
