import { CanvaEndpointOutputSchemas } from './endpoints/types';
import { canva } from './index';

describe('Canva API response schemas', () => {
	describe('designs', () => {
		it('validates designs list response from Canva docs example', () => {
			const result = CanvaEndpointOutputSchemas.designsList.parse({
				continuation:
					'RkFGMgXlsVTDbMd:MR3L0QjiaUzycIAjx0yMyuNiV0OildoiOwL0x32G4NjNu4FwtAQNxowUQNMMYN',
				items: [
					{
						id: 'DAFVztcvd9z',
						title: 'My summer holiday',
						owner: {
							user_id: 'auDAbliZ2rQNNOsUl5OLu',
							team_id: 'Oi2RJILTrKk0KRhRUZozX',
						},
						thumbnail: {
							width: 595,
							height: 335,
							url: 'https://document-export.canva.com/Vczz9/zF9vzVtdADc/2/thumbnail/0001.png?query',
						},
						urls: {
							edit_url: 'https://www.canva.com/api/design/example/edit',
							view_url: 'https://www.canva.com/api/design/example/view',
						},
						created_at: 1377396000,
						updated_at: 1692928800,
						page_count: 5,
						design_types: ['presentation'],
					},
				],
			});

			expect(result.items).toHaveLength(1);
			expect(result.items[0]?.id).toBe('DAFVztcvd9z');
			expect(result.items[0]?.owner.user_id).toBe('auDAbliZ2rQNNOsUl5OLu');
		});

		it('validates design get response from Canva docs example', () => {
			const result = CanvaEndpointOutputSchemas.designsGet.parse({
				design: {
					id: 'DAFVztcvd9z',
					title: 'My summer holiday',
					owner: {
						user_id: 'auDAbliZ2rQNNOsUl5OLu',
						team_id: 'Oi2RJILTrKk0KRhRUZozX',
					},
					thumbnail: {
						width: 595,
						height: 335,
						url: 'https://document-export.canva.com/Vczz9/zF9vzVtdADc/2/thumbnail/0001.png?query',
					},
					urls: {
						edit_url: 'https://www.canva.com/api/design/example/edit',
						view_url: 'https://www.canva.com/api/design/example/view',
					},
					created_at: 1377396000,
					updated_at: 1692928800,
					page_count: 5,
				},
			});

			expect(result.design.id).toBe('DAFVztcvd9z');
			expect(result.design.urls.view_url).toContain('/view');
		});

		it('validates design create response shape', () => {
			const result = CanvaEndpointOutputSchemas.designsCreate.parse({
				design: {
					id: 'DAFVztcvd9z',
					owner: {
						user_id: 'auDAbliZ2rQNNOsUl5OLu',
						team_id: 'Oi2RJILTrKk0KRhRUZozX',
					},
					urls: {
						edit_url: 'https://www.canva.com/api/design/example/edit',
						view_url: 'https://www.canva.com/api/design/example/view',
					},
					created_at: 1377396000,
					updated_at: 1692928800,
				},
			});

			expect(result.design.id).toBe('DAFVztcvd9z');
		});

		it('validates design pages response shape', () => {
			const result = CanvaEndpointOutputSchemas.designsGetPages.parse({
				items: [
					{
						index: 0,
						dimensions: { width: 1920, height: 1080 },
						thumbnail: {
							width: 595,
							height: 335,
							url: 'https://document-export.canva.com/example/page-0.png',
						},
					},
				],
			});

			expect(result.items).toHaveLength(1);
			expect(result.items[0]?.index).toBe(0);
		});

		it('validates design export formats response shape', () => {
			const result = CanvaEndpointOutputSchemas.designsGetExportFormats.parse({
				export_formats: {
					pdf: { supports_pages: true },
					png: {},
					mp4: {},
				},
			});

			expect(result.export_formats.pdf?.supports_pages).toBe(true);
			expect(Object.keys(result.export_formats)).toContain('mp4');
		});
	});

	describe('assets', () => {
		it('validates asset get response shape', () => {
			const result = CanvaEndpointOutputSchemas.assetsGet.parse({
				asset: {
					type: 'image',
					id: 'Msd59349ff',
					name: 'My Awesome Upload',
					tags: ['image', 'holiday', 'best day ever'],
					created_at: 1377396000,
					updated_at: 1692928800,
					thumbnail: {
						width: 595,
						height: 335,
						url: 'https://document-export.canva.com/example/thumbnail.png?query',
					},
				},
			});

			expect(result.asset.type).toBe('image');
			expect(result.asset.tags).toContain('holiday');
		});

		it('validates asset update response shape', () => {
			const result = CanvaEndpointOutputSchemas.assetsUpdate.parse({
				asset: {
					type: 'image',
					id: 'Msd59349ff',
					name: 'Renamed Upload',
					tags: ['renamed'],
					created_at: 1377396000,
					updated_at: 1692928800,
				},
			});

			expect(result.asset.name).toBe('Renamed Upload');
		});

		it('validates asset delete success response shape', () => {
			const result = CanvaEndpointOutputSchemas.assetsDelete.parse({
				success: true,
			});

			expect(result.success).toBe(true);
		});
	});

	describe('folders', () => {
		it('validates folder create response shape', () => {
			const result = CanvaEndpointOutputSchemas.foldersCreate.parse({
				folder: {
					id: 'FAF2lZtloor',
					name: 'My awesome holiday',
					created_at: 1377396000,
					updated_at: 1692928800,
				},
			});

			expect(result.folder.id).toBe('FAF2lZtloor');
			expect(result.folder.name).toBe('My awesome holiday');
		});

		it('validates folder get response shape', () => {
			const result = CanvaEndpointOutputSchemas.foldersGet.parse({
				folder: {
					id: 'FAF2lZtloor',
					name: 'My awesome holiday',
					created_at: 1377396000,
					updated_at: 1692928800,
				},
			});

			expect(result.folder.id).toBe('FAF2lZtloor');
		});

		it('validates folder listItems response shape with mixed item types', () => {
			const result = CanvaEndpointOutputSchemas.foldersListItems.parse({
				items: [
					{
						type: 'folder',
						folder: {
							id: 'FAF2lZtloor',
							name: 'Subfolder',
							created_at: 1377396000,
							updated_at: 1692928800,
						},
					},
					{
						type: 'design',
						design: {
							id: 'DAFVztcvd9z',
							title: 'My summer holiday',
							urls: {
								edit_url: 'https://www.canva.com/api/design/example/edit',
								view_url: 'https://www.canva.com/api/design/example/view',
							},
							created_at: 1377396000,
							updated_at: 1692928800,
						},
					},
					{
						type: 'image',
						image: {
							type: 'image',
							id: 'Msd59349ff',
							name: 'My Awesome Upload',
							tags: [],
							created_at: 1377396000,
							updated_at: 1692928800,
						},
					},
					{
						type: 'brand_template',
						brand_template: {
							id: 'BAFVztcvd9z',
							title: 'Holiday template',
							view_url: 'https://www.canva.com/brand-templates/example/view',
							create_url:
								'https://www.canva.com/brand-templates/example/create',
							created_at: 1377396000,
							updated_at: 1692928800,
						},
					},
				],
				continuation: 'abc123',
			});

			expect(result.items).toHaveLength(4);
			expect(result.items[0]?.type).toBe('folder');
			expect(result.items[1]?.type).toBe('design');
			expect(result.items[2]?.type).toBe('image');
			expect(result.items[3]?.type).toBe('brand_template');
		});
	});

	describe('exports', () => {
		it('validates exports create in-progress response shape', () => {
			const result = CanvaEndpointOutputSchemas.exportsCreate.parse({
				job: {
					id: 'e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8',
					status: 'in_progress',
				},
			});

			expect(result.job.status).toBe('in_progress');
			expect(result.job.id).toBe('e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8');
		});

		it('validates exports get success response shape', () => {
			const result = CanvaEndpointOutputSchemas.exportsGet.parse({
				job: {
					id: 'e08861ae-3b29-45db-8dc1-1fe0bf7f1cc8',
					status: 'success',
					urls: ['https://export-download.canva.com/example.pdf'],
				},
			});

			expect(result.job.status).toBe('success');
			expect(result.job.urls).toHaveLength(1);
		});
	});

	describe('users', () => {
		it('validates users me response shape', () => {
			const result = CanvaEndpointOutputSchemas.usersGetMe.parse({
				team_user: {
					user_id: 'auDAbliZ2rQNNOsUl5OLu',
					team_id: 'Oi2RJILTrKk0KRhRUZozX',
				},
			});

			expect(result.team_user.user_id).toBe('auDAbliZ2rQNNOsUl5OLu');
			expect(result.team_user.team_id).toBe('Oi2RJILTrKk0KRhRUZozX');
		});

		it('validates users profile response shape', () => {
			const result = CanvaEndpointOutputSchemas.usersGetProfile.parse({
				profile: {
					display_name: 'Jane Doe',
				},
			});

			expect(result.profile.display_name).toBe('Jane Doe');
		});

		it('validates users capabilities response shape', () => {
			const result = CanvaEndpointOutputSchemas.usersGetCapabilities.parse({
				capabilities: ['autofill', 'brand_template', 'resize'],
			});

			expect(result.capabilities).toContain('autofill');
			expect(result.capabilities).toHaveLength(3);
		});
	});

	describe('brandTemplates', () => {
		it('validates brand templates list response shape', () => {
			const result = CanvaEndpointOutputSchemas.brandTemplatesList.parse({
				items: [
					{
						id: 'DEMzWSwy3BQ',
						title: 'Advertisement',
						view_url: 'https://www.canva.com/design/DAD5jkjkoZY/view',
						create_url: 'https://www.canva.com/design/DAD5jkjkoZY/edit',
						created_at: 1704110400,
						updated_at: 1719800400,
					},
				],
				continuation: 'RkFGMgXlsVTDbMd',
			});

			expect(result.items).toHaveLength(1);
			expect(result.items[0]?.id).toBe('DEMzWSwy3BQ');
		});

		it('validates brand template get response shape', () => {
			const result = CanvaEndpointOutputSchemas.brandTemplatesGet.parse({
				brand_template: {
					id: 'DEMzWSwy3BQ',
					title: 'Advertisement',
					view_url: 'https://www.canva.com/design/DAD5jkjkoZY/view',
					create_url: 'https://www.canva.com/design/DAD5jkjkoZY/edit',
					created_at: 1704110400,
					updated_at: 1719800400,
				},
			});

			expect(result.brand_template.title).toBe('Advertisement');
		});

		it('validates brand template dataset response shape', () => {
			const result = CanvaEndpointOutputSchemas.brandTemplatesGetDataset.parse({
				dataset: {
					cute_pet_image_of_the_day: { type: 'image' },
					cute_pet_name: { type: 'text' },
					cute_pet_sales_chart: { type: 'chart' },
				},
			});

			expect(result.dataset.cute_pet_name?.type).toBe('text');
			expect(result.dataset.cute_pet_image_of_the_day?.type).toBe('image');
		});
	});

	describe('assetUploads', () => {
		it('validates asset upload create in-progress response shape', () => {
			const result = CanvaEndpointOutputSchemas.assetUploadsCreate.parse({
				job: {
					id: '450a76e7-f96f-43ae-9c37-0e1ce492ac72',
					status: 'in_progress',
				},
			});

			expect(result.job.status).toBe('in_progress');
		});

		it('validates asset upload get success response shape with asset', () => {
			const result = CanvaEndpointOutputSchemas.assetUploadsGet.parse({
				job: {
					id: '450a76e7-f96f-43ae-9c37-0e1ce492ac72',
					status: 'success',
					asset: {
						type: 'image',
						id: 'Msd59349ff',
						name: 'My Awesome Upload',
						tags: ['image'],
						created_at: 1377396000,
						updated_at: 1692928800,
					},
				},
			});

			expect(result.job.status).toBe('success');
			expect(result.job.asset?.id).toBe('Msd59349ff');
		});

		it('validates url asset upload create response shape', () => {
			const result = CanvaEndpointOutputSchemas.assetUploadsCreateFromUrl.parse(
				{
					job: {
						id: '450a76e7-f96f-43ae-9c37-0e1ce492ac72',
						status: 'in_progress',
					},
				},
			);

			expect(result.job.id).toBe('450a76e7-f96f-43ae-9c37-0e1ce492ac72');
		});

		it('validates url asset upload get failed response shape', () => {
			const result = CanvaEndpointOutputSchemas.assetUploadsGetFromUrl.parse({
				job: {
					id: '450a76e7-f96f-43ae-9c37-0e1ce492ac72',
					status: 'failed',
					error: { code: 'download_failed', message: 'Could not fetch URL' },
				},
			});

			expect(result.job.status).toBe('failed');
			expect(result.job.error?.code).toBe('download_failed');
		});
	});

	describe('imports', () => {
		it('validates import create success response shape with designs', () => {
			const result = CanvaEndpointOutputSchemas.importsCreate.parse({
				job: {
					id: '450a76e7-f96f-43ae-9c37-0e1ce492ac72',
					status: 'success',
					result: {
						designs: [
							{
								id: 'DAFVztcvd9z',
								title: 'My summer holiday',
								url: 'https://www.canva.com/design/DAFVztcvd9z/edit',
							},
						],
					},
				},
			});

			expect(result.job.result?.designs).toHaveLength(1);
			expect(result.job.result?.designs[0]?.id).toBe('DAFVztcvd9z');
		});

		it('validates import get response shape', () => {
			const result = CanvaEndpointOutputSchemas.importsGet.parse({
				job: {
					id: '450a76e7-f96f-43ae-9c37-0e1ce492ac72',
					status: 'in_progress',
				},
			});

			expect(result.job.status).toBe('in_progress');
		});

		it('validates url import create response shape', () => {
			const result = CanvaEndpointOutputSchemas.importsCreateFromUrl.parse({
				job: {
					id: '450a76e7-f96f-43ae-9c37-0e1ce492ac72',
					status: 'success',
					result: {
						designs: [{ id: 'DAFVztcvd9z' }],
					},
				},
			});

			expect(result.job.result?.designs[0]?.id).toBe('DAFVztcvd9z');
		});

		it('validates url import get response shape', () => {
			const result = CanvaEndpointOutputSchemas.importsGetFromUrl.parse({
				job: {
					id: '450a76e7-f96f-43ae-9c37-0e1ce492ac72',
					status: 'failed',
					error: { code: 'invalid_file', message: 'Unsupported file type' },
				},
			});

			expect(result.job.error?.message).toBe('Unsupported file type');
		});
	});

	describe('resizes', () => {
		it('validates resize create response shape', () => {
			const result = CanvaEndpointOutputSchemas.resizesCreate.parse({
				job: {
					id: '450a76e7-f96f-43ae-9c37-0e1ce492ac72',
					status: 'in_progress',
				},
			});

			expect(result.job.status).toBe('in_progress');
		});

		it('validates resize get success response shape with design', () => {
			const result = CanvaEndpointOutputSchemas.resizesGet.parse({
				job: {
					id: '450a76e7-f96f-43ae-9c37-0e1ce492ac72',
					status: 'success',
					result: {
						design: {
							id: 'DAFVztcvd9z',
							owner: {
								user_id: 'auDAbliZ2rQNNOsUl5OLu',
								team_id: 'Oi2RJILTrKk0KRhRUZozX',
							},
							urls: {
								edit_url: 'https://www.canva.com/api/design/example/edit',
								view_url: 'https://www.canva.com/api/design/example/view',
							},
							created_at: 1377396000,
							updated_at: 1692928800,
						},
					},
				},
			});

			expect(result.job.result?.design.id).toBe('DAFVztcvd9z');
		});
	});

	describe('autofills', () => {
		it('validates autofill create response shape', () => {
			const result = CanvaEndpointOutputSchemas.autofillsCreate.parse({
				job: {
					id: '450a76e7-f96f-43ae-9c37-0e1ce492ac72',
					status: 'in_progress',
				},
			});

			expect(result.job.status).toBe('in_progress');
		});

		it('validates autofill get success response shape with design', () => {
			const result = CanvaEndpointOutputSchemas.autofillsGet.parse({
				job: {
					id: '450a76e7-f96f-43ae-9c37-0e1ce492ac72',
					status: 'success',
					result: {
						type: 'create_design',
						design: {
							id: 'DAFVztcvd9z',
							title: 'My summer holiday',
							url: 'https://www.canva.com/design/DAFVztcvd9z/edit',
							current_page_index: 1,
						},
					},
				},
			});

			expect(result.job.result?.design?.id).toBe('DAFVztcvd9z');
			expect(result.job.result?.type).toBe('create_design');
		});
	});

	describe('comments', () => {
		it('validates create thread response shape', () => {
			const result = CanvaEndpointOutputSchemas.commentsCreateThread.parse({
				thread: {
					id: 'KeAbcDefGh',
					design_id: 'DAFVztcvd9z',
					author: { id: 'auDAbliZ2rQNNOsUl5OLu', display_name: 'John Doe' },
					created_at: 1692928800,
					updated_at: 1692928800,
				},
			});

			expect(result.thread.id).toBe('KeAbcDefGh');
			expect(result.thread.author?.display_name).toBe('John Doe');
		});

		it('validates get thread response shape', () => {
			const result = CanvaEndpointOutputSchemas.commentsGetThread.parse({
				thread: {
					id: 'KeAbcDefGh',
					design_id: 'DAFVztcvd9z',
					assignee: { id: 'auDAbliZ2rQNNOsUl5OLu' },
				},
			});

			expect(result.thread.assignee?.id).toBe('auDAbliZ2rQNNOsUl5OLu');
		});

		it('validates create reply response shape', () => {
			const result = CanvaEndpointOutputSchemas.commentsCreateReply.parse({
				reply: {
					id: 'ReAbcDefGh',
					thread_id: 'KeAbcDefGh',
					content: { plaintext: 'Thanks!' },
				},
			});

			expect(result.reply.id).toBe('ReAbcDefGh');
			expect(result.reply.content?.plaintext).toBe('Thanks!');
		});

		it('validates list replies response shape', () => {
			const result = CanvaEndpointOutputSchemas.commentsListReplies.parse({
				items: [
					{ id: 'ReAbcDefGh', thread_id: 'KeAbcDefGh' },
					{ id: 'ReAbcDefGi', thread_id: 'KeAbcDefGh' },
				],
				continuation: 'xyz',
			});

			expect(result.items).toHaveLength(2);
			expect(result.continuation).toBe('xyz');
		});

		it('validates get reply response shape', () => {
			const result = CanvaEndpointOutputSchemas.commentsGetReply.parse({
				reply: { id: 'ReAbcDefGh', thread_id: 'KeAbcDefGh' },
			});

			expect(result.reply.id).toBe('ReAbcDefGh');
		});
	});
});

describe('canva plugin', () => {
	it('returns plugin id canva', () => {
		const plugin = canva();
		expect(plugin.id).toBe('canva');
	});

	it('exposes the expected endpoint tree groups and keys', () => {
		const plugin = canva();
		const endpoints = plugin.endpoints;
		expect(endpoints).toBeDefined();
		if (!endpoints) return;

		expect(Object.keys(endpoints).sort()).toEqual(
			[
				'assetUploads',
				'assets',
				'autofills',
				'brandTemplates',
				'comments',
				'designs',
				'exports',
				'folders',
				'imports',
				'resizes',
				'users',
			].sort(),
		);

		expect(Object.keys(endpoints.comments).sort()).toEqual(
			[
				'createReply',
				'createThread',
				'getReply',
				'getThread',
				'listReplies',
			].sort(),
		);
		expect(Object.keys(endpoints.assetUploads).sort()).toEqual(
			['create', 'createFromUrl', 'get', 'getFromUrl'].sort(),
		);
		expect(plugin.webhooks).toEqual({});
	});

	it('has an empty webhook matcher (no webhooks supported)', () => {
		const plugin = canva();
		expect(plugin.pluginWebhookMatcher).toBeDefined();
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});
});
