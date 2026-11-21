import { z } from 'zod';
import { defineMailerLiteOperation } from './operation';
import {
	MailerLiteEntityResponseSchema,
	MailerLiteIdSchema,
	MailerLiteListResponseSchema,
} from './types';

const Id = z.string().min(1);
const BlockType = z.enum([
	'blockquote',
	'bulleted_list',
	'button',
	'code',
	'divider',
	'heading',
	'image',
	'numbered_list',
	'paragraph',
	'social_icon',
	'video',
]);
const MarkType = z.enum([
	'bold',
	'italic',
	'underline',
	'strike',
	'code',
	'link',
	'textStyle',
	'subscript',
	'superscript',
]);
const Scalar = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export type EditorNode = {
	type: string;
	text?: string;
	attrs?: Record<string, string | number | boolean | null>;
	content?: EditorNode[];
	marks?: Array<{
		type: z.infer<typeof MarkType>;
		attrs?: Record<string, string | number | boolean | null>;
	}>;
};

const EditorNodeSchema: z.ZodType<EditorNode> = z.lazy(() =>
	z
		.object({
			type: z.enum([
				'text',
				'listItem',
				'nodeParagraph',
				'bulletList',
				'orderedList',
				'hardBreak',
			]),
			text: z.string().optional(),
			attrs: z.record(z.string(), Scalar).optional(),
			content: z.array(EditorNodeSchema).optional(),
			marks: z
				.array(
					z
						.object({
							type: MarkType,
							attrs: z.record(z.string(), Scalar).optional(),
						})
						.strict(),
				)
				.optional(),
		})
		.strict(),
);

const EditorContent = z
	.object({
		attrs: z.record(z.string(), Scalar).optional(),
		content: z.array(EditorNodeSchema).optional(),
	})
	.strict();

const Placement = z
	.object({
		position: z.enum(['start', 'end', 'before', 'after']),
		block_id: MailerLiteIdSchema.optional(),
	})
	.strict()
	.superRefine((value, ctx) => {
		if (
			(value.position === 'before' || value.position === 'after') &&
			value.block_id === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['block_id'],
				message: 'block_id is required for before/after placement.',
			});
		}
	});

const IdempotencyKey = z
	.string()
	.min(1)
	.max(255)
	.regex(/^[\x20-\x7E]+$/)
	.optional();
const CommonMutation = z.object({
	emailId: Id,
	idempotencyKey: IdempotencyKey,
});

const EmailFontStyle = z
	.object({
		font_family: z.string().optional(),
		font_weight: z.enum(['300', '400', '500', '600', '700']).optional(),
		line_height: z.enum(['100%', '137%', '150%', '165%', '200%']).optional(),
		letter_spacing: z
			.enum(['-0.05', '-0.025', '0', '0.025', '0.05'])
			.optional(),
		color: z.string().optional(),
		size: z.string().optional(),
	})
	.strict();
