import { createHash } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import type { CloudinaryContext } from './plugin-types';
import {
	DeleteWebhooks,
	EagerWebhooks,
	FolderWebhooks,
	OtherWebhooks,
	RenameWebhooks,
	ResourceWebhooks,
	UploadWebhooks,
} from './webhooks/notifications';
import { verifyCloudinaryWebhookSignature } from './webhooks/types';

const WEBHOOK_SECRET = 'webhook-secret';

function signCloudinaryWebhook(
	rawBody: string,
	timestamp: string,
	secret: string,
): string {
	return createHash('sha256')
		.update(rawBody + timestamp + secret)
		.digest('hex');
}

function makeWebhookRequest(
	payload: Record<string, unknown>,
	options?: {
		rawBody?: string;
		signature?: string;
		timestamp?: string;
	},
): WebhookRequest<Record<string, unknown>> {
	const rawBody = options?.rawBody ?? JSON.stringify(payload);
	const timestamp = options?.timestamp ?? String(Math.floor(Date.now() / 1000));
	const signature =
		options?.signature ??
		signCloudinaryWebhook(rawBody, timestamp, WEBHOOK_SECRET);

	return {
		payload,
		rawBody,
		headers: {
			'x-cld-signature': signature,
			'x-cld-timestamp': timestamp,
		},
	} as WebhookRequest<Record<string, unknown>>;
}

