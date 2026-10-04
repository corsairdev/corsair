import type { OpenAPIPageProps } from 'fumadocs-openapi/ui';
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { OpenAPIPage } from '@/components/openapi-page';
import { openapi } from '@/lib/openapi';
import {
	DOCS_REVALIDATE_SECONDS,
	getPrerenderedDocParams,
} from '@/lib/rendering';
import { source } from '@/lib/source';

interface PageProps {
	params: Promise<{ slug?: string[] }>;
}

export const revalidate = DOCS_REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
	if (process.env.NODE_ENV === 'development') return [];
	return getPrerenderedDocParams();
}

export default async function Page(props: PageProps) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const { body: MDX, toc } = await page.data.load();

	const openApiPreload =
		page.data._openapi != null ? await openapi.preloadOpenAPIPage(page) : null;

	const mdxComponents = getMDXComponents({
		a: createRelativeLink(source, page),
		...(openApiPreload != null
			? {
					OpenAPIPage: (mdxProps: OpenAPIPageProps) => (
						<OpenAPIPage {...mdxProps} {...openApiPreload} />
					),
				}
			: {}),
	});

	return (
		<DocsPage
			toc={toc}
			full={page.data.full}
			breadcrumb={{ enabled: false }}
			tableOfContent={{ style: 'block' }}
			tableOfContentPopover={{ style: 'block' }}
		>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDX components={mdxComponents} />
			</DocsBody>
		</DocsPage>
	);
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return {
		title: page.data.title,
		description: page.data.description,
	};
}
