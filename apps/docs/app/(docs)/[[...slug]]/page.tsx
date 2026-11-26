import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from 'fumadocs-ui/layouts/notebook/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsShell } from '@/components/docs-shell';
import { getMDXComponents } from '@/components/mdx';
import { compileApiPage } from '@/lib/api-pages';
import { getPrerenderedDocParams } from '@/lib/rendering';
import { source } from '@/lib/source';

/** Frontmatter descriptions use `code` spans; render them as code, not backticks. */
function inlineCode(text: string | undefined) {
	if (!text) return text;
	return text
		.split(/(`[^`]+`)/)
		.map((part, i) =>
			part.startsWith('`') && part.endsWith('`') ? (
				<code key={i}>{part.slice(1, -1)}</code>
			) : (
				part
			),
		);
}

interface PageProps {
	params: Promise<{ slug?: string[] }>;
}

// One hour. Literal, not a constant: Next statically analyses this export.
export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
	if (process.env.NODE_ENV === 'development') return [];
	return getPrerenderedDocParams();
}

export default async function Page(props: PageProps) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const components = getMDXComponents({ a: createRelativeLink(source, page) });
	// The generated API pages have no compiled chunk: see lib/api-pages.ts.
	const { body: MDX, toc } =
		'load' in page.data
			? await page.data.load()
			: await compileApiPage(page.absolutePath as string, components);

	return (
		<DocsShell url={page.url}>
			<DocsPage
				toc={toc}
				full={'full' in page.data ? page.data.full : undefined}
				breadcrumb={{ enabled: false }}
				tableOfContent={{ style: 'clerk' }}
				tableOfContentPopover={{ style: 'block' }}
			>
				<DocsTitle>{page.data.title}</DocsTitle>
				<DocsDescription>{inlineCode(page.data.description)}</DocsDescription>
				<DocsBody>
					<MDX
						components={getMDXComponents({
							a: createRelativeLink(source, page),
						})}
					/>
				</DocsBody>
			</DocsPage>
		</DocsShell>
	);
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return {
		title: page.data.title,
		description: page.data.description,
		alternates: {
			canonical: page.url,
			types: { 'text/markdown': `${page.url}.md` },
		},
	};
}
