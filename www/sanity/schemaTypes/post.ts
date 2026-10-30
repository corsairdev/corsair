import { defineArrayMember, defineField, defineType } from 'sanity';

export const postType = defineType({
	name: 'post',
	title: 'Blog post',
	type: 'document',
	groups: [
		{ name: 'content', title: 'Content', default: true },
		{ name: 'seo', title: 'SEO & metadata' },
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			group: 'content',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			group: 'content',
			description: 'URL becomes /blog/<slug>',
			options: {
				source: 'title',
				maxLength: 96,
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Excerpt',
			type: 'text',
			rows: 3,
			group: 'content',
			description:
				'Shown on the blog index and used as the meta description fallback.',
			validation: (rule) => rule.required().max(300),
		}),
		defineField({
			name: 'author',
			title: 'Author',
			type: 'string',
			group: 'content',
			initialValue: 'Corsair Team',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime',
			group: 'content',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'coverImage',
			title: 'Cover image',
			type: 'image',
			group: 'content',
			options: { hotspot: true },
			fields: [
				defineField({
					name: 'alt',
					type: 'string',
					title: 'Alt text',
				}),
			],
		}),
		defineField({
			name: 'body',
			title: 'Body',
			type: 'array',
			group: 'content',
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
											rule.uri({
												allowRelative: true,
												scheme: ['http', 'https', 'mailto'],
											}),
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
				defineArrayMember({
					type: 'object',
					name: 'codeBlock',
					title: 'Code block',
					fields: [
						defineField({
							name: 'filename',
							title: 'File name',
							type: 'string',
							description:
								'Optional. Shown above the code, e.g. ~/.codex/config.toml.',
						}),
						defineField({
							name: 'language',
							title: 'Language',
							type: 'string',
							options: {
								list: [
									'bash',
									'toml',
									'json',
									'yaml',
									'typescript',
									'javascript',
									'python',
									'text',
								],
							},
							initialValue: 'bash',
						}),
						defineField({
							name: 'code',
							title: 'Code',
							type: 'text',
							rows: 8,
							validation: (rule) => rule.required(),
						}),
					],
					preview: {
						select: { title: 'filename', subtitle: 'language' },
						prepare: ({ title, subtitle }) => ({
							title: title || 'Code block',
							subtitle,
						}),
					},
				}),
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'faqs',
			title: 'FAQs',
			type: 'array',
			group: 'content',
			description:
				'Optional. If filled in, these can power an FAQ section on the page and an FAQPage JSON-LD block.',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'faqItem',
					fields: [
						defineField({
							name: 'question',
							title: 'Question',
							type: 'string',
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: 'answer',
							title: 'Answer',
							type: 'text',
							rows: 3,
							validation: (rule) => rule.required(),
						}),
					],
					preview: {
						select: { title: 'question', subtitle: 'answer' },
					},
				}),
			],
		}),

		// --- SEO & metadata group ---
		defineField({
			name: 'metaTitle',
			title: 'Meta title',
			type: 'string',
			group: 'seo',
			description: 'Browser tab + search result title. ~60 chars.',
		}),
		defineField({
			name: 'metaDescription',
			title: 'Meta description',
			type: 'text',
			rows: 3,
			group: 'seo',
			description: 'Search result snippet. ~155 chars.',
		}),
		defineField({
			name: 'targetKeywords',
			title: 'Target keywords',
			type: 'array',
			group: 'seo',
			of: [{ type: 'string' }],
			options: { layout: 'tags' },
		}),
		defineField({
			name: 'socialShareImage',
			title: 'Social share image',
			type: 'image',
			group: 'seo',
			options: { hotspot: true },
		}),
		defineField({
			name: 'jsonLd',
			title: 'JSON-LD structured data',
			type: 'text',
			rows: 8,
			group: 'seo',
			description:
				'Not injected as-is: the page builds Article, breadcrumb and FAQ JSON-LD from the fields above. If the FAQs field is empty, an FAQPage here supplies the FAQ instead. FAQ questions are only marked up when they also appear in the body.',
		}),
	],
	preview: {
		select: {
			title: 'title',
			author: 'author',
			publishedAt: 'publishedAt',
			media: 'coverImage',
		},
		prepare({ title, author, publishedAt, media }) {
			const subtitle = [author, publishedAt?.slice(0, 10)]
				.filter(Boolean)
				.join(' · ');
			return { title, subtitle, media };
		},
	},
});
