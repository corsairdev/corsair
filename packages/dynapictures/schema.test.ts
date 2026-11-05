import {
	CreateWorkspaceInputSchema,
	ListTemplatesResponseSchema,
	ListWorkspacesResponseSchema,
	UnsubscribeWebhookInputSchema,
	UploadMediaAssetInputSchema,
} from './endpoints/types';
import { DynapicturesSchema } from './schema';
import {
	DynapicturesMediaAsset,
	DynapicturesTemplate,
	DynapicturesWorkspace,
} from './schema/database';

describe('Dynapictures schema', () => {
	it('declares a semver version', () => {
		expect(DynapicturesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares docs-labeled entities from official Dynapictures payloads', () => {
		expect(Object.keys(DynapicturesSchema.entities)).toEqual([
			'workspaces',
			'templates',
			'media',
			'webhooks',
		]);
	});
});

describe('official docs fixtures', () => {
	it('parses live GET /workspaces payload', () => {
		const parsed = ListWorkspacesResponseSchema.parse([
			{
				id: 'e6c1b8758b',
				name: 'My Workspace 1',
				dateCreated: '2026-09-02T18:07:36.000Z',
				dateUpdated: '2026-09-02T18:07:36.000Z',
				memberRole: null,
			},
		]);
		expect(parsed[0]?.id).toBe('e6c1b8758b');
		expect(parsed[0]?.name).toBe('My Workspace 1');
	});

	it('parses official workspace create/update/delete body', () => {
		const workspace = DynapicturesWorkspace.parse({
			id: '74b5b2c96a',
			name: 'Banners for client 22',
			dateCreated: '2021-06-15T12:30:14.000Z',
			dateUpdated: '2021-06-15T12:30:14.000Z',
		});
		expect(workspace.id).toBe('74b5b2c96a');
		expect(
			CreateWorkspaceInputSchema.parse({ name: 'Banners for client' }).name,
		).toBe('Banners for client');
	});

	it('parses official GET /templates objects with thumbnail not thumbnailUrl', () => {
		const parsed = ListTemplatesResponseSchema.parse([
			{
				id: '000d61e4f7',
				name: 'Twitter Template',
				thumbnail:
					'https://dynapictures.com/rest/public/designs/000d61e4f7/thumb.png',
				dateCreated: '2021-05-09T11:54:04.000Z',
				dateUpdated: '2021-05-09T11:54:26.000Z',
				layers: [
					{
						type: 'canvas',
						name: 'canvas',
						width: '650',
						height: '500',
						text: null,
					},
				],
			},
		]);
		expect(parsed[0]?.thumbnail).toContain('000d61e4f7');
		expect(DynapicturesTemplate.parse(parsed[0]!).id).toBe('000d61e4f7');
	});

	it('accepts live empty GET /templates', () => {
		expect(ListTemplatesResponseSchema.parse([])).toEqual([]);
	});

	it('requires official DELETE /hooks fields', () => {
		expect(UnsubscribeWebhookInputSchema.safeParse({}).success).toBe(false);
		expect(
			UnsubscribeWebhookInputSchema.safeParse({
				targetUrl: 'https://mycompany.com/webhooks/my-endpoint',
				eventType: 'NEW_IMAGE',
				templateId: '000d61e4f7',
			}).success,
		).toBe(true);
		expect(
			UnsubscribeWebhookInputSchema.safeParse({
				targetUrl: 'https://mycompany.com/webhooks/my-endpoint',
				eventType: 'OTHER',
				templateId: '000d61e4f7',
			}).success,
		).toBe(false);
	});

	it('parses official media asset upload response', () => {
		const asset = DynapicturesMediaAsset.parse({
			id: '5a12844966',
			folder: false,
			mimeType: 'image/jpeg',
			filename: 'my_image.jpeg',
			size: 32137,
			animated: null,
			url: 'https://blobs.dynapictures.com/media/8eb9e4869b/d3b98332a5.jpg',
			thumbnailUrl:
				'https://blobs.dynapictures.com/media/8eb9e4869b/d3b98332a5_t.jpg',
			dateCreated: '2022-05-31T19:57:08.458Z',
			dateUpdated: '2022-05-31T19:57:08.458Z',
		});
		expect(asset.folder).toBe(false);
		expect(
			UploadMediaAssetInputSchema.parse({
				workspaceId: 'e6c1b8758b',
				fileUrl: 'https://dynapictures.com/images/banners/cat1.jpeg',
			}).workspaceId,
		).toBe('e6c1b8758b');
	});
});
