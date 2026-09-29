import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { ComboPage } from '@/components/integrations/combo/combo-page';
import {
	getCatalogComboRouteKeys,
	getComboCanonical,
	getComboData,
} from '@/lib/combined-integrations';

type PageProps = {
	params: Promise<{ slug: string; other: string }>;
};

/** Pre-render known pairs at build; allow runtime lookup when the DB gains combos (local dev). */
export async function generateStaticParams() {
	const keys = await getCatalogComboRouteKeys();
	const params: { slug: string; other: string }[] = [];
	for (const { slugA, slugB } of keys) {
		params.push({ slug: slugA, other: slugB }, { slug: slugB, other: slugA });
	}
	return params;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug, other } = await params;
	const combo = await getComboData(slug, other);

	if (!combo) {
		return { title: 'Integration not found' };
	}

	const canonical = getComboCanonical(combo);
	const title = combo.title;
	const description = combo.description;

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
	const combo = await getComboData(slug, other);

	if (!combo) {
		notFound();
	}

	const canonical = getComboCanonical(combo);
	if (
		canonical !==
		`/integrations/${slug.toLowerCase().trim()}/and/${other.toLowerCase().trim()}`
	) {
		redirect(canonical);
	}

	return <ComboPage combo={combo} />;
}
