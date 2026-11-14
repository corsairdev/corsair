import { logEventFromContext } from 'corsair/core';
import { makeImgixRequest } from './client';
import {
	Assets,
	Generations,
	Purges,
	Reports,
	Sources,
	UploadSessions,
} from './endpoints';
import type { ImgixContext } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeImgixRequest: jest.fn(),
}));

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const mockedRequest = jest.mocked(makeImgixRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Sources.list>[0];

function buildCtx(): Ctx {
	const ctx: ImgixContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-imgix-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-imgix-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const mockCtx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Imgix endpoints', () => {
	describe('Sources', () => {
		it('sources.list sends GET with query and logs count', async () => {
			const mockResponse = {
				data: [
					{
						id: 'src_1',
						type: 'sources' as const,
						attributes: { name: 'Main S3' },
					},
				],
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Sources.list(mockCtx, {
				filter_name: 'Main',
				filter_deployment_type: 's3',
				filter_enabled: true,
				sort: 'name',
				fields: 'name,deployment_status',
				page_number: 1,
				page_size: 10,
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'GET',
					path: 'sources',
					query: {
						'filter[name]': 'Main',
						'filter[deployment.type]': 's3',
						'filter[enabled]': true,
						sort: 'name',
						'fields[sources]': 'name,deployment_status',
						'page[number]': 1,
						'page[size]': 10,
					},
				}),
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'imgix.sources.list',
				{ count: 1 },
				'completed',
			);
		});

		it('sources.list parses a live imgix_storage source with object default_params', async () => {
			// Trimmed from a live imgix response (11-15): every new account gets this source
			const liveResponse = {
				data: [
					{
						attributes: {
							date_deployed: 1794696159,
							deployment: {
								cache_ttl_behavior: 'enforce_minimum',
								cache_ttl_error: 300,
								cache_ttl_value: 5184000,
								custom_domains: [],
								default_params: {},
								image_error: null,
								image_missing: null,
								imgix_subdomains: ['example-subdomain'],
								request_authentication: null,
								secure_url_enabled: false,
								type: 'imgix_storage',
							},
							deployment_status: 'deployed',
							enabled: true,
							name: 'Imgix Storage',
							robots: null,
						},
						id: 'src_live',
						type: 'sources',
					},
				],
				included: [],
				jsonapi: { version: '1.0' },
				meta: {
					pagination: {
						currentPage: 0,
						hasNextPage: false,
						pageSize: 20,
						totalPages: 1,
						totalRecords: 1,
					},
				},
			};
			mockedRequest.mockResolvedValue(liveResponse);

			const result = await Sources.list(mockCtx, {});

			expect(result.data[0]?.attributes.deployment?.type).toBe('imgix_storage');
			expect(result.data[0]?.attributes.deployment?.default_params).toEqual({});
		});

		it('sources.create maps documented gcs, azure and s3_compatible fields', async () => {
			mockedRequest.mockResolvedValue({
				data: { id: 'src_new', type: 'sources', attributes: {} },
			});

			await Sources.create(mockCtx, {
				name: 'GCS',
				deployment_type: 'gcs',
				imgix_subdomains: ['gcs-sub'],
				gcs_bucket: 'bucket',
				gcs_access_key: 'GOOG1',
				gcs_secret_key: 'gsecret',
			});
			await Sources.create(mockCtx, {
				name: 'Azure',
				deployment_type: 'azure',
				imgix_subdomains: ['az-sub'],
				azure_account: 'acct',
				azure_bucket: 'container',
				azure_sas_string: 'sv=1',
				azure_service_type: 'blob',
			});
			await Sources.create(mockCtx, {
				name: 'R2',
				deployment_type: 's3_compatible',
				imgix_subdomains: ['r2-sub'],
				storage_provider: 'R2',
				access_key_id: 'ak',
				secret_key: 'sk',
				bucket_name: 'b',
				endpoint_url: 'https://example.r2.cloudflarestorage.com',
			});

			const deployments = mockedRequest.mock.calls.map(
				(call) =>
					(
						call[1]?.body as {
							data: { attributes: { deployment: Record<string, unknown> } };
						}
					).data.attributes.deployment,
			);
			expect(deployments[0]).toEqual({
				type: 'gcs',
				imgix_subdomains: ['gcs-sub'],
				gcs_bucket: 'bucket',
				gcs_access_key: 'GOOG1',
				gcs_secret_key: 'gsecret',
			});
			expect(deployments[1]).toMatchObject({
				type: 'azure',
				azure_account: 'acct',
				azure_bucket: 'container',
				azure_sas_string: 'sv=1',
				azure_service_type: 'blob',
			});
			expect(deployments[2]).toMatchObject({
				type: 's3_compatible',
				storage_provider: 'R2',
				access_key_id: 'ak',
				secret_key: 'sk',
				bucket_name: 'b',
				endpoint_url: 'https://example.r2.cloudflarestorage.com',
			});
		});

		it('sources.create formats JSON:API payload and logs deployment', async () => {
			const mockResponse = {
				data: {
					id: 'src_created',
					type: 'sources' as const,
					attributes: { name: 'Created S3' },
				},
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Sources.create(mockCtx, {
				name: 'Created S3',
				deployment_type: 's3',
				imgix_subdomains: ['created-s3'],
				s3_bucket: 'my-bucket',
				s3_access_key: 'AKIA123',
				s3_secret_key: 'secret123',
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'POST',
					path: 'sources',
					body: {
						data: {
							type: 'sources',
							attributes: {
								name: 'Created S3',
								deployment: {
									type: 's3',
									imgix_subdomains: ['created-s3'],
									s3_bucket: 'my-bucket',
									s3_access_key: 'AKIA123',
									s3_secret_key: 'secret123',
								},
							},
						},
						jsonapi: { version: '1.0' },
					},
				}),
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'imgix.sources.create',
				{ source_id: 'src_created', deployment_type: 's3' },
				'completed',
			);
		});

		it('sources.create rejects invalid inputs without making network call', async () => {
			await expect(
				Sources.create(mockCtx, {
					name: '',
					deployment_type: 's3',
					imgix_subdomains: ['x'],
				}),
			).rejects.toThrow();

			expect(mockedRequest).not.toHaveBeenCalled();
		});

		it('sources.get fetches source details by ID with encoded path', async () => {
			const mockResponse = {
				data: {
					id: 'src_abc/123',
					type: 'sources' as const,
					attributes: { name: 'Single Source' },
				},
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Sources.get(mockCtx, {
				source_id: 'src_abc/123',
				fields: 'name',
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'GET',
					path: 'sources/src_abc%2F123',
					query: { 'fields[sources]': 'name' },
				}),
			);
		});

		it('sources.update sends PATCH with updated attributes', async () => {
			const mockResponse = {
				data: {
					id: 'src_123',
					type: 'sources' as const,
					attributes: { name: 'Updated Name', enabled: false },
				},
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Sources.update(mockCtx, {
				source_id: 'src_123',
				name: 'Updated Name',
				enabled: false,
				default_params: { auto: 'format' },
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'PATCH',
					path: 'sources/src_123',
					body: {
						data: {
							id: 'src_123',
							type: 'sources',
							attributes: {
								name: 'Updated Name',
								enabled: false,
								deployment: { default_params: { auto: 'format' } },
							},
						},
					},
				}),
			);
		});
	});

	describe('Assets', () => {
		it('assets.list fetches assets for a source', async () => {
			const mockResponse = {
				data: [
					{
						id: 'src_123/img.png',
						type: 'assets' as const,
						attributes: { origin_path: 'img.png' },
					},
				],
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Assets.list(mockCtx, {
				source_id: 'src_123',
				sort: '-created_at',
				page_cursor: 'cursor_xyz',
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'GET',
					path: 'assets/src_123',
					query: {
						sort: '-created_at',
						'page[cursor]': 'cursor_xyz',
					},
				}),
			);
		});

		it('assets.get fetches single asset with path encoding', async () => {
			const mockResponse = {
				data: {
					id: 'src_123/folder/sample image.png',
					type: 'assets' as const,
					attributes: { origin_path: 'folder/sample image.png' },
				},
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Assets.get(mockCtx, {
				source_id: 'src_123',
				origin_path: 'folder/sample image.png',
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'GET',
					path: 'assets/src_123/folder/sample%20image.png',
				}),
			);
		});

		it('assets.update sends custom_fields patch', async () => {
			const mockResponse = {
				data: {
					id: 'src_123/pic.jpg',
					type: 'assets' as const,
					attributes: { custom_fields: { tag: 'nature' } },
				},
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Assets.update(mockCtx, {
				source_id: 'src_123',
				origin_path: 'pic.jpg',
				custom_fields: { tag: 'nature' },
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'PATCH',
					path: 'sources/src_123/assets/pic.jpg',
					body: {
						data: {
							id: 'src_123/pic.jpg',
							type: 'assets',
							attributes: {
								custom_fields: { tag: 'nature' },
							},
						},
					},
				}),
			);
		});

		it('assets.addFromOrigin queues an asset from origin', async () => {
			mockedRequest.mockResolvedValue({});

			const result = await Assets.addFromOrigin(mockCtx, {
				source_id: 'src_123',
				origin_path: 'raw/banner.jpg',
			});

			expect(result).toEqual({});
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'POST',
					path: 'sources/src_123/assets/add/raw/banner.jpg',
				}),
			);
		});

		it('assets.addFromOrigin accepts the documented empty 202 body', async () => {
			mockedRequest.mockResolvedValueOnce('');
			await expect(
				Assets.addFromOrigin(mockCtx, {
					source_id: 'src_123',
					origin_path: 'raw/banner.jpg',
				}),
			).resolves.toEqual({});

			mockedRequest.mockResolvedValueOnce(undefined);
			await expect(
				Assets.addFromOrigin(mockCtx, {
					source_id: 'src_123',
					origin_path: 'raw/banner.jpg',
				}),
			).resolves.toEqual({});
		});

		it('assets.list sends page_size as page[limit] and parses a live response with nulls', async () => {
			// Trimmed from a live imgix response (11-15): unanalyzed assets return null for most fields
			const liveResponse = {
				data: [
					{
						attributes: {
							analyzed_tags: null,
							categories: null,
							color_model: null,
							color_profile: null,
							colors: null,
							content_type: 'video/mp4',
							custom_fields: null,
							date_created: 1794696177,
							date_modified: null,
							description: null,
							dpi_height: null,
							dpi_width: null,
							file_size: 64555030,
							has_frames: null,
							media_height: null,
							media_kind: 'VIDEO',
							media_width: null,
							name: null,
							origin_path: '/paraglider.mp4',
							source_id: 'src_123',
							tags: null,
							uploaded_by_api: false,
						},
						id: 'src_123/paraglider.mp4',
						type: 'assets',
					},
				],
				included: [],
				jsonapi: { version: '1.0' },
				meta: {
					cursor: {
						current: '0',
						hasMore: true,
						next: '2',
						totalRecords: '7',
					},
				},
			};
			mockedRequest.mockResolvedValue(liveResponse);

			const result = await Assets.list(mockCtx, {
				source_id: 'src_123',
				page_size: 2,
			});

			expect(result.data[0]?.attributes.custom_fields).toBeNull();
			expect(result.meta?.cursor?.next).toBe('2');
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					path: 'assets/src_123',
					query: { 'page[limit]': 2 },
				}),
			);
		});

		it('assets.get and assets.update keep the asset path out of event payloads', async () => {
			const response = {
				data: {
					id: 'src_123/customers/alice@example.com/photo.jpg',
					type: 'assets',
					attributes: { custom_fields: null },
				},
			};
			mockedRequest.mockResolvedValue(response);

			await Assets.get(mockCtx, {
				source_id: 'src_123',
				origin_path: 'customers/alice@example.com/photo.jpg',
			});
			await Assets.update(mockCtx, {
				source_id: 'src_123',
				origin_path: 'customers/alice@example.com/photo.jpg',
				custom_fields: { sku: '1' },
			});

			for (const call of mockedLogEvent.mock.calls) {
				expect(JSON.stringify(call[2])).not.toContain('alice@example.com');
			}
		});

		it('assets.upload sends the given content_type with the raw bytes', async () => {
			mockedRequest.mockResolvedValue({});

			await Assets.upload(mockCtx, {
				source_id: 'src_123',
				origin_path: 'uploads/pixel.png',
				content_base64: 'aGVsbG8=',
				content_type: 'image/png',
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					headers: { 'Content-Type': 'image/png' },
				}),
			);
			const requestBody = mockedRequest.mock.calls[0]?.[1]?.body;
			expect(requestBody).toBeInstanceOf(Blob);
			if (requestBody instanceof Blob)
				expect(requestBody.type).toBe('image/png');
		});

		it('assets.upload wraps decoded file bytes in an octet-stream Blob', async () => {
			mockedRequest.mockResolvedValue({});

			const result = await Assets.upload(mockCtx, {
				source_id: 'src_123',
				origin_path: 'uploads/hello.txt',
				content_base64: 'aGVsbG8=',
				overwrite: true,
			});

			expect(result).toEqual({});
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'POST',
					path: 'sources/src_123/upload/uploads/hello.txt',
					query: { overwrite: true },
					headers: { 'Content-Type': 'application/octet-stream' },
				}),
			);
			const requestBody = mockedRequest.mock.calls[0]?.[1]?.body;
			expect(requestBody).toBeInstanceOf(Blob);
			if (requestBody instanceof Blob) {
				expect(await requestBody.text()).toBe('hello');
			}
		});
	});

	describe('UploadSessions', () => {
		it('uploadSessions.create creates session and gets presigned URL', async () => {
			const mockResponse = {
				data: {
					id: 'sess_1',
					attributes: { url: 'https://s3.example.com/presigned' },
				},
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await UploadSessions.create(mockCtx, {
				source_id: 'src_123',
				origin_path: 'video.mp4',
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'POST',
					path: 'sources/src_123/upload-sessions/video.mp4',
				}),
			);
		});

		it('uploadSessions.getStatus retrieves session state', async () => {
			const mockResponse = {
				data: {
					id: 'sess_1',
					attributes: { status: 'COMPLETE' as const },
				},
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await UploadSessions.getStatus(mockCtx, {
				source_id: 'src_123',
				session_id: 'sess_1',
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'GET',
					path: 'sources/src_123/upload-sessions/status/sess_1',
				}),
			);
		});

		it('uploadSessions.close closes the upload session', async () => {
			mockedRequest.mockResolvedValue({});

			const result = await UploadSessions.close(mockCtx, {
				source_id: 'src_123',
				session_id: 'sess_1',
			});

			expect(result).toEqual({});
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'POST',
					path: 'sources/src_123/upload-sessions/sess_1',
				}),
			);
		});

		it('uploadSessions.cancel cancels the upload session with DELETE', async () => {
			mockedRequest.mockResolvedValue({});

			const result = await UploadSessions.cancel(mockCtx, {
				source_id: 'src_123',
				session_id: 'sess_1',
			});

			expect(result).toEqual({});
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'DELETE',
					path: 'sources/src_123/upload-sessions/cancel/sess_1',
				}),
			);
		});
	});

	describe('Purges', () => {
		it('purges.create triggers cache purge for asset URL', async () => {
			mockedRequest.mockResolvedValue({});

			const result = await Purges.create(mockCtx, {
				url: 'https://assets.imgix.net/image.jpg',
				source_id: 'src_123',
				sub_image: false,
			});

			expect(result).toEqual({});
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'POST',
					path: 'purge',
					body: {
						data: {
							type: 'purges',
							attributes: {
								url: 'https://assets.imgix.net/image.jpg',
								source_id: 'src_123',
								sub_image: false,
							},
						},
					},
				}),
			);
		});
	});

	describe('Reports', () => {
		it('reports.list queries available reports with filters', async () => {
			const mockResponse = {
				data: [
					{
						id: 'rep_1',
						type: 'reports' as const,
						attributes: {
							completed: true,
							files: ['https://example.com/log.gz'],
							period_start: 100,
							period_end: 200,
							report_key: 'rep_key',
							report_type: 'cdn_logs',
						},
					},
				],
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Reports.list(mockCtx, {
				completed: true,
				report_type: 'cdn_logs',
				page_number: 0,
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'GET',
					path: 'reports',
					query: {
						'filter[completed]': true,
						'filter[report_type]': 'cdn_logs',
						'page[number]': 0,
					},
				}),
			);
		});

		it('reports.get retrieves single report by ID', async () => {
			const mockResponse = {
				data: {
					id: 'rep_1',
					type: 'reports' as const,
					attributes: {
						completed: true,
						files: ['https://example.com/log.gz'],
						period_start: 100,
						period_end: 200,
						report_key: 'rep_key',
						report_type: 'cdn_logs',
					},
				},
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Reports.get(mockCtx, { report_id: 'rep_1' });

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'GET',
					path: 'reports/rep_1',
				}),
			);
		});
	});

	describe('Generations', () => {
		it('generations.createVideo sends url (not source) and parses the job envelope', async () => {
			// Documented response at docs.imgix.com/apis/generations/video-generation
			const mockResponse = {
				data: {
					type: 'job',
					id: '66523ecdc9e5a19840c20941',
					attributes: { status: 'started', created_at: 1792783178 },
				},
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Generations.createVideo(mockCtx, {
				url: 'https://assets.imgix.net/ocean.jpg',
				model: 'auto',
				duration: 4,
				aspect_ratio: '16:9',
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'POST',
					path: 'generations/video',
					body: {
						url: 'https://assets.imgix.net/ocean.jpg',
						model: 'auto',
						duration: 4,
						aspect_ratio: '16:9',
					},
				}),
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'imgix.generations.createVideo',
				{ job_id: '66523ecdc9e5a19840c20941', status: 'started' },
				'completed',
			);
		});

		it('generations.getVideoJob parses ready and errored job envelopes', async () => {
			const ready = {
				data: {
					type: 'job',
					id: 'vid_job_1',
					attributes: {
						status: 'ready',
						created_at: 1792783178,
						updated_at: 1792783410,
						result: {
							url: 'https://your-domain.imgix.net/image.jpg?itv=ef22b73a53&variant=542db280',
						},
					},
				},
			};
			mockedRequest.mockResolvedValueOnce(ready);
			await expect(
				Generations.getVideoJob(mockCtx, { job_id: 'vid_job_1' }),
			).resolves.toEqual(ready);

			const errored = {
				data: {
					type: 'job',
					id: 'vid_job_2',
					attributes: {
						status: 'errored',
						created_at: 1792783178,
						updated_at: 1792783410,
						error: { code: 500, message: 'failed to generate' },
					},
				},
			};
			mockedRequest.mockResolvedValueOnce(errored);
			await expect(
				Generations.getVideoJob(mockCtx, { job_id: 'vid_job_2' }),
			).resolves.toEqual(errored);

			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'GET',
					path: 'generations/video/vid_job_1',
				}),
			);
		});

		it('generations.getAltText fetches AI alt text', async () => {
			const mockResponse = {
				alt_text: { en: 'A serene beach landscape' },
				failed_languages: [],
				overridden_languages: [],
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Generations.getAltText(mockCtx, {
				url: 'https://assets.imgix.net/beach.jpg',
				language: 'en',
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'GET',
					path: 'generations/alt-text',
					query: {
						url: 'https://assets.imgix.net/beach.jpg',
						language: 'en',
					},
				}),
			);
		});

		it('generations.overrideAltText sends custom manual alt text overrides', async () => {
			const mockResponse = {
				alt_text: { en: 'Official brand beach background' },
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Generations.overrideAltText(mockCtx, {
				url: 'https://assets.imgix.net/beach.jpg',
				alt_text: { en: 'Official brand beach background' },
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledWith(
				'test-imgix-api-key',
				expect.objectContaining({
					method: 'POST',
					path: 'generations/alt-text',
					body: {
						url: 'https://assets.imgix.net/beach.jpg',
						alt_text: { en: 'Official brand beach background' },
					},
				}),
			);
		});

		it('generations.overrideAltText accepts null to remove an override', async () => {
			const mockResponse = {
				alt_text: { en: 'Official brand beach background' },
				removed_languages: ['fr'],
			};
			mockedRequest.mockResolvedValue(mockResponse);

			const result = await Generations.overrideAltText(mockCtx, {
				url: 'https://assets.imgix.net/beach.jpg',
				alt_text: { en: 'Official brand beach background', fr: null },
			});

			expect(result).toEqual(mockResponse);
			expect(mockedRequest.mock.calls[0]?.[1]?.body).toEqual({
				url: 'https://assets.imgix.net/beach.jpg',
				alt_text: { en: 'Official brand beach background', fr: null },
			});
		});
	});
});
