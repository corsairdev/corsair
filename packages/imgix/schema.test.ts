import {
	AssetsAddFromOriginInputSchema,
	AssetsAddFromOriginOutputSchema,
	AssetsGetInputSchema,
	AssetsGetOutputSchema,
	AssetsListInputSchema,
	AssetsListOutputSchema,
	AssetsUpdateInputSchema,
	AssetsUpdateOutputSchema,
	AssetsUploadInputSchema,
	AssetsUploadOutputSchema,
	GenerationsCreateVideoInputSchema,
	GenerationsCreateVideoOutputSchema,
	GenerationsGetAltTextInputSchema,
	GenerationsGetAltTextOutputSchema,
	GenerationsGetVideoJobInputSchema,
	GenerationsGetVideoJobOutputSchema,
	GenerationsOverrideAltTextInputSchema,
	GenerationsOverrideAltTextOutputSchema,
	ImgixEndpointInputSchemas,
	ImgixEndpointOutputSchemas,
	PurgesCreateInputSchema,
	PurgesCreateOutputSchema,
	ReportsGetInputSchema,
	ReportsGetOutputSchema,
	ReportsListInputSchema,
	ReportsListOutputSchema,
	SourcesCreateInputSchema,
	SourcesCreateOutputSchema,
	SourcesGetInputSchema,
	SourcesGetOutputSchema,
	SourcesListInputSchema,
	SourcesListOutputSchema,
	SourcesUpdateInputSchema,
	SourcesUpdateOutputSchema,
	UploadSessionsCancelInputSchema,
	UploadSessionsCancelOutputSchema,
	UploadSessionsCloseInputSchema,
	UploadSessionsCloseOutputSchema,
	UploadSessionsCreateInputSchema,
	UploadSessionsCreateOutputSchema,
	UploadSessionsGetStatusInputSchema,
	UploadSessionsGetStatusOutputSchema,
} from './endpoints/types';
import { imgixEndpointMeta, imgixEndpointSchemas } from './index';
import { ImgixSchema } from './schema';