function makeCtx(): CloudinaryContext {
	return {
		key: WEBHOOK_SECRET,
		db: {
			resources: {
				upsertByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
			folders: {
				upsertByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
		},
	} as unknown as CloudinaryContext;
}

describe('cloudinary webhook handlers', () => {
	it('verifyCloudinaryWebhookSignature rejects missing raw body', () => {
		const result = verifyCloudinaryWebhookSignature(
			{
				payload: { notification_type: 'upload', public_id: 'sample' },
				headers: {
					'x-cld-signature': 'abc',
					'x-cld-timestamp': '1700000000',
				},
			} as WebhookRequest<Record<string, unknown>>,
			'secret',
		);

		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/raw webhook body/i);
	});

	it('upload webhook rejects invalid signatures', async () => {
		const result = await UploadWebhooks.upload.handler(
			makeCtx(),
			makeWebhookRequest(
				{
					notification_type: 'upload',
					public_id: 'sample',
				},
				{ signature: 'invalid' },
			) as never,
		);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.statusCode).toBe(401);
		}
	});

	it('upload webhook accepts valid signatures and syncs resources', async () => {
		const ctx = makeCtx();
		const payload = {
			notification_type: 'upload',
			public_id: 'sample',
			asset_id: 'asset-123',
		};

		const result = await UploadWebhooks.upload.handler(
			ctx,
			makeWebhookRequest(payload) as never,
		);

		expect(result.success).toBe(true);
		expect(ctx.db.resources?.upsertByEntityId).toHaveBeenCalledWith(
			'asset-123',
			expect.objectContaining({
				asset_id: 'asset-123',
				public_id: 'sample',
			}),
		);
	});

	it('delete webhook removes cached resources', async () => {
		const ctx = makeCtx();
		const payload = {
			notification_type: 'delete',
			public_id: 'sample',
			asset_id: 'asset-123',
		};

		const result = await DeleteWebhooks.delete.handler(
			ctx,
			makeWebhookRequest(payload) as never,
		);

		expect(result.success).toBe(true);
		expect(ctx.db.resources?.deleteByEntityId).toHaveBeenCalledWith(
			'asset-123',
		);
	});

	it('rename webhook upserts cached resources', async () => {
		const ctx = makeCtx();
		const payload = {
			notification_type: 'rename',
			from_public_id: 'old-id',
			to_public_id: 'new-id',
			asset_id: 'asset-123',
		};

		const result = await RenameWebhooks.rename.handler(
			ctx,
			makeWebhookRequest(payload) as never,
		);

		expect(result.success).toBe(true);
		expect(ctx.db.resources?.upsertByEntityId).toHaveBeenCalledWith(
			'asset-123',
			expect.objectContaining({
				asset_id: 'asset-123',
				public_id: 'new-id',
				from_public_id: 'old-id',
				to_public_id: 'new-id',
			}),
		);
	});

	it('resource tag changes upsert cached resources', async () => {
		const ctx = makeCtx();
		const payload = {
			notification_type: 'resource_tags_changed',
			public_id: 'sample',
			asset_id: 'asset-123',
			tags: ['corsair'],
		};

		const result = await ResourceWebhooks.resourceTagsChanged.handler(
			ctx,
			makeWebhookRequest(payload) as never,
		);

		expect(result.success).toBe(true);
		expect(ctx.db.resources?.upsertByEntityId).toHaveBeenCalledWith(
			'asset-123',
			expect.objectContaining({
				asset_id: 'asset-123',
				public_id: 'sample',
				tags: ['corsair'],
			}),
		);
	});

	it('create folder webhook upserts cached folders', async () => {
		const ctx = makeCtx();
		const payload = {
			notification_type: 'create_folder',
			folder: {
				path: 'samples/new-folder',
				name: 'new-folder',
			},
		};

		const result = await FolderWebhooks.createFolder.handler(
			ctx,
			makeWebhookRequest(payload) as never,
		);

		expect(result.success).toBe(true);
		expect(ctx.db.folders?.upsertByEntityId).toHaveBeenCalledWith(
			'samples/new-folder',
			expect.objectContaining({
				path: 'samples/new-folder',
				name: 'new-folder',
			}),
		);
	});

	it('delete folder webhook removes cached folders', async () => {
		const ctx = makeCtx();
		const payload = {
			notification_type: 'delete_folder',
			folder: {
				path: 'samples/old-folder',
				name: 'old-folder',
			},
		};

		const result = await FolderWebhooks.deleteFolder.handler(
			ctx,
			makeWebhookRequest(payload) as never,
		);

		expect(result.success).toBe(true);
		expect(ctx.db.folders?.deleteByEntityId).toHaveBeenCalledWith(
			'samples/old-folder',
		);
	});

	it('eager webhook accepts valid signatures', async () => {
		const result = await EagerWebhooks.eager.handler(
			makeCtx(),
			makeWebhookRequest({
				notification_type: 'eager',
				public_id: 'sample',
				asset_id: 'asset-123',
			}) as never,
		);

		expect(result.success).toBe(true);
	});

	it('resource context changes upsert cached resources', async () => {
		const ctx = makeCtx();
		const result = await ResourceWebhooks.resourceContextChanged.handler(
			ctx,
			makeWebhookRequest({
				notification_type: 'resource_context_changed',
				public_id: 'sample',
				asset_id: 'asset-123',
				context: { alt: 'sample' },
			}) as never,
		);

		expect(result.success).toBe(true);
		expect(ctx.db.resources?.upsertByEntityId).toHaveBeenCalledWith(
			'asset-123',
			expect.objectContaining({
				asset_id: 'asset-123',
				public_id: 'sample',
				context: { alt: 'sample' },
			}),
		);
	});

	it('resource metadata changes upsert cached resources', async () => {
		const ctx = makeCtx();
		const result = await ResourceWebhooks.resourceMetadataChanged.handler(
			ctx,
			makeWebhookRequest({
				notification_type: 'resource_metadata_changed',
				public_id: 'sample',
				asset_id: 'asset-123',
				metadata: { category: 'test' },
			}) as never,
		);

		expect(result.success).toBe(true);
		expect(ctx.db.resources?.upsertByEntityId).toHaveBeenCalledWith(
			'asset-123',
			expect.objectContaining({
				asset_id: 'asset-123',
				public_id: 'sample',
				metadata: { category: 'test' },
			}),
		);
	});

	it('move webhook upserts cached resources', async () => {
		const ctx = makeCtx();
		const result = await FolderWebhooks.move.handler(
			ctx,
			makeWebhookRequest({
				notification_type: 'move',
				public_id: 'sample',
				asset_id: 'asset-123',
				asset_folder: 'samples/moved',
			}) as never,
		);

		expect(result.success).toBe(true);
		expect(ctx.db.resources?.upsertByEntityId).toHaveBeenCalledWith(
			'asset-123',
			expect.objectContaining({
				asset_id: 'asset-123',
				public_id: 'sample',
				asset_folder: 'samples/moved',
			}),
		);
	});

	it('explode webhook accepts valid signatures', async () => {
		const result = await OtherWebhooks.explode.handler(
			makeCtx(),
			makeWebhookRequest({
				notification_type: 'explode',
				public_id: 'sample',
				asset_id: 'asset-123',
			}) as never,
		);

		expect(result.success).toBe(true);
	});

	it('access control changed webhook accepts valid signatures', async () => {
		const result = await OtherWebhooks.accessControlChanged.handler(
			makeCtx(),
			makeWebhookRequest({
				notification_type: 'access_control_changed',
				public_id: 'sample',
				asset_id: 'asset-123',
			}) as never,
		);

		expect(result.success).toBe(true);
	});

	it('related assets webhook accepts valid signatures', async () => {
		const result = await OtherWebhooks.relatedAssets.handler(
			makeCtx(),
			makeWebhookRequest({
				notification_type: 'related_assets',
				public_id: 'sample',
				asset_id: 'asset-123',
			}) as never,
		);

		expect(result.success).toBe(true);
	});
});
