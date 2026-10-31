import type { UseCase } from '@/lib/use-cases';

const SITE_URL = 'https://corsair.dev';

function plainText(value: string) {
	return value.replace(/`/g, '');
}

export function useCaseUrl(slug: string) {
	return `${SITE_URL}/use-cases/${slug}`;
}

export function buildUseCaseJsonLd(
	useCase: Pick<UseCase, 'slug' | 'name' | 'faqs'>,
) {
	const graph: Record<string, unknown>[] = [
		{
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Use cases',
					item: `${SITE_URL}/use-cases`,
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: useCase.name,
					item: useCaseUrl(useCase.slug),
				},
			],
		},
	];

	if (useCase.faqs.length > 0) {
		graph.push({
			'@type': 'FAQPage',
			mainEntity: useCase.faqs.map((faq) => ({
				'@type': 'Question',
				name: plainText(faq.question),
				acceptedAnswer: { '@type': 'Answer', text: plainText(faq.answer) },
			})),
		});
	}

	return { '@context': 'https://schema.org', '@graph': graph };
}

export function buildUseCaseHubJsonLd(
	useCases: Pick<UseCase, 'slug' | 'name'>[],
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Corsair use cases',
		itemListElement: useCases.map((useCase, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: useCase.name,
			url: useCaseUrl(useCase.slug),
		})),
	};
}