describe('Imgix schema', () => {
	it('defines valid database version and entities object', () => {
		expect(ImgixSchema.version).toBeDefined();
		expect(ImgixSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(typeof ImgixSchema.entities).toBe('object');
		expect(ImgixSchema.entities).not.toBeNull();
	});

	it('keeps endpoint registry, schema map, and metadata key sets in exact sync', () => {
		const schemaKeys = Object.keys(imgixEndpointSchemas).sort();
		const metaKeys = Object.keys(imgixEndpointMeta).sort();
		const inputSchemaKeys = Object.keys(ImgixEndpointInputSchemas).sort();
		const outputSchemaKeys = Object.keys(ImgixEndpointOutputSchemas).sort();

		expect(schemaKeys).toEqual(metaKeys);
		expect(schemaKeys).toEqual(inputSchemaKeys);
		expect(schemaKeys).toEqual(outputSchemaKeys);
		expect(schemaKeys.length).toBe(20);
	});

	describe('Sources schemas', () => {
		it('validates SourcesListInputSchema and rejects unknown fields', () => {
			const valid = {
				filter_name: 'test-source',
				filter_deployment_type: 's3',
				filter_enabled: true,
				page_number: 1,
				page_size: 20,
			};
			expect(SourcesListInputSchema.parse(valid)).toEqual(valid);

			expect(() =>
				SourcesListInputSchema.parse({ ...valid, unexpected_field: 'hack' }),
			).toThrow();
		});

		it('validates SourcesListOutputSchema', () => {
			const output = {
				data: [
					{
						id: 'src_123',
						type: 'sources' as const,
						attributes: {
							name: 'Production S3',
							deployment_status: 'deployed',
							enabled: true,
						},
					},
				],
				meta: { total: 1 },
			};
			expect(SourcesListOutputSchema.parse(output)).toEqual(output);
		});

		it('validates SourcesCreateInputSchema requiring name and deployment_type', () => {
			const valid = {
				name: 'New GCS Source',
				deployment_type: 'gcs' as const,
				imgix_subdomains: ['my-gcs'],
				gcs_bucket: 'my-gcs-bucket',
				gcs_access_key: 'GOOG123',
			};
			expect(SourcesCreateInputSchema.parse(valid)).toEqual(valid);

			// `unknown` because testing runtime rejection of input missing required name
			const missingName: unknown = { deployment_type: 'gcs' };
			expect(() => SourcesCreateInputSchema.parse(missingName)).toThrow();

			// `unknown` because testing runtime rejection of invalid deployment type enum value
			const invalidDeployment: unknown = {
				name: 'Test',
				deployment_type: 'invalid',
			};
			expect(() => SourcesCreateInputSchema.parse(invalidDeployment)).toThrow();
		});

		it('validates SourcesCreateOutputSchema', () => {
			const output = {
				data: {
					id: 'src_456',
					type: 'sources' as const,
					attributes: {
						name: 'New S3 Source',
						deployment_status: 'deploying',
					},
				},
			};
			expect(SourcesCreateOutputSchema.parse(output)).toEqual(output);
		});

		it('validates SourcesGetInputSchema and OutputSchema', () => {
			expect(SourcesGetInputSchema.parse({ source_id: 'src_123' })).toEqual({
				source_id: 'src_123',
			});
			expect(() => SourcesGetInputSchema.parse({ source_id: '' })).toThrow();

			const output = {
				data: {
					id: 'src_123',
					type: 'sources' as const,
					attributes: {
						name: 'Retrieved Source',
					},
				},
			};
			expect(SourcesGetOutputSchema.parse(output)).toEqual(output);
		});

		it('validates SourcesUpdateInputSchema and OutputSchema', () => {
			const valid = {
				source_id: 'src_123',
				name: 'Updated Name',
				enabled: false,
			};
			expect(SourcesUpdateInputSchema.parse(valid)).toEqual(valid);

			const output = {
				data: {
					id: 'src_123',
					type: 'sources' as const,
					attributes: {
						name: 'Updated Name',
						enabled: false,
					},
				},
			};
			expect(SourcesUpdateOutputSchema.parse(output)).toEqual(output);
		});
	});

	describe('Assets schemas', () => {
		it('validates AssetsListInputSchema and OutputSchema', () => {
			const valid = {
				source_id: 'src_123',
				page_size: 50,
			};
			expect(AssetsListInputSchema.parse(valid)).toEqual(valid);

			const output = {
				data: [
					{
						id: 'src_123/image.png',
						type: 'assets' as const,
						attributes: {
							origin_path: 'image.png',
							content_type: 'image/png',
							file_size: 1024,
							width: 800,
							height: 600,
						},
					},
				],
			};
			expect(AssetsListOutputSchema.parse(output)).toEqual(output);
		});

		it('validates AssetsGetInputSchema and OutputSchema', () => {
			const valid = {
				source_id: 'src_123',
				origin_path: 'photos/vacation.jpg',
			};
			expect(AssetsGetInputSchema.parse(valid)).toEqual(valid);

			const output = {
				data: {
					id: 'src_123/photos/vacation.jpg',
					type: 'assets' as const,
					attributes: {
						origin_path: 'photos/vacation.jpg',
						custom_fields: { tag: 'beach', year: 2024 },
					},
				},
			};
			expect(AssetsGetOutputSchema.parse(output)).toEqual(output);
		});

		it('validates AssetsUpdateInputSchema requiring custom_fields', () => {
			const valid = {
				source_id: 'src_123',
				origin_path: 'banner.png',
				custom_fields: { campaign: 'holiday', discount: 15 },
			};
			expect(AssetsUpdateInputSchema.parse(valid)).toEqual(valid);

			const output = {
				data: {
					id: 'src_123/banner.png',
					type: 'assets' as const,
					attributes: {
						custom_fields: { campaign: 'holiday', discount: 15 },
					},
				},
			};
			expect(AssetsUpdateOutputSchema.parse(output)).toEqual(output);
		});

		it('validates AssetsAddFromOriginInputSchema and OutputSchema', () => {
			const valid = {
				source_id: 'src_123',
				origin_path: 'raw/product.jpg',
			};
			expect(AssetsAddFromOriginInputSchema.parse(valid)).toEqual(valid);
			expect(AssetsAddFromOriginOutputSchema.parse({})).toEqual({});
		});

		it('validates AssetsUploadInputSchema and OutputSchema', () => {
			const valid = {
				source_id: 'src_123',
				origin_path: 'uploads/file.png',
				content_base64: 'aGVsbG8=',
				overwrite: true,
			};
			expect(AssetsUploadInputSchema.parse(valid)).toEqual(valid);
			expect(AssetsUploadOutputSchema.parse({})).toEqual({});
		});
	});

	describe('UploadSessions schemas', () => {
		it('validates UploadSessionsCreateInputSchema and OutputSchema', () => {
			const valid = {
				source_id: 'src_123',
				origin_path: 'big-video.mp4',
			};
			expect(UploadSessionsCreateInputSchema.parse(valid)).toEqual(valid);

			const output = {
				data: {
					id: 'sess_abc',
					attributes: {
						url: 'https://s3.amazonaws.com/presigned-upload-url',
						session_id: 'sess_abc',
					},
				},
			};
			expect(UploadSessionsCreateOutputSchema.parse(output)).toEqual(output);
		});

		it('validates UploadSessionsGetStatusInputSchema and OutputSchema', () => {
			const valid = {
				source_id: 'src_123',
				session_id: 'sess_abc',
			};
			expect(UploadSessionsGetStatusInputSchema.parse(valid)).toEqual(valid);

			const output = {
				data: {
					id: 'sess_abc',
					attributes: {
						status: 'COMPLETE' as const,
					},
				},
			};
			expect(UploadSessionsGetStatusOutputSchema.parse(output)).toEqual(output);
		});

		it('validates UploadSessionsCloseInputSchema and CancelInputSchema', () => {
			const valid = {
				source_id: 'src_123',
				session_id: 'sess_abc',
			};
			expect(UploadSessionsCloseInputSchema.parse(valid)).toEqual(valid);
			expect(UploadSessionsCancelInputSchema.parse(valid)).toEqual(valid);
			expect(UploadSessionsCloseOutputSchema.parse({})).toEqual({});
			expect(UploadSessionsCancelOutputSchema.parse({})).toEqual({});
		});
	});

	describe('Purges schemas', () => {
		it('validates PurgesCreateInputSchema requiring a valid URL', () => {
			const valid = {
				url: 'https://assets.imgix.net/photo.jpg',
				source_id: 'src_123',
				sub_image: false,
			};
			expect(PurgesCreateInputSchema.parse(valid)).toEqual(valid);

			expect(() =>
				PurgesCreateInputSchema.parse({ url: 'not-a-url' }),
			).toThrow();
			expect(PurgesCreateOutputSchema.parse({})).toEqual({});
		});
	});

	describe('Reports schemas', () => {
		it('validates ReportsListInputSchema and OutputSchema', () => {
			const valid = {
				completed: true,
				report_type: 'cdn_logs',
				page_number: 1,
			};
			expect(ReportsListInputSchema.parse(valid)).toEqual(valid);

			const output = {
				data: [
					{
						id: 'rep_123',
						type: 'reports' as const,
						attributes: {
							completed: true,
							files: ['https://storage.googleapis.com/report.gz'],
							period_start: 1700000000,
							period_end: 1700086400,
							report_key: 'cdn_logs_20240101',
							report_type: 'cdn_logs',
						},
					},
				],
			};
			expect(ReportsListOutputSchema.parse(output)).toEqual(output);
		});

		it('validates ReportsGetInputSchema and OutputSchema', () => {
			const valid = { report_id: 'rep_123' };
			expect(ReportsGetInputSchema.parse(valid)).toEqual(valid);

			const output = {
				data: {
					id: 'rep_123',
					type: 'reports' as const,
					attributes: {
						completed: true,
						files: ['https://storage.googleapis.com/report.gz'],
						period_start: 1700000000,
						period_end: 1700086400,
						report_key: 'credit_analytics_20240101',
						report_type: 'credit_analytics_daily',
					},
				},
			};
			expect(ReportsGetOutputSchema.parse(output)).toEqual(output);
		});
	});

	describe('Generations (Video & AI) schemas', () => {
		it('validates GenerationsCreateVideoInputSchema and OutputSchema', () => {
			const valid = {
				url: 'https://assets.imgix.net/mountain.jpg',
				model: 'veo3.1' as const,
				prompt: 'Cinematic pan across the mountain landscape',
				duration: 6,
				aspect_ratio: '16:9' as const,
			};
			expect(GenerationsCreateVideoInputSchema.parse(valid)).toEqual(valid);
			// prompt is optional for the auto and klingai models
			expect(
				GenerationsCreateVideoInputSchema.parse({
					url: 'https://assets.imgix.net/mountain.jpg',
				}),
			).toEqual({ url: 'https://assets.imgix.net/mountain.jpg' });
			// `unknown` because testing runtime rejection of the old `source` field
			const withSource: unknown = {
				source: 'https://assets.imgix.net/mountain.jpg',
			};
			expect(() =>
				GenerationsCreateVideoInputSchema.parse(withSource),
			).toThrow();

			const output = {
				data: {
					type: 'job',
					id: 'job_vid_123',
					attributes: { status: 'started', created_at: 1792783178 },
				},
			};
			expect(GenerationsCreateVideoOutputSchema.parse(output)).toEqual(output);
		});

		it('validates GenerationsGetVideoJobInputSchema and OutputSchema', () => {
			const valid = { job_id: 'job_vid_123' };
			expect(GenerationsGetVideoJobInputSchema.parse(valid)).toEqual(valid);

			const output = {
				data: {
					type: 'job',
					id: 'job_vid_123',
					attributes: {
						status: 'ready',
						created_at: 1792783178,
						updated_at: 1792783410,
						result: { url: 'https://assets.imgix.net/mountain.jpg?itv=1' },
					},
				},
			};
			expect(GenerationsGetVideoJobOutputSchema.parse(output)).toEqual(output);
		});

		it('validates GenerationsGetAltTextInputSchema and OutputSchema', () => {
			const valid = {
				url: 'https://assets.imgix.net/logo.png',
				language: 'en',
				regenerate: false,
			};
			expect(GenerationsGetAltTextInputSchema.parse(valid)).toEqual(valid);

			const output = {
				alt_text: {
					en: 'A blue and white company logo',
					es: 'Un logotipo de empresa azul y blanco',
				},
			};
			expect(GenerationsGetAltTextOutputSchema.parse(output)).toEqual(output);
		});

		it('validates GenerationsOverrideAltTextInputSchema and OutputSchema', () => {
			const valid = {
				url: 'https://assets.imgix.net/logo.png',
				alt_text: {
					en: 'Official company brand emblem',
				},
			};
			expect(GenerationsOverrideAltTextInputSchema.parse(valid)).toEqual(valid);

			const output = {
				alt_text: {
					en: 'Official company brand emblem',
				},
			};
			expect(GenerationsOverrideAltTextOutputSchema.parse(output)).toEqual(
				output,
			);
		});
	});
});