const DesignSettings = z
	.object({
		brand: z
			.object({
				mode: z.enum(['account', 'template', 'custom']).optional(),
				style: z.string().optional(),
				font_family: z.string().optional(),
				background_color: z.string().optional(),
				text_color: z.string().optional(),
				border_color: z.string().optional(),
			})
			.strict()
			.optional(),
		layout: z
			.object({
				width_mode: z.enum(['default', 'full']).optional(),
				alignment: z.enum(['left', 'center']).optional(),
			})
			.strict()
			.optional(),
		typography: z
			.object({
				link: z.object({ color: z.string().optional() }).strict().optional(),
				heading: EmailFontStyle.extend({
					h1: EmailFontStyle.optional(),
					h2: EmailFontStyle.optional(),
					h3: EmailFontStyle.optional(),
				})
					.strict()
					.optional(),
				paragraph: EmailFontStyle.extend({ p1: EmailFontStyle.optional() })
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		button: z
			.object({
				font_family: z.string().optional(),
				font_weight: z.enum(['300', '400', '500', '600', '700']).optional(),
				letter_spacing: z
					.enum(['-0.05', '-0.025', '0', '0.025', '0.05'])
					.optional(),
				background_color: z.string().optional(),
				text_color: z.string().optional(),
				border_radius: z.string().optional(),
			})
			.strict()
			.optional(),
		footer: z
			.object({
				show_preferences: z.boolean().optional(),
				unsubscribe_text: z.string().optional(),
				preferences_text: z.string().optional(),
				company_name: z
					.object({ editor_content: EditorContent })
					.strict()
					.optional(),
				address: z
					.object({ editor_content: EditorContent })
					.strict()
					.optional(),
				info_text: z
					.object({ editor_content: EditorContent })
					.strict()
					.optional(),
				social_links: z
					.array(
						z
							.object({
								url: z.string(),
								type: z.string(),
								label: z.string(),
								link_id: z.number().int().optional(),
							})
							.strict(),
					)
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const ValidationResult = z
	.object({
		valid: z.boolean(),
		errors: z.record(z.string(), z.array(z.string())),
		schema: z.object({ version: z.string(), hash: z.string() }).strict(),
		rejected: z
			.object({ message: z.string(), keys: z.array(z.string()) })
			.strict()
			.optional(),
	})
	.strict();

export const Emails = {
	get: defineMailerLiteOperation({
		operation: 'emails.get',
		input: z.object({ emailId: Id }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/emails/${encodeURIComponent(input.emailId)}`,
		}),
	}),
	html: defineMailerLiteOperation({
		operation: 'emails.html',
		input: z.object({ emailId: Id }).strict(),
		output: z
			.object({
				data: z.object({ html: z.string() }).strict(),
				etag: z.string(),
			})
			.strict(),
		request: (input) => ({
			method: 'GET',
			url: `/emails/${encodeURIComponent(input.emailId)}/html`,
		}),
	}),
	getBlock: defineMailerLiteOperation({
		operation: 'emails.getBlock',
		input: z.object({ emailId: Id, blockId: Id }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/emails/${encodeURIComponent(input.emailId)}/blocks/${encodeURIComponent(input.blockId)}`,
		}),
	}),
	insertBlock: defineMailerLiteOperation({
		operation: 'emails.insertBlock',
		input: CommonMutation.extend({
			body: z
				.object({
					type: BlockType,
					editor_content: EditorContent,
					etag: z.string(),
					placement: Placement.optional(),
				})
				.strict(),
		}).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/emails/${encodeURIComponent(input.emailId)}/blocks`,
			body: input.body,
			headers:
				input.idempotencyKey === undefined
					? undefined
					: { 'Idempotency-Key': input.idempotencyKey },
		}),
	}),
	validateBlock: defineMailerLiteOperation({
		operation: 'emails.validateBlock',
		input: z
			.object({
				body: z
					.object({
						type: BlockType,
						editor_content: EditorContent,
						placement: Placement.optional(),
					})
					.strict(),
			})
			.strict(),
		output: ValidationResult,
		request: (input) => ({
			method: 'POST',
			url: '/emails/blocks/validate',
			body: input.body,
		}),
	}),
	updateBlock: defineMailerLiteOperation({
		operation: 'emails.updateBlock',
		input: CommonMutation.extend({
			blockId: Id,
			body: z
				.object({ editor_content: EditorContent, etag: z.string() })
				.strict(),
		}).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'PATCH',
			url: `/emails/${encodeURIComponent(input.emailId)}/blocks/${encodeURIComponent(input.blockId)}`,
			body: input.body,
			headers:
				input.idempotencyKey === undefined
					? undefined
					: { 'Idempotency-Key': input.idempotencyKey },
		}),
	}),
	moveBlock: defineMailerLiteOperation({
		operation: 'emails.moveBlock',
		input: CommonMutation.extend({
			blockId: Id,
			body: z.object({ etag: z.string(), placement: Placement }).strict(),
		}).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/emails/${encodeURIComponent(input.emailId)}/blocks/${encodeURIComponent(input.blockId)}/move`,
			body: input.body,
			headers:
				input.idempotencyKey === undefined
					? undefined
					: { 'Idempotency-Key': input.idempotencyKey },
		}),
	}),
	deleteBlock: defineMailerLiteOperation({
		operation: 'emails.deleteBlock',
		input: CommonMutation.extend({
			blockId: Id,
			body: z.object({ etag: z.string() }).strict(),
		}).strict(),
		output: z.object({ etag: z.string() }).strict(),
		request: (input) => ({
			method: 'DELETE',
			url: `/emails/${encodeURIComponent(input.emailId)}/blocks/${encodeURIComponent(input.blockId)}`,
			body: input.body,
			headers:
				input.idempotencyKey === undefined
					? undefined
					: { 'Idempotency-Key': input.idempotencyKey },
		}),
	}),
	updateSettings: defineMailerLiteOperation({
		operation: 'emails.updateSettings',
		input: CommonMutation.extend({
			body: DesignSettings.extend({ etag: z.string() }).strict(),
		}).strict(),
		output: z
			.object({
				data: DesignSettings,
				etag: z.string(),
				rejected: z
					.object({ message: z.string(), keys: z.array(z.string()) })
					.strict()
					.optional(),
			})
			.strict(),
		request: (input) => ({
			method: 'PATCH',
			url: `/emails/${encodeURIComponent(input.emailId)}/settings`,
			body: input.body,
			headers:
				input.idempotencyKey === undefined
					? undefined
					: { 'Idempotency-Key': input.idempotencyKey },
		}),
	}),
	validateSettings: defineMailerLiteOperation({
		operation: 'emails.validateSettings',
		input: z.object({ emailId: Id, body: DesignSettings }).strict(),
		output: ValidationResult,
		request: (input) => ({
			method: 'POST',
			url: `/emails/${encodeURIComponent(input.emailId)}/settings/validate`,
			body: input.body,
		}),
	}),
	saveTemplate: defineMailerLiteOperation({
		operation: 'emails.saveTemplate',
		input: CommonMutation.extend({
			body: z.object({ name: z.string().min(1).max(255) }).strict(),
		}).strict(),
		output: z
			.object({
				data: z
					.object({
						id: MailerLiteIdSchema,
						name: z.string(),
						type: z.string(),
						created_at: z.string(),
					})
					.passthrough(),
			})
			.strict(),
		request: (input) => ({
			method: 'POST',
			url: `/emails/${encodeURIComponent(input.emailId)}/templates`,
			body: input.body,
			headers:
				input.idempotencyKey === undefined
					? undefined
					: { 'Idempotency-Key': input.idempotencyKey },
		}),
	}),
	versions: defineMailerLiteOperation({
		operation: 'emails.versions',
		input: z
			.object({
				emailId: Id,
				query: z
					.object({
						limit: z.number().int().positive().max(100).optional(),
						page: z.number().int().positive().optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		output: MailerLiteListResponseSchema,
		request: (input) => ({
			method: 'GET',
			url: `/emails/${encodeURIComponent(input.emailId)}/versions`,
			query: input.query,
		}),
	}),
	saveVersion: defineMailerLiteOperation({
		operation: 'emails.saveVersion',
		input: CommonMutation,
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/emails/${encodeURIComponent(input.emailId)}/versions`,
			headers:
				input.idempotencyKey === undefined
					? undefined
					: { 'Idempotency-Key': input.idempotencyKey },
		}),
	}),
	restoreVersion: defineMailerLiteOperation({
		operation: 'emails.restoreVersion',
		input: CommonMutation.extend({ versionId: Id }).strict(),
		output: MailerLiteEntityResponseSchema,
		request: (input) => ({
			method: 'POST',
			url: `/emails/${encodeURIComponent(input.emailId)}/versions/${encodeURIComponent(input.versionId)}/restore`,
			headers:
				input.idempotencyKey === undefined
					? undefined
					: { 'Idempotency-Key': input.idempotencyKey },
		}),
	}),
};
