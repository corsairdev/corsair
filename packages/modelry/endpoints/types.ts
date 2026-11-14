import { z } from 'zod';

// Identifiers are a single path component, never a URL path or traversal.
export const identifier = z.union([
	z
		.string()
		.min(1)
		.refine((v) => !['.', '..'].includes(v) && !/[\\/"']/.test(v)),
	z.number().int().nonnegative(),
]);
const s = z.string().nullish();
const n = z.number().nullish();
const b = z.boolean().nullish();
const strings = z.array(z.string()).nullish();
const object = z.record(z.string(), z.unknown());
const attributes = z
	.object({
		uid: s,
		sku: s,
		title: s,
		name: s,
		createdAt: s,
		batchID: s,
		batchId: s,
		batchUid: s,
		deliveredAt: s,
		status: s,
		pipeline: s,
		price: s,
		previewImageUrl: s,
		dimensions: s,
		productUrl: s,
		productId: n,
		requestType: s,
		inCustomerQa: b,
		customerQaUrl: s,
		currentRoundNumber: n,
		currentRoundSaved: b,
		referenceFileUrls: strings,
		reviewCategories: z
			.array(z.object({ id: z.string(), title: z.string() }))
			.nullish(),
		description: s,
		tags: strings,
		sourceLabel: s,
		toolKinds: strings,
		contentLabels: strings,
		byteSize: z.union([z.number(), z.string()]).nullish(),
		labels: strings,
		url: s,
		fileName: s,
		kinds: strings,
		published: b,
		loaderScriptConfiguration: z.array(object).nullish(),
		adminIssueId: s,
		annotation: object.nullish(),
		authorId: s,
		authorRole: s,
		authorUsername: s,
		category: s,
		comment: s,
		data: object.nullish(),
		deletedAt: s,
		destroyed: b,
		displayAuthorUsername: b,
		displayIssueChanges: b,
		displaySeverity: b,
		disputeComment: s,
		disputeReason: s,
		disputeRejectionReason: s,
		disputeStatus: s,
		draft: b,
		editorUsername: s,
		isReviewed: b,
		issueLogs: strings,
		order: n,
		origin: s,
		reviewableAttachmentId: s,
		reviewed: b,
		severity: n,
		solved: b,
		state: s,
		updatedAt: s,
		x: s,
		y: s,
	})
	.passthrough();
const resource = z
	.object({
		id: z.string(),
		type: z.string(),
		attributes: attributes.optional(),
		relationships: object.optional(),
	})
	.passthrough();
const meta = z
	.object({ page: n, per_page: n, total_pages: n, total_records: n })
	.passthrough();
export const single = z
	.object({
		data: resource,
		included: z.array(resource).optional(),
		meta: meta.optional(),
	})
	.passthrough();
export const list = z
	.object({ data: z.array(resource), meta: meta.optional() })
	.passthrough();
export const empty = z.void();
const id = z.object({ id: identifier });
const productId = z.object({ product_id: identifier });
const pair = z.object({ product_id: identifier, id: identifier });
const requestId = z.object({ id_or_sku: identifier });
const requestAssetId = z.object({ modeling_request_id_or_sku: identifier });
const page = {
	page: z.number().int().positive().optional(),
	per_page: z.number().int().min(1).max(100).optional(),
};
const productFields = z.object({
	title: z.string().optional(),
	sku: z.string().optional(),
	description: z.string().nullish(),
	batch_id: z.string().nullish(),
	tags: z.array(z.string()).optional(),
	dimensions: z.string().nullish(),
	external_url: z.string().nullish(),
});
export const products_listInput = z.object({
	...page,
	sort_by: z.array(z.string()).optional(),
	keywords: z.string().optional(),
	sku: z.string().optional(),
	batch_id: z.string().optional(),
	title: z.string().optional(),
	tags: z.array(z.string()).optional(),
	source_label: z.array(z.string()).optional(),
	content_labels: z.array(z.string()).optional(),
	tool_kinds: z.array(z.string()).optional(),
});
export const products_getInput = id;
export const products_createInput = z.object({ product: productFields });
export const products_updateInput = id.extend({ product: productFields });
export const products_deleteInput = id;
export const modelingRequests_listInput = z.object({
	...page,
	workspace_id: z.number().int().optional(),
	sort_by: z.array(z.string()).optional(),
	keywords: z.string().optional(),
	sku: z.string().optional(),
	batch_uid: z.string().optional(),
	title: z.string().optional(),
	status: z
		.enum([
			'in_quoting',
			'in_progress',
			'ready_for_review',
			'adjustments_in_progress',
			'dispute_review',
			'preparing_for_delivery',
			'finished',
		])
		.optional(),
});
export const modelingRequests_getInput = requestId;
export const modelingRequests_approveInput = requestId;
export const modelingRequests_rejectInput = requestId;
export const modelingRequests_assetsInput = requestAssetId.extend(page);
export const modelingRequests_createInput = z.object({
	modeling_request: z.object({
		title: z.string(),
		sku: z.string(),
		product_id: z.number().optional(),
		dimensions: z.string().optional(),
		pipeline: z.enum(['high_poly', 'low_poly']),
		specific_requirements: z.string().optional(),
		external_url: z.string().optional(),
		reference_file_blob_ids: z.array(z.string()).optional(),
	}),
});
export const productAssets_createInput = productId.extend({
	blob_id: z.string().min(1),
	tags: z.array(z.string()).optional(),
});
export const productAssets_deleteInput = pair;
export const embeds_listInput = productId.extend(page);
export const embeds_getInput = pair;
export const embeds_deleteInput = pair;
export const embeds_publishInput = pair;
export const reviews_createInput = requestAssetId.extend({
	review_issues: z.array(
		z.object({
			filename: z.string(),
			category: z.string(),
			comment: z.string(),
			severity: z.union([z.number(), z.string()]).optional(),
			order: z.union([z.number(), z.string()]).optional(),
			data: object.optional(),
			annotation: object.optional(),
			reviewed: z.boolean().optional(),
			issue_image: z.string().optional(),
			x: z.string().optional(),
			y: z.string().optional(),
		}),
	),
});
export const uploads_blobInput = z.object({
	blob: z.object({
		filename: z.string(),
		byte_size: z.number().int().nonnegative(),
		checksum: z.string(),
		content_type: z.string(),
	}),
});
export const uploads_fileInput = z.object({
	filename: z.string(),
	base64_file: z.string(),
	content_type: z.string(),
});
export const workspaces_listInput = z.object(page);
export const blobOutput = z
	.object({
		signed_id: z.string(),
		service_url: z.string(),
		headers: z.record(z.string(), z.string()),
	})
	.passthrough();
export const uploadOutput = z
	.object({ blob_id: z.number(), signed_blob_id: z.string(), url: z.string() })
	.passthrough();
export const reviewOutput = z
	.object({ data: z.union([resource, z.array(resource)]) })
	.passthrough();

export const ModelryEndpointInputSchemas = {
	products_list: products_listInput,
	products_get: products_getInput,
	products_create: products_createInput,
	products_update: products_updateInput,
	products_delete: products_deleteInput,
	modelingRequests_list: modelingRequests_listInput,
	modelingRequests_get: modelingRequests_getInput,
	modelingRequests_create: modelingRequests_createInput,
	modelingRequests_approve: modelingRequests_approveInput,
	modelingRequests_reject: modelingRequests_rejectInput,
	modelingRequests_assets: modelingRequests_assetsInput,
	productAssets_create: productAssets_createInput,
	productAssets_delete: productAssets_deleteInput,
	embeds_list: embeds_listInput,
	embeds_get: embeds_getInput,
	embeds_publish: embeds_publishInput,
	embeds_delete: embeds_deleteInput,
	reviews_create: reviews_createInput,
	uploads_blob: uploads_blobInput,
	uploads_file: uploads_fileInput,
	workspaces_list: workspaces_listInput,
} as const;

export const ModelryEndpointOutputSchemas = {
	products_list: list,
	products_get: single,
	products_create: single,
	products_update: single,
	products_delete: empty,
	modelingRequests_list: list,
	modelingRequests_get: single,
	modelingRequests_create: single,
	modelingRequests_approve: single,
	modelingRequests_reject: single,
	modelingRequests_assets: list,
	productAssets_create: single,
	productAssets_delete: empty,
	embeds_list: list,
	embeds_get: single,
	embeds_publish: single,
	embeds_delete: empty,
	reviews_create: reviewOutput,
	uploads_blob: blobOutput,
	uploads_file: uploadOutput,
	workspaces_list: list,
} as const satisfies Record<
	keyof typeof ModelryEndpointInputSchemas,
	z.ZodType
>;
