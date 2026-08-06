import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (structureBuilder) =>
	structureBuilder
		.list()
		.title('Content')
		.items([
			structureBuilder
				.listItem()
				.title('Blog posts')
				.child(
					structureBuilder
						.documentTypeList('post')
						.title('Blog posts')
						.defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
				),
		]);
