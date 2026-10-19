import { AuthMissingError, logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Account,
	Audio,
	AudioProjects,
	FaceDetection,
	Files,
	ImageProjects,
	Images,
	VideoProjects,
	Videos,
} from './endpoints';
import type { MagicHourEndpointInputs } from './endpoints/types';
import type {
	MagicHourContext,
	MagicHourKeyBuilderContext,
	MagicHourPluginOptions,
} from './index';
import {
	MagicHourEndpointInputSchemas,
	magicHourEndpointMeta,
	magicHourEndpointSchemas,
	magichour,
} from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeMagicHourRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeMagicHourRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Account.get>[0];

function buildCtx(): Ctx {
	const ctx: MagicHourContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

// Minimal fixtures mirroring the success shapes in the OpenAPI spec at
// https://docs.magichour.ai/api-reference/openapi.json.
const generateFixture = { id: 'proj_123', credits_charged: 10 };

const accountFixture = {
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

const uploadUrlsFixture = {
	items: [
		{
			upload_url: 'https://upload.example/abc',
			expires_at: '2026-01-02T00:00:00Z',
			file_path: 'files/abc.mp4',
		},
	],
};

const savedItemsFixture = {
	items: [
		{
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
		},
	],
	next_cursor: null,
};

const faceDetectionFixture = {
	id: 'fd_1',
	credits_charged: 1,
	status: 'complete',
	faces: [{ path: 'faces/1.png', url: 'https://cdn.example/face.png' }],
};

const videoProjectFixture = {
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

const imageProjectFixture = {
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

const audioProjectFixture = {
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

// Table entry for the create endpoints. Each input is annotated with the
// endpoint's declared input type so enum literals stay narrow, and the call is
// captured in `execute` so the loop can invoke it without a shared signature.
type CreateCase = {
	name: string;
	path: string;
	event: string;
	input: unknown;
	execute: () => Promise<unknown>;
};

describe('account.get', () => {
	it('fetches the account and logs only the event name', async () => {
		mockedRequest.mockResolvedValue(accountFixture);

		const result = await Account.get(ctx, {});

		expect(result).toEqual(accountFixture);
		expect(mockedRequest).toHaveBeenCalledWith('/v1/account', 'test-api-key', {
			method: 'GET',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'magichour.account.get',
			{},
			'completed',
		);
		// The email is PII and must never appear in the logged event.
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('user@example.com');
	});
});

describe('files.generateUploadUrls', () => {
	it('posts the upload request items and returns the pre-signed URLs', async () => {
		mockedRequest.mockResolvedValue(uploadUrlsFixture);

		const result = await Files.generateUploadUrls(ctx, {
			items: [{ type: 'video', extension: 'mp4' }],
		});

		expect(result).toEqual(uploadUrlsFixture);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/files/upload-urls',
			'test-api-key',
			{
				method: 'POST',
				body: { items: [{ type: 'video', extension: 'mp4' }] },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'magichour.files.generateUploadUrls',
			{ count: 1 },
			'completed',
		);
	});

	it('rejects an empty items array before calling the API', async () => {
		await expect(
			Files.generateUploadUrls(ctx, { items: [] }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('files.savedItemsList', () => {
	it('passes filters as query params and returns saved items', async () => {
		mockedRequest.mockResolvedValue(savedItemsFixture);

		const result = await Files.savedItemsList(ctx, {
			type: 'voice',
			limit: 10,
			cursor: 'abc',
		});

		expect(result).toEqual(savedItemsFixture);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/saved-items',
			'test-api-key',
			{
				method: 'GET',
				query: { type: 'voice', limit: 10, cursor: 'abc' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'magichour.files.savedItemsList',
			{ count: 1 },
			'completed',
		);
	});
});

describe('faceDetection.detect', () => {
	it('starts a detection task', async () => {
		mockedRequest.mockResolvedValue(generateFixture);

		const result = await FaceDetection.detect(ctx, {
			confidence_score: 0.5,
			assets: { target_file_path: 'files/a.png' },
		});

		expect(result).toEqual(generateFixture);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/face-detection',
			'test-api-key',
			{
				method: 'POST',
				body: {
					confidence_score: 0.5,
					assets: { target_file_path: 'files/a.png' },
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'magichour.faceDetection.detect',
			{ id: 'proj_123' },
			'completed',
		);
	});
});

describe('faceDetection.getDetails', () => {
	it('gets the detected faces', async () => {
		mockedRequest.mockResolvedValue(faceDetectionFixture);

		const result = await FaceDetection.getDetails(ctx, { id: 'fd_1' });

		expect(result).toEqual(faceDetectionFixture);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/face-detection/fd_1',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'magichour.faceDetection.getDetails',
			{ id: 'fd_1', faceCount: 1 },
			'completed',
		);
	});
});

describe('videoProjects.getDetails', () => {
	it('returns project status and downloads', async () => {
		mockedRequest.mockResolvedValue(videoProjectFixture);

		const result = await VideoProjects.getDetails(ctx, { id: 'v_1' });

		expect(result).toEqual(videoProjectFixture);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/video-projects/v_1',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'magichour.videoProjects.getDetails',
			{ id: 'v_1', status: 'complete' },
			'completed',
		);
	});
});

describe('videoProjects.delete', () => {
	it('deletes the project and returns nothing', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await VideoProjects.deleteVideo(ctx, { id: 'v_1' });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/video-projects/v_1',
			'test-api-key',
			{ method: 'DELETE' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'magichour.videoProjects.delete',
			{ id: 'v_1' },
			'completed',
		);
	});
});

describe('project id path safety', () => {
	it('rejects an empty project id before calling the API', async () => {
		await expect(VideoProjects.getDetails(ctx, { id: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('encodes an id containing a slash in the outgoing URL', async () => {
		mockedRequest.mockResolvedValue(videoProjectFixture);

		await VideoProjects.getDetails(ctx, { id: 'a/b' });

		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/video-projects/a%2Fb',
			'test-api-key',
			{ method: 'GET' },
		);
	});

	it('encodes a path-traversal id in the outgoing DELETE URL', async () => {
		mockedRequest.mockResolvedValue(undefined);

		await VideoProjects.deleteVideo(ctx, {
			id: 'x/../../image-projects/other',
		});

		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/video-projects/x%2F..%2F..%2Fimage-projects%2Fother',
			'test-api-key',
			{ method: 'DELETE' },
		);
	});
});

describe('videos create operations', () => {
	const talkingPhotoInput: MagicHourEndpointInputs['videosTalkingPhoto'] = {
		start_seconds: 0,
		end_seconds: 2,
		assets: { image_file_path: 'a.png', audio_file_path: 'a.mp3' },
	};
	const ugcAdInput: MagicHourEndpointInputs['videosUgcAd'] = {
		assets: { image_file_path: 'a.png' },
		script: 'Hello world',
		end_seconds: 5,
	};
	const videoEditorInput: MagicHourEndpointInputs['videosVideoEditor'] = {
		end_seconds: 2,
		style: { prompt: 'make it warm' },
		assets: { video_file_path: 'a.mp4' },
	};
	const videoTranslatorInput: MagicHourEndpointInputs['videosVideoTranslator'] =
		{
			end_seconds: 2,
			target_language: 'Spanish',
			assets: { video_file_path: 'a.mp4' },
		};
	const animationInput: MagicHourEndpointInputs['videosAnimation'] = {
		fps: 12,
		end_seconds: 2,
		height: 512,
		width: 512,
		style: {
			art_style: 'Painterly Illustration',
			camera_effect: 'Simple Zoom In',
			prompt_type: 'custom',
			prompt: 'a dream',
			transition_speed: 5,
		},
		assets: { audio_source: 'none' },
	};
	const audioToVideoInput: MagicHourEndpointInputs['videosAudioToVideo'] = {
		end_seconds: 2,
		assets: { audio_file_path: 'a.mp3' },
	};
	const autoSubtitleInput: MagicHourEndpointInputs['videosAutoSubtitleGenerator'] =
		{
			start_seconds: 0,
			end_seconds: 2,
			assets: { video_file_path: 'a.mp4' },
			style: { template: 'karaoke' },
		};
	const characterReplaceInput: MagicHourEndpointInputs['videosCharacterReplace'] =
		{
			end_seconds: 2,
			assets: { video_file_path: 'a.mp4', image_file_path: 'a.png' },
		};
	const faceSwapInput: MagicHourEndpointInputs['videosFaceSwap'] = {
		start_seconds: 0,
		end_seconds: 2,
		assets: {
			video_source: 'file',
			video_file_path: 'a.mp4',
			image_file_path: 'a.png',
		},
	};
	const imageToVideoInput: MagicHourEndpointInputs['videosImageToVideo'] = {
		end_seconds: 5,
		assets: { image_file_path: 'a.png' },
	};
	const lipSyncInput: MagicHourEndpointInputs['videosLipSync'] = {
		start_seconds: 0,
		end_seconds: 2,
		assets: {
			audio_file_path: 'a.mp3',
			video_source: 'file',
			video_file_path: 'a.mp4',
		},
	};
	const textToVideoInput: MagicHourEndpointInputs['videosTextToVideo'] = {
		end_seconds: 5,
		style: { prompt: 'a cat surfing' },
	};
	const videoToVideoInput: MagicHourEndpointInputs['videosVideoToVideo'] = {
		start_seconds: 0,
		end_seconds: 2,
		style: { art_style: 'Anime' },
		assets: { video_source: 'file', video_file_path: 'a.mp4' },
	};

	const cases: CreateCase[] = [
		{
			name: 'talkingPhoto',
			path: '/v1/ai-talking-photo',
			event: 'magichour.videos.talkingPhoto',
			input: talkingPhotoInput,
			execute: () => Videos.talkingPhoto(ctx, talkingPhotoInput),
		},
		{
			name: 'ugcAd',
			path: '/v1/ai-ugc-ad',
			event: 'magichour.videos.ugcAd',
			input: ugcAdInput,
			execute: () => Videos.ugcAd(ctx, ugcAdInput),
		},
		{
			name: 'videoEditor',
			path: '/v1/ai-video-editor',
			event: 'magichour.videos.videoEditor',
			input: videoEditorInput,
			execute: () => Videos.videoEditor(ctx, videoEditorInput),
		},
		{
			name: 'videoTranslator',
			path: '/v1/ai-video-translator',
			event: 'magichour.videos.videoTranslator',
			input: videoTranslatorInput,
			execute: () => Videos.videoTranslator(ctx, videoTranslatorInput),
		},
		{
			name: 'animation',
			path: '/v1/animation',
			event: 'magichour.videos.animation',
			input: animationInput,
			execute: () => Videos.animation(ctx, animationInput),
		},
		{
			name: 'audioToVideo',
			path: '/v1/audio-to-video',
			event: 'magichour.videos.audioToVideo',
			input: audioToVideoInput,
			execute: () => Videos.audioToVideo(ctx, audioToVideoInput),
		},
		{
			name: 'autoSubtitleGenerator',
			path: '/v1/auto-subtitle-generator',
			event: 'magichour.videos.autoSubtitleGenerator',
			input: autoSubtitleInput,
			execute: () => Videos.autoSubtitleGenerator(ctx, autoSubtitleInput),
		},
		{
			name: 'characterReplace',
			path: '/v1/character-replace',
			event: 'magichour.videos.characterReplace',
			input: characterReplaceInput,
			execute: () => Videos.characterReplace(ctx, characterReplaceInput),
		},
		{
			name: 'faceSwap',
			path: '/v1/face-swap',
			event: 'magichour.videos.faceSwap',
			input: faceSwapInput,
			execute: () => Videos.faceSwap(ctx, faceSwapInput),
		},
		{
			name: 'imageToVideo',
			path: '/v1/image-to-video',
			event: 'magichour.videos.imageToVideo',
			input: imageToVideoInput,
			execute: () => Videos.imageToVideo(ctx, imageToVideoInput),
		},
		{
			name: 'lipSync',
			path: '/v1/lip-sync',
			event: 'magichour.videos.lipSync',
			input: lipSyncInput,
			execute: () => Videos.lipSync(ctx, lipSyncInput),
		},
		{
			name: 'textToVideo',
			path: '/v1/text-to-video',
			event: 'magichour.videos.textToVideo',
			input: textToVideoInput,
			execute: () => Videos.textToVideo(ctx, textToVideoInput),
		},
		{
			name: 'videoToVideo',
			path: '/v1/video-to-video',
			event: 'magichour.videos.videoToVideo',
			input: videoToVideoInput,
			execute: () => Videos.videoToVideo(ctx, videoToVideoInput),
		},
	];

	for (const testCase of cases) {
		it(`${testCase.name} posts to ${testCase.path} and returns the project id`, async () => {
			mockedRequest.mockResolvedValue(generateFixture);

			const result = await testCase.execute();

			expect(result).toEqual(generateFixture);
			expect(mockedRequest).toHaveBeenCalledWith(
				testCase.path,
				'test-api-key',
				{ method: 'POST', body: testCase.input },
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				testCase.event,
				{ id: 'proj_123' },
				'completed',
			);
		});
	}

	it('never logs the input prompt, script, or file paths', async () => {
		mockedRequest.mockResolvedValue(generateFixture);

		await Videos.textToVideo(ctx, {
			end_seconds: 5,
			style: { prompt: 'super-secret-prompt' },
		});

		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('super-secret-prompt');
	});
});

describe('imageProjects', () => {
	it('getDetails returns the image project status', async () => {
		mockedRequest.mockResolvedValue(imageProjectFixture);

		const result = await ImageProjects.getDetails(ctx, { id: 'i_1' });

		expect(result).toEqual(imageProjectFixture);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/image-projects/i_1',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'magichour.imageProjects.getDetails',
			{ id: 'i_1', status: 'complete' },
			'completed',
		);
	});

	it('delete removes the image project', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await ImageProjects.deleteImage(ctx, { id: 'i_1' });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/image-projects/i_1',
			'test-api-key',
			{ method: 'DELETE' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'magichour.imageProjects.delete',
			{ id: 'i_1' },
			'completed',
		);
	});
});

describe('images create operations', () => {
	const clothesChangerInput: MagicHourEndpointInputs['imagesClothesChanger'] = {
		assets: { person_file_path: 'p.png', garment_file_path: 'g.png' },
	};
	const faceEditorInput: MagicHourEndpointInputs['imagesFaceEditor'] = {
		assets: { image_file_path: 'a.png' },
		style: { mouth_smile: 10 },
	};
	const gifGeneratorInput: MagicHourEndpointInputs['imagesGifGenerator'] = {
		style: { prompt: 'a spinning cube' },
	};
	const headshotInput: MagicHourEndpointInputs['imagesHeadshotGenerator'] = {
		assets: { image_file_path: 'a.png' },
	};
	const imageEditorInput: MagicHourEndpointInputs['imagesImageEditor'] = {
		style: { prompt: 'add a hat' },
		assets: { image_file_paths: ['a.png'] },
	};
	const imageGeneratorInput: MagicHourEndpointInputs['imagesImageGenerator'] = {
		image_count: 2,
		style: { prompt: 'a cat' },
	};
	const imageUpscalerInput: MagicHourEndpointInputs['imagesImageUpscaler'] = {
		scale_factor: 2,
		assets: { image_file_path: 'a.png' },
	};
	const memeGeneratorInput: MagicHourEndpointInputs['imagesMemeGenerator'] = {
		style: { topic: 'cats', template: 'Doge' },
	};
	const qrCodeInput: MagicHourEndpointInputs['imagesQrCodeGenerator'] = {
		content: 'https://example.com',
		style: { art_style: 'Watercolor' },
	};
	const bodySwapInput: MagicHourEndpointInputs['imagesBodySwap'] = {
		resolution: '1k',
		assets: { person_file_path: 'p.png', scene_file_path: 's.png' },
	};
	const faceSwapPhotoInput: MagicHourEndpointInputs['imagesFaceSwapPhoto'] = {
		assets: { target_file_path: 't.png', source_file_path: 's.png' },
	};
	const headSwapInput: MagicHourEndpointInputs['imagesHeadSwap'] = {
		assets: { body_file_path: 'b.png', head_file_path: 'h.png' },
	};
	const backgroundRemoverInput: MagicHourEndpointInputs['imagesBackgroundRemover'] =
		{
			assets: { image_file_path: 'a.png' },
		};
	const photoColorizerInput: MagicHourEndpointInputs['imagesPhotoColorizer'] = {
		assets: { image_file_path: 'a.png' },
	};

	const cases: CreateCase[] = [
		{
			name: 'clothesChanger',
			path: '/v1/ai-clothes-changer',
			event: 'magichour.images.clothesChanger',
			input: clothesChangerInput,
			execute: () => Images.clothesChanger(ctx, clothesChangerInput),
		},
		{
			name: 'faceEditor',
			path: '/v1/ai-face-editor',
			event: 'magichour.images.faceEditor',
			input: faceEditorInput,
			execute: () => Images.faceEditor(ctx, faceEditorInput),
		},
		{
			name: 'gifGenerator',
			path: '/v1/ai-gif-generator',
			event: 'magichour.images.gifGenerator',
			input: gifGeneratorInput,
			execute: () => Images.gifGenerator(ctx, gifGeneratorInput),
		},
		{
			name: 'headshotGenerator',
			path: '/v1/ai-headshot-generator',
			event: 'magichour.images.headshotGenerator',
			input: headshotInput,
			execute: () => Images.headshotGenerator(ctx, headshotInput),
		},
		{
			name: 'imageEditor',
			path: '/v1/ai-image-editor',
			event: 'magichour.images.imageEditor',
			input: imageEditorInput,
			execute: () => Images.imageEditor(ctx, imageEditorInput),
		},
		{
			name: 'imageGenerator',
			path: '/v1/ai-image-generator',
			event: 'magichour.images.imageGenerator',
			input: imageGeneratorInput,
			execute: () => Images.imageGenerator(ctx, imageGeneratorInput),
		},
		{
			name: 'imageUpscaler',
			path: '/v1/ai-image-upscaler',
			event: 'magichour.images.imageUpscaler',
			input: imageUpscalerInput,
			execute: () => Images.imageUpscaler(ctx, imageUpscalerInput),
		},
		{
			name: 'memeGenerator',
			path: '/v1/ai-meme-generator',
			event: 'magichour.images.memeGenerator',
			input: memeGeneratorInput,
			execute: () => Images.memeGenerator(ctx, memeGeneratorInput),
		},
		{
			name: 'qrCodeGenerator',
			path: '/v1/ai-qr-code-generator',
			event: 'magichour.images.qrCodeGenerator',
			input: qrCodeInput,
			execute: () => Images.qrCodeGenerator(ctx, qrCodeInput),
		},
		{
			name: 'bodySwap',
			path: '/v1/body-swap',
			event: 'magichour.images.bodySwap',
			input: bodySwapInput,
			execute: () => Images.bodySwap(ctx, bodySwapInput),
		},
		{
			name: 'faceSwapPhoto',
			path: '/v1/face-swap-photo',
			event: 'magichour.images.faceSwapPhoto',
			input: faceSwapPhotoInput,
			execute: () => Images.faceSwapPhoto(ctx, faceSwapPhotoInput),
		},
		{
			name: 'headSwap',
			path: '/v1/head-swap',
			event: 'magichour.images.headSwap',
			input: headSwapInput,
			execute: () => Images.headSwap(ctx, headSwapInput),
		},
		{
			name: 'backgroundRemover',
			path: '/v1/image-background-remover',
			event: 'magichour.images.backgroundRemover',
			input: backgroundRemoverInput,
			execute: () => Images.backgroundRemover(ctx, backgroundRemoverInput),
		},
		{
			name: 'photoColorizer',
			path: '/v1/photo-colorizer',
			event: 'magichour.images.photoColorizer',
			input: photoColorizerInput,
			execute: () => Images.photoColorizer(ctx, photoColorizerInput),
		},
	];

	for (const testCase of cases) {
		it(`${testCase.name} posts to ${testCase.path} and returns the project id`, async () => {
			mockedRequest.mockResolvedValue(generateFixture);

			const result = await testCase.execute();

			expect(result).toEqual(generateFixture);
			expect(mockedRequest).toHaveBeenCalledWith(
				testCase.path,
				'test-api-key',
				{ method: 'POST', body: testCase.input },
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				testCase.event,
				{ id: 'proj_123' },
				'completed',
			);
		});
	}

	it('rejects an unsupported scale_factor before calling the API', () => {
		const parsed = MagicHourEndpointInputSchemas.imagesImageUpscaler.safeParse({
			scale_factor: 3,
			assets: { image_file_path: 'a.png' },
		});

		expect(parsed.success).toBe(false);
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('audioProjects', () => {
	it('getDetails returns the audio project status', async () => {
		mockedRequest.mockResolvedValue(audioProjectFixture);

		const result = await AudioProjects.getDetails(ctx, { id: 'a_1' });

		expect(result).toEqual(audioProjectFixture);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/audio-projects/a_1',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'magichour.audioProjects.getDetails',
			{ id: 'a_1', status: 'complete' },
			'completed',
		);
	});

	it('delete removes the audio project', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await AudioProjects.deleteAudio(ctx, { id: 'a_1' });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/audio-projects/a_1',
			'test-api-key',
			{ method: 'DELETE' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'magichour.audioProjects.delete',
			{ id: 'a_1' },
			'completed',
		);
	});
});

describe('audio create operations', () => {
	const voiceGeneratorInput: MagicHourEndpointInputs['audioVoiceGenerator'] = {
		style: { prompt: 'Hello', voice_name: 'Morgan Freeman' },
	};
	const voiceClonerInput: MagicHourEndpointInputs['audioVoiceCloner'] = {
		assets: { audio_file_path: 'a.mp3' },
		style: { prompt: 'Hello' },
	};

	const cases: CreateCase[] = [
		{
			name: 'voiceGenerator',
			path: '/v1/ai-voice-generator',
			event: 'magichour.audio.voiceGenerator',
			input: voiceGeneratorInput,
			execute: () => Audio.voiceGenerator(ctx, voiceGeneratorInput),
		},
		{
			name: 'voiceCloner',
			path: '/v1/ai-voice-cloner',
			event: 'magichour.audio.voiceCloner',
			input: voiceClonerInput,
			execute: () => Audio.voiceCloner(ctx, voiceClonerInput),
		},
	];

	for (const testCase of cases) {
		it(`${testCase.name} posts to ${testCase.path} and returns the project id`, async () => {
			mockedRequest.mockResolvedValue(generateFixture);

			const result = await testCase.execute();

			expect(result).toEqual(generateFixture);
			expect(mockedRequest).toHaveBeenCalledWith(
				testCase.path,
				'test-api-key',
				{ method: 'POST', body: testCase.input },
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				testCase.event,
				{ id: 'proj_123' },
				'completed',
			);
		});
	}

	it('rejects a voice generator input without a style before calling the API', () => {
		const parsed = MagicHourEndpointInputSchemas.audioVoiceGenerator.safeParse(
			{},
		);

		expect(parsed.success).toBe(false);
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('magichour plugin shape', () => {
	it('exposes endpoint groups for every resource', () => {
		const plugin = magichour({});

		expect(plugin.endpoints?.account.get).toBeDefined();
		expect(plugin.endpoints?.files.generateUploadUrls).toBeDefined();
		expect(plugin.endpoints?.faceDetection.detect).toBeDefined();
		expect(plugin.endpoints?.videoProjects.getDetails).toBeDefined();
		expect(plugin.endpoints?.videos.textToVideo).toBeDefined();
		expect(plugin.endpoints?.imageProjects.getDetails).toBeDefined();
		expect(plugin.endpoints?.images.imageGenerator).toBeDefined();
		expect(plugin.endpoints?.audioProjects.getDetails).toBeDefined();
		expect(plugin.endpoints?.audio.voiceGenerator).toBeDefined();
	});

	it('uses api_key auth and declares no webhooks', () => {
		const plugin = magichour({ authType: 'api_key' });

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('wires zod input and output schemas for all 40 endpoints', () => {
		const entries = Object.values(magicHourEndpointSchemas);
		expect(entries).toHaveLength(40);

		for (const entry of entries) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('marks the three project deletions destructive and irreversible', () => {
		for (const key of [
			'videoProjects.delete',
			'imageProjects.delete',
			'audioProjects.delete',
		] as const) {
			expect(magicHourEndpointMeta[key].riskLevel).toBe('destructive');
			expect(magicHourEndpointMeta[key].irreversible).toBe(true);
		}
	});
});

describe('magichour keyBuilder', () => {
	function keyCtx(apiKey: string | null): MagicHourKeyBuilderContext {
		return {
			authType: 'api_key',
			options: {},
			tenantId: 'test-tenant',
			keys: {
				get_dek: () => Promise.resolve('test-dek'),
				issue_new_dek: () => Promise.resolve('test-dek'),
				get_api_key: () => Promise.resolve(apiKey),
				set_api_key: () => Promise.resolve(),
				get_webhook_signature: () => Promise.resolve(null),
				set_webhook_signature: () => Promise.resolve(),
			},
		};
	}

	function requireKeyBuilder(plugin: ReturnType<typeof magichour>) {
		const keyBuilder = plugin.keyBuilder;
		if (!keyBuilder) throw new Error('plugin keyBuilder is missing');
		return keyBuilder;
	}

	it('prefers an explicitly configured key over the stored one', async () => {
		const keyBuilder = requireKeyBuilder(magichour({ key: 'option-key' }));

		await expect(keyBuilder(keyCtx('stored-key'), 'endpoint')).resolves.toBe(
			'option-key',
		);
	});

	it('returns the stored key when no option key is set', async () => {
		const keyBuilder = requireKeyBuilder(magichour({}));

		await expect(keyBuilder(keyCtx('stored-key'), 'endpoint')).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const keyBuilder = requireKeyBuilder(magichour({}));

		await expect(keyBuilder(keyCtx(null), 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('returns an empty string for non-endpoint sources', async () => {
		const keyBuilder = requireKeyBuilder(magichour({}));

		await expect(keyBuilder(keyCtx('stored-key'), 'webhook')).resolves.toBe('');
	});
});

describe('magichour custom error handlers', () => {
	it('evaluates caller-provided handlers before the catch-all DEFAULT', () => {
		const plugin = magichour<MagicHourPluginOptions>({
			authType: 'api_key',
			errorHandlers: {
				CUSTOM_ERROR: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});

		const names = Object.keys(plugin.errorHandlers ?? {});
		expect(names).toContain('CUSTOM_ERROR');
		// Core selects the first handler whose matcher accepts the error and
		// DEFAULT matches everything, so a custom handler is only reachable
		// when DEFAULT is evaluated last.
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(names.indexOf('CUSTOM_ERROR')).toBeLessThan(
			names.indexOf('DEFAULT'),
		);
	});

	it('keeps a caller override of DEFAULT in the last position', () => {
		const override = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};
		const plugin = magichour<MagicHourPluginOptions>({
			authType: 'api_key',
			errorHandlers: { DEFAULT: override },
		});

		expect(plugin.errorHandlers?.DEFAULT).toBe(override);
		const names = Object.keys(plugin.errorHandlers ?? {});
		expect(names[names.length - 1]).toBe('DEFAULT');
	});
});
