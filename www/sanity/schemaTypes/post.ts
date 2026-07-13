import { defineArrayMember, defineField, defineType } from 'sanity';

export const postType = defineType({
	name: 'post',
	title: 'Blog post',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96,
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required().max(300),
		}),
		defineField({
			name: 'author',
			title: 'Author',
			type: 'string',
			initialValue: 'Corsair Team',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'body',
			title: 'Body',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'block',
					styles: [
						{ title: 'Normal', value: 'normal' },
						{ title: 'H2', value: 'h2' },
						{ title: 'H3', value: 'h3' },
						{ title: 'Quote', value: 'blockquote' },
					],
					lists: [
						{ title: 'Bullet', value: 'bullet' },
						{ title: 'Numbered', value: 'number' },
					],
					marks: {
						decorators: [
							{ title: 'Strong', value: 'strong' },
							{ title: 'Emphasis', value: 'em' },
							{ title: 'Code', value: 'code' },
						],
						annotations: [
							{
								name: 'link',
								type: 'object',
								title: 'Link',
								fields: [
									defineField({
										name: 'href',
										type: 'url',
										title: 'URL',
										validation: (rule) =>
											rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
									}),
								],
							},
						],
					},
				}),
				defineArrayMember({
					type: 'image',
					options: { hotspot: true },
					fields: [
						defineField({
							name: 'alt',
							type: 'string',
							title: 'Alt text',
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: 'caption',
							type: 'string',
							title: 'Caption',
						}),
					],
				}),
			],
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {
			title: 'title',
			author: 'author',
			publishedAt: 'publishedAt',
		},
		prepare({ title, author, publishedAt }) {
			const subtitle = [author, publishedAt?.slice(0, 10)].filter(Boolean).join(' · ');
			return { title, subtitle };
		},
	},
});
