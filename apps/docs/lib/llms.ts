import { llms } from 'fumadocs-core/source/llms';
import { pageMarkdown } from './markdown';
import { source } from './source';

/** Renders any page as Markdown: the docs MCP server's list_pages and get_page. */
export const docsLlms = llms(source, {
	renderPage: async (page) => {
		if (!page.absolutePath) return `# ${page.data.title}`;
		return pageMarkdown(
			{
				title: page.data.title,
				description: page.data.description,
				file: page.absolutePath,
			},
			{ header: false },
		);
	},
});
