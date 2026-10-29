import type { Metadata } from 'next';

const SHARE_IMAGE = {
	url: '/og-image.png',
	width: 1200,
	height: 630,
	alt: 'Corsair — Open Source Integration Layer for AI Agents',
};

/**
 * Open Graph and Twitter metadata for one page. A page that sets neither
 * inherits the root layout's, so shared links show the homepage title and URL.
 * Next replaces those objects wholesale, so this repeats the shared fields
 * (site name, image, locale, type) from the layout. `path` resolves against
 * the layout's metadataBase.
 */
export function socialMetadata({
	title,
	description,
	path,
}: {
	title: string;
	description: string;
	path: string;
}) {
	return {
		openGraph: {
			title,
			description,
			url: path,
			siteName: 'Corsair',
			images: [SHARE_IMAGE],
			locale: 'en_US',
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [SHARE_IMAGE.url],
		},
	} satisfies Pick<Metadata, 'openGraph' | 'twitter'>;
}
