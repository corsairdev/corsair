import * as schemas from './endpoints/types';
import { MagicHourSchema } from './schema';
import { magichourEntities } from './schema/database';

describe('MagicHour schema', () => {
	it('declares a semver version', () => {
		expect(MagicHourSchema.version).toBeDefined();
		expect(MagicHourSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(MagicHourSchema.entities).toBe(magichourEntities);
		expect(MagicHourSchema.entities).toEqual({});
	});
});

// A minimal structural view of a zod schema. It matches every exported schema
// without importing zod's generic types, and lets the table below stay a plain
// array instead of a union of incompatible function signatures.
type Parseable = {
	safeParse: (data: unknown) => { success: boolean };
};

type SchemaCase = {
	name: string;
	schema: Parseable;
	valid: unknown;
	invalid: unknown;
};

function caseOf(
	name: string,
	schema: Parseable,
	valid: unknown,
	invalid: unknown,
): SchemaCase {
	return { name, schema, valid, invalid };
}

// Fixtures mirror the success shapes in the OpenAPI spec at
// https://docs.magichour.ai/api-reference/openapi.json.
const generate = { id: 'proj_1', credits_charged: 5 };

const account = {
	id: 'acct_1',
	email: 'user@example.com',
	tier: 'pro',
	credits: 100,
	subscription: {
		name: 'Pro',
		status: 'active',
		price: { amount: 4900, currency: 'usd' },
		discount: null,
		billing_interval: 'month',
		current_period_end: '2026-01-01T00:00:00Z',
		cancel_at_period_end: false,
	},
};

const savedItem = {
	id: 'item_1',
	type: 'character',
	name: 'Hero',
	assets: [
		{
			file_path: 'files/hero.png',
			media_kind: 'IMAGE',
			is_primary: true,
			url: 'https://cdn.example/hero.png',
			url_expires_at: '2026-01-02T00:00:00Z',
		},
	],
};

const videoProject = {
	id: 'v_1',
	name: 'My video',
	status: 'complete',
	type: 'TEXT_TO_VIDEO',
	created_at: '2026-01-01T00:00:00Z',
	width: 1920,
	height: 1080,
	enabled: true,
	start_seconds: 0,
	end_seconds: 5,
	credits_charged: 10,
	fps: 24,
	error: null,
	downloads: [
		{ url: 'https://cdn.example/v.mp4', expires_at: '2026-01-02T00:00:00Z' },
	],
};

const imageProject = {
	id: 'i_1',
	name: 'My image',
	status: 'complete',
	image_count: 4,
	type: 'AI_IMAGE_GENERATOR',
	created_at: '2026-01-01T00:00:00Z',
	enabled: true,
	credits_charged: 5,
	error: null,
	downloads: [
		{ url: 'https://cdn.example/i.png', expires_at: '2026-01-02T00:00:00Z' },
	],
};

const audioProject = {
	id: 'a_1',
	name: 'My audio',
	status: 'complete',
	type: 'VOICE_GENERATOR',
	created_at: '2026-01-01T00:00:00Z',
	enabled: true,
	credits_charged: 3,
	error: null,
	downloads: [
		{ url: 'https://cdn.example/a.mp3', expires_at: '2026-01-02T00:00:00Z' },
	],
};

const inputCases: SchemaCase[] = [
	caseOf('accountGet', schemas.AccountGetInputSchema, {}, null),
	caseOf(
		'filesGenerateUploadUrls',
		schemas.FilesGenerateUploadUrlsInputSchema,
		{ items: [{ type: 'video', extension: 'mp4' }] },
		{ items: [] },
	),
	caseOf(
		'filesSavedItemsList',
		schemas.FilesSavedItemsListInputSchema,
		{},
		{
			limit: 0,
		},
	),
	caseOf(
		'faceDetectionDetect',
		schemas.FaceDetectionDetectInputSchema,
		{ assets: { target_file_path: 'a.png' } },
		{ assets: {} },
	),
	caseOf(
		'faceDetectionGetDetails',
		schemas.FaceDetectionGetDetailsInputSchema,
		{
			id: 'x',
		},
		{},
	),
	caseOf(
		'videoProjectsGetDetails',
		schemas.VideoProjectsGetDetailsInputSchema,
		{
			id: 'x',
		},
		{},
	),
	caseOf(
		'videoProjectsDelete',
		schemas.VideoProjectsDeleteInputSchema,
		{
			id: 'x',
		},
		{},
	),
	caseOf(
		'videosTalkingPhoto',
		schemas.VideosTalkingPhotoInputSchema,
		{
			start_seconds: 0,
			end_seconds: 2,
			assets: { image_file_path: 'a.png', audio_file_path: 'a.mp3' },
		},
		{},
	),
	caseOf(
		'videosUgcAd',
		schemas.VideosUgcAdInputSchema,
		{ assets: { image_file_path: 'a.png' }, script: 'Hello', end_seconds: 5 },
		{ assets: { image_file_path: 'a.png' }, end_seconds: 5 },
	),
	caseOf(
		'videosVideoEditor',
		schemas.VideosVideoEditorInputSchema,
		{
			end_seconds: 2,
			style: { prompt: 'warm' },
			assets: { video_file_path: 'a.mp4' },
		},
		{ end_seconds: 2, assets: { video_file_path: 'a.mp4' } },
	),
	caseOf(
		'videosVideoTranslator',
		schemas.VideosVideoTranslatorInputSchema,
		{
			end_seconds: 2,
			target_language: 'Spanish',
			assets: { video_file_path: 'a.mp4' },
		},
		{ end_seconds: 2, assets: { video_file_path: 'a.mp4' } },
	),
	caseOf(
		'videosAnimation',
		schemas.VideosAnimationInputSchema,
		{
			fps: 12,
			end_seconds: 2,
			height: 512,
			width: 512,
			style: {
				art_style: 'Painterly Illustration',
				camera_effect: 'Simple Zoom In',
				prompt_type: 'custom',
				transition_speed: 5,
			},
			assets: { audio_source: 'none' },
		},
		{ end_seconds: 2, height: 512, width: 512, style: {}, assets: {} },
	),
	caseOf(
		'videosAudioToVideo',
		schemas.VideosAudioToVideoInputSchema,
		{ end_seconds: 2, assets: { audio_file_path: 'a.mp3' } },
		{ assets: { audio_file_path: 'a.mp3' } },
	),
	caseOf(
		'videosAutoSubtitleGenerator',
		schemas.VideosAutoSubtitleGeneratorInputSchema,
		{
			start_seconds: 0,
			end_seconds: 2,
			assets: { video_file_path: 'a.mp4' },
			style: {},
		},
		{ start_seconds: 0, end_seconds: 2, assets: { video_file_path: 'a.mp4' } },
	),
	caseOf(
		'videosCharacterReplace',
		schemas.VideosCharacterReplaceInputSchema,
		{
			end_seconds: 2,
			assets: { video_file_path: 'a.mp4', image_file_path: 'a.png' },
		},
		{ end_seconds: 2 },
	),
	caseOf(
		'videosFaceSwap',
		schemas.VideosFaceSwapInputSchema,
		{ start_seconds: 0, end_seconds: 2, assets: { video_source: 'file' } },
		{ start_seconds: 0, end_seconds: 2, assets: {} },
	),
	caseOf(
		'videosImageToVideo',
		schemas.VideosImageToVideoInputSchema,
		{ end_seconds: 5, assets: { image_file_path: 'a.png' } },
		{ end_seconds: 5 },
	),
	caseOf(
		'videosLipSync',
		schemas.VideosLipSyncInputSchema,
		{
			start_seconds: 0,
			end_seconds: 2,
			assets: { audio_file_path: 'a.mp3', video_source: 'file' },
		},
		{ start_seconds: 0, end_seconds: 2 },
	),
	caseOf(
		'videosTextToVideo',
		schemas.VideosTextToVideoInputSchema,
		{ end_seconds: 5, style: { prompt: 'a cat surfing' } },
		{ end_seconds: 5 },
	),
	caseOf(
		'videosVideoToVideo',
		schemas.VideosVideoToVideoInputSchema,
		{
			start_seconds: 0,
			end_seconds: 2,
			style: { art_style: 'Anime' },
			assets: { video_source: 'file' },
		},
		{ start_seconds: 0, end_seconds: 2, assets: { video_source: 'file' } },
	),
	caseOf(
		'imageProjectsGetDetails',
		schemas.ImageProjectsGetDetailsInputSchema,
		{
			id: 'x',
		},
		{},
	),
	caseOf(
		'imageProjectsDelete',
		schemas.ImageProjectsDeleteInputSchema,
		{
			id: 'x',
		},
		{},
	),
	caseOf(
		'imagesClothesChanger',
		schemas.ImagesClothesChangerInputSchema,
		{ assets: { person_file_path: 'p.png', garment_file_path: 'g.png' } },
		{ assets: { person_file_path: 'p.png' } },
	),
	caseOf(
		'imagesFaceEditor',
		schemas.ImagesFaceEditorInputSchema,
		{ assets: { image_file_path: 'a.png' }, style: { mouth_smile: 10 } },
		{ assets: { image_file_path: 'a.png' } },
	),
	caseOf(
		'imagesGifGenerator',
		schemas.ImagesGifGeneratorInputSchema,
		{ style: { prompt: 'a spinning cube' } },
		{ style: {} },
	),
	caseOf(
		'imagesHeadshotGenerator',
		schemas.ImagesHeadshotGeneratorInputSchema,
		{ assets: { image_file_path: 'a.png' } },
		{},
	),
	caseOf(
		'imagesImageEditor',
		schemas.ImagesImageEditorInputSchema,
		{ style: { prompt: 'add a hat' }, assets: {} },
		{ assets: {} },
	),
	caseOf(
		'imagesImageGenerator',
		schemas.ImagesImageGeneratorInputSchema,
		{ image_count: 2, style: { prompt: 'a cat' } },
		{ style: { prompt: 'a cat' } },
	),
	caseOf(
		'imagesImageUpscaler',
		schemas.ImagesImageUpscalerInputSchema,
		{ scale_factor: 2, assets: { image_file_path: 'a.png' } },
		{ scale_factor: 3, assets: { image_file_path: 'a.png' } },
	),
	caseOf(
		'imagesMemeGenerator',
		schemas.ImagesMemeGeneratorInputSchema,
		{ style: { topic: 'cats', template: 'Doge' } },
		{ style: { topic: 'cats' } },
	),
	caseOf(
		'imagesQrCodeGenerator',
		schemas.ImagesQrCodeGeneratorInputSchema,
		{ content: 'https://example.com', style: { art_style: 'Watercolor' } },
		{ content: 'https://example.com' },
	),
	caseOf(
		'imagesBodySwap',
		schemas.ImagesBodySwapInputSchema,
		{
			resolution: '1k',
			assets: { person_file_path: 'p.png', scene_file_path: 's.png' },
		},
		{ assets: { person_file_path: 'p.png', scene_file_path: 's.png' } },
	),
	caseOf(
		'imagesFaceSwapPhoto',
		schemas.ImagesFaceSwapPhotoInputSchema,
		{ assets: { target_file_path: 't.png' } },
		{},
	),
	caseOf(
		'imagesHeadSwap',
		schemas.ImagesHeadSwapInputSchema,
		{ assets: { body_file_path: 'b.png', head_file_path: 'h.png' } },
		{ assets: { body_file_path: 'b.png' } },
	),
	caseOf(
		'imagesBackgroundRemover',
		schemas.ImagesBackgroundRemoverInputSchema,
		{ assets: { image_file_path: 'a.png' } },
		{},
	),
	caseOf(
		'imagesPhotoColorizer',
		schemas.ImagesPhotoColorizerInputSchema,
		{ assets: { image_file_path: 'a.png' } },
		{},
	),
	caseOf(
		'audioProjectsGetDetails',
		schemas.AudioProjectsGetDetailsInputSchema,
		{
			id: 'x',
		},
		{},
	),
	caseOf(
		'audioProjectsDelete',
		schemas.AudioProjectsDeleteInputSchema,
		{
			id: 'x',
		},
		{},
	),
	caseOf(
		'audioVoiceGenerator',
		schemas.AudioVoiceGeneratorInputSchema,
		{ style: { prompt: 'Hello', voice_name: 'Morgan Freeman' } },
		{},
	),
	caseOf(
		'audioVoiceCloner',
		schemas.AudioVoiceClonerInputSchema,
		{ assets: { audio_file_path: 'a.mp3' }, style: { prompt: 'Hello' } },
		{ style: { prompt: 'Hello' } },
	),
];

const outputCases: SchemaCase[] = [
	caseOf('accountGet', schemas.AccountGetResponseSchema, account, {}),
	caseOf(
		'filesGenerateUploadUrls',
		schemas.FilesGenerateUploadUrlsResponseSchema,
		{
			items: [
				{
					upload_url: 'https://upload.example/abc',
					expires_at: '2026-01-02T00:00:00Z',
					file_path: 'files/abc.mp4',
				},
			],
		},
		{ items: [{ upload_url: 'https://upload.example/abc' }] },
	),
	caseOf(
		'filesSavedItemsList',
		schemas.FilesSavedItemsListResponseSchema,
		{ items: [savedItem], next_cursor: null },
		{ items: [{}], next_cursor: null },
	),
	caseOf(
		'faceDetectionDetect',
		schemas.FaceDetectionDetectResponseSchema,
		generate,
		{
			id: 'x',
		},
	),
	caseOf(
		'faceDetectionGetDetails',
		schemas.FaceDetectionGetDetailsResponseSchema,
		{
			id: 'fd_1',
			credits_charged: 1,
			status: 'complete',
			faces: [{ path: 'faces/1.png', url: 'https://cdn.example/face.png' }],
		},
		{ id: 'fd_1', credits_charged: 1, status: 'complete' },
	),
	caseOf(
		'videoProjectsGetDetails',
		schemas.VideoProjectResponseSchema,
		videoProject,
		{},
	),
	caseOf(
		'videoProjectsDelete',
		schemas.VideoProjectsDeleteResponseSchema,
		undefined,
		'x',
	),
	caseOf(
		'videosTalkingPhoto',
		schemas.VideosTalkingPhotoResponseSchema,
		generate,
		{},
	),
	caseOf('videosUgcAd', schemas.VideosUgcAdResponseSchema, generate, {}),
	caseOf(
		'videosVideoEditor',
		schemas.VideosVideoEditorResponseSchema,
		generate,
		{},
	),
	caseOf(
		'videosVideoTranslator',
		schemas.VideosVideoTranslatorResponseSchema,
		generate,
		{},
	),
	caseOf(
		'videosAnimation',
		schemas.VideosAnimationResponseSchema,
		generate,
		{},
	),
	caseOf(
		'videosAudioToVideo',
		schemas.VideosAudioToVideoResponseSchema,
		generate,
		{},
	),
	caseOf(
		'videosAutoSubtitleGenerator',
		schemas.VideosAutoSubtitleGeneratorResponseSchema,
		generate,
		{},
	),
	caseOf(
		'videosCharacterReplace',
		schemas.VideosCharacterReplaceResponseSchema,
		generate,
		{},
	),
	caseOf('videosFaceSwap', schemas.VideosFaceSwapResponseSchema, generate, {}),
	caseOf(
		'videosImageToVideo',
		schemas.VideosImageToVideoResponseSchema,
		generate,
		{},
	),
	caseOf('videosLipSync', schemas.VideosLipSyncResponseSchema, generate, {}),
	caseOf(
		'videosTextToVideo',
		schemas.VideosTextToVideoResponseSchema,
		generate,
		{},
	),
	caseOf(
		'videosVideoToVideo',
		schemas.VideosVideoToVideoResponseSchema,
		generate,
		{},
	),
	caseOf(
		'imageProjectsGetDetails',
		schemas.ImageProjectResponseSchema,
		imageProject,
		{},
	),
	caseOf(
		'imageProjectsDelete',
		schemas.ImageProjectsDeleteResponseSchema,
		undefined,
		'x',
	),
	caseOf(
		'imagesClothesChanger',
		schemas.ImagesClothesChangerResponseSchema,
		generate,
		{},
	),
	caseOf(
		'imagesFaceEditor',
		schemas.ImagesFaceEditorResponseSchema,
		generate,
		{},
	),
	caseOf(
		'imagesGifGenerator',
		schemas.ImagesGifGeneratorResponseSchema,
		generate,
		{},
	),
	caseOf(
		'imagesHeadshotGenerator',
		schemas.ImagesHeadshotGeneratorResponseSchema,
		generate,
		{},
	),
	caseOf(
		'imagesImageEditor',
		schemas.ImagesImageEditorResponseSchema,
		generate,
		{},
	),
	caseOf(
		'imagesImageGenerator',
		schemas.ImagesImageGeneratorResponseSchema,
		generate,
		{},
	),
	caseOf(
		'imagesImageUpscaler',
		schemas.ImagesImageUpscalerResponseSchema,
		generate,
		{},
	),
	caseOf(
		'imagesMemeGenerator',
		schemas.ImagesMemeGeneratorResponseSchema,
		generate,
		{},
	),
	caseOf(
		'imagesQrCodeGenerator',
		schemas.ImagesQrCodeGeneratorResponseSchema,
		generate,
		{},
	),
	caseOf('imagesBodySwap', schemas.ImagesBodySwapResponseSchema, generate, {}),
	caseOf(
		'imagesFaceSwapPhoto',
		schemas.ImagesFaceSwapPhotoResponseSchema,
		generate,
		{},
	),
	caseOf('imagesHeadSwap', schemas.ImagesHeadSwapResponseSchema, generate, {}),
	caseOf(
		'imagesBackgroundRemover',
		schemas.ImagesBackgroundRemoverResponseSchema,
		generate,
		{},
	),
	caseOf(
		'imagesPhotoColorizer',
		schemas.ImagesPhotoColorizerResponseSchema,
		generate,
		{},
	),
	caseOf(
		'audioProjectsGetDetails',
		schemas.AudioProjectResponseSchema,
		audioProject,
		{},
	),
	caseOf(
		'audioProjectsDelete',
		schemas.AudioProjectsDeleteResponseSchema,
		undefined,
		'x',
	),
	caseOf(
		'audioVoiceGenerator',
		schemas.AudioVoiceGeneratorResponseSchema,
		generate,
		{},
	),
	caseOf(
		'audioVoiceCloner',
		schemas.AudioVoiceClonerResponseSchema,
		generate,
		{},
	),
];

describe('Magic Hour input schemas', () => {
	it('covers every implemented endpoint', () => {
		expect(inputCases).toHaveLength(
			Object.keys(schemas.MagicHourEndpointInputSchemas).length,
		);
	});

	for (const entry of inputCases) {
		it(`${entry.name} accepts a valid payload and rejects an invalid one`, () => {
			expect(entry.schema.safeParse(entry.valid).success).toBe(true);
			expect(entry.schema.safeParse(entry.invalid).success).toBe(false);
		});
	}
});

describe('Magic Hour output schemas', () => {
	it('covers every implemented endpoint', () => {
		expect(outputCases).toHaveLength(
			Object.keys(schemas.MagicHourEndpointOutputSchemas).length,
		);
	});

	for (const entry of outputCases) {
		it(`${entry.name} parses a valid response and rejects an invalid one`, () => {
			expect(entry.schema.safeParse(entry.valid).success).toBe(true);
			expect(entry.schema.safeParse(entry.invalid).success).toBe(false);
		});
	}
});
