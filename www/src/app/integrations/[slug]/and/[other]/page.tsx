import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { ComboPage } from '@/components/integrations/combo/combo-page';
import {
	COMBO_INDEX,
	getComboCanonical,
	getComboData,
} from '@/lib/combined-integrations';

type PageProps = {
	params: Promise<{ slug: string; other: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
	const params: { slug: string; other: string }[] = [];
	for (const key of Object.keys(COMBO_INDEX)) {
		const [slug, other] = key.split('/and/');
		if (!slug || !other) continue;
		params.push({ slug, other }, { slug: other, other: slug });
	}
	return params;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug, other } = await params;
	const combo = getComboData(slug, other);

	if (!combo) {
		return { title: 'Integration not found' };
	}

	const canonical = getComboCanonical(slug, other);
	const title = combo.title;
	const description = `File Linear issues from Slack threads and sync status back. Typed API, webhooks, agents, and MCP on one ${combo.displayA} + ${combo.displayB} connection.`;

	return {
		title,
		description,
		alternates: {
			canonical,
		},
		openGraph: {
			title: `${title} | Corsair`,
			description,
			url: `https://corsair.dev${canonical}`,
		},
		twitter: {
			title: `${title} | Corsair`,
			description,
		},
	};
}

export default async function ComboRoute({ params }: PageProps) {
	const { slug, other } = await params;
	const combo = getComboData(slug, other);

	if (!combo) {
		notFound();
	}

	const canonical = getComboCanonical(slug, other);
	if (
		canonical !==
		`/integrations/${slug.toLowerCase().trim()}/and/${other.toLowerCase().trim()}`
	) {
		redirect(canonical);
	}

	return <ComboPage combo={combo} />;
}
