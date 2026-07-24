import 'dotenv/config';
import { makeHeygenRequest } from './client';
import type {
	HeygenEndpointInputs,
	HeygenEndpointOutputs,
} from './endpoints/types';
import {
	HeygenEndpointInputSchemas,
	HeygenEndpointOutputSchemas,
} from './endpoints/types';

declare const describe: {
	(name: string, fn: () => void): void;
	skip(name: string, fn: () => void): void;
};
declare const it: (name: string, fn: () => void | Promise<void>) => void;
declare const expect: {
	(
		actual: unknown,
	): {
		toBe(expected: unknown): void;
		toBeDefined(): void;
		toBeGreaterThan(n: number): void;
		toEqual(expected: unknown): void;
	};
};

const TEST_API_KEY = process.env.HEYGEN_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

// Fixtures paired per endpoint: a valid input sample and a valid response-envelope
// sample (HeyGen's `{ error, data }` wrapper). Every fixture is round-tripped through
// both the input and output Zod schemas below.
const FIXTURES: {
	[K in keyof HeygenEndpointInputs]: {
		input: HeygenEndpointInputs[K];
		// output envelope differs by endpoint and is asserted by each endpoint's Zod output schema at runtime
		// output shape varies across all 72 test fixtures and is dynamically verified against each operation schema at runtime
		output: unknown;
	};
} = {
	videosGenerate: {
		input: {
			type: 'avatar',
			avatar_id: 'avatar_123',
			script: 'Hello',
			voice_id: 'voice_123',
			title: 'My Title',
		},
		output: { error: null, data: { video_id: 'vid_123', status: 'waiting' } },
	},
	videosTemplateGenerate: {
		input: {
			template_id: 'tmpl_123',
			variables: { first_name: { name: 'first_name' } },
		},
		output: { error: null, data: { video_id: 'vid_123' } },
	},
	videosCreateWebm: {
		input: { avatar_id: 'avatar_123', input_text: 'Hello' },
		output: { error: null, data: { video_id: 'vid_123' } },
	},
	videosPersonalizedAddContact: {
		input: {
			project_id: 'proj_123',
			variables_list: [{ email: 'john@mail.com', first_name: 'John' }],
		},
		output: { error: null, data: {} },
	},
	videosPersonalizedProjectDetail: {
		input: { id: 'proj_123' },
		output: { error: null, data: { project_id: 'proj_123', status: 'active' } },
	},
	videosGetStatus: {
		input: { video_id: 'vid_123' },
		output: {
			error: null,
			data: { id: 'vid_123', status: 'completed', video_url: 'https://x' },
		},
	},
	videosTranslate: {
		input: {
			video: { type: 'url', url: 'https://x/video.mp4' },
			output_languages: ['English'],
		},
		output: { error: null, data: { video_translation_ids: ['trans_123'] } },
	},
	videosTranslateStatus: {
		input: { video_translate_id: 'trans_123' },
		output: { error: null, data: { id: 'trans_123', status: 'running' } },
	},
	videosTranslateTargetLanguages: {
		input: {},
		output: { error: null, data: { languages: ['English', 'Spanish'] } },
	},
	videosGetSharableUrl: {
		input: { video_id: 'vid_123' },
		output: {
			error: null,
			data: { share_url: 'https://app.heygen.com/share/vid_123' },
		},
	},
	videosDelete: {
		input: { video_id: 'vid_123' },
		output: { error: null, data: {} },
	},
	videosList: {
		input: { limit: 10 },
		output: { error: null, data: { videos: [{ video_id: 'vid_123' }] } },
	},

	avatarsList: {
		input: {},
		output: { data: [{ id: 'avatar_123' }], has_more: false, next_token: null },
	},
	avatarsGetDetails: {
		input: { avatar_id: 'avatar_123' },
		output: { error: null, data: { avatar_id: 'avatar_123' } },
	},
	avatarsListGroups: {
		input: {},
		output: { error: null, data: { avatar_group_list: [{ id: 'group_123' }] } },
	},
	avatarsListGroupAvatars: {
		input: { group_id: 'group_123' },
		output: {
			error: null,
			data: { avatar_list: [{ avatar_id: 'avatar_123' }] },
		},
	},
	avatarsSearchPublicGroups: {
		input: { keyword: 'business' },
		output: { error: null, data: { avatar_group_list: [{ id: 'group_123' }] } },
	},
	avatarsCreatePhotoGroup: {
		input: { name: 'My Group', image_key: 'image_key_123' },
		output: { error: null, data: { id: 'group_123', name: 'My Group' } },
	},
	avatarsGeneratePhotos: {
		input: {
			name: 'Alex',
			age: 'Young Adult',
			gender: 'Woman',
			ethnicity: 'White',
			orientation: 'square',
			pose: 'half_body',
			style: 'Realistic',
			appearance: 'Business casual',
		},
		output: { error: null, data: { generation_id: 'gen_123' } },
	},
	avatarsAddLooks: {
		input: {
			group_id: 'group_123',
			image_keys: ['image_key_1', 'image_key_2'],
		},
		output: { error: null, data: { generation_id: 'gen_123' } },
	},
	avatarsCheckLookStatus: {
		input: { generation_id: 'gen_123' },
		output: {
			error: null,
			data: { generation_id: 'gen_123', status: 'success' },
		},
	},
	avatarsGetTrainingStatus: {
		input: { group_id: 'group_123' },
		output: { error: null, data: { status: 'ready' } },
	},
	avatarsGetPhotoDetails: {
		input: { id: 'avatar_123' },
		output: { error: null, data: { id: 'avatar_123' } },
	},
	avatarsDeletePhotoGroup: {
		input: { group_id: 'group_123' },
		output: { error: null, data: {} },
	},
	avatarsDeletePhoto: {
		input: { id: 'avatar_123' },
		output: { error: null, data: {} },
	},
	avatarsAddMotion: {
		input: { id: 'avatar_123' },
		output: { error: null, data: { id: 'avatar_123' } },
	},
	avatarsUpscale: {
		input: { id: 'avatar_123' },
		output: { error: null, data: { id: 'avatar_123' } },
	},
	avatarsListTalkingPhotos: {
		input: {},
		output: { error: null, data: [{ talking_photo_id: 'tp_123' }] },
	},
	avatarsUploadTalkingPhoto: {
		input: { imageBase64: 'aGVsbG8=', contentType: 'image/jpeg' },
		output: { error: null, data: { talking_photo_id: 'tp_123' } },
	},
	avatarsDeleteTalkingPhoto: {
		input: { talking_photo_id: 'tp_123' },
		output: { error: null, data: {} },
	},

	voicesGenerateSpeech: {
		input: { text: 'Hello world', voice_id: 'voice_123' },
		output: { error: null, data: { audio_url: 'https://x/audio.mp3' } },
	},
	voicesGeneratePreview: {
		input: { voice_id: 'voice_123' },
		output: { error: null, data: { audio_url: 'https://x/preview.mp3' } },
	},
	voicesListTts: {
		input: {},
		output: { error: null, data: { voices: [{ voice_id: 'voice_123' }] } },
	},
	voicesListLocales: {
		input: {},
		output: { error: null, data: { locales: [{ locale: 'en-US' }] } },
	},
	voicesListV2: {
		input: {},
		output: { error: null, data: { voices: [{ voice_id: 'voice_123' }] } },
	},
	voicesListV1: {
		input: {},
		output: { error: null, data: { voices: [{ voice_id: 'voice_123' }] } },
	},
	voicesListBrandVoices: {
		input: {},
		output: { error: null, data: { brand_voices: [{ id: 'brand_123' }] } },
	},

	streamingNewSession: {
		input: { quality: 'medium', avatar_id: 'avatar_123' },
		output: { error: null, data: { session_id: 'session_123' } },
	},
	streamingCreateToken: {
		input: {},
		output: { error: null, data: { token: 'token_123' } },
	},
	streamingStart: {
		input: { session_id: 'session_123', sdp: { type: 'offer', sdp: 'v=0...' } },
		output: { error: null, data: {} },
	},
	streamingStop: {
		input: { session_id: 'session_123' },
		output: { error: null, data: {} },
	},
	streamingInterrupt: {
		input: { session_id: 'session_123' },
		output: { error: null, data: {} },
	},
	streamingKeepAlive: {
		input: { session_id: 'session_123' },
		output: { error: null, data: {} },
	},
	streamingTask: {
		input: { session_id: 'session_123', text: 'Hey there' },
		output: { error: null, data: { duration_ms: 1200 } },
	},
	streamingIce: {
		input: {
			session_id: 'session_123',
			candidate: { candidate: 'candidate:1', sdpMid: '0' },
		},
		output: { error: null, data: {} },
	},
	streamingNew: {
		input: { quality: 'medium' },
		output: { error: null, data: { session_id: 'session_123' } },
	},
	streamingList: {
		input: {},
		output: {
			error: null,
			data: { sessions: [{ session_id: 'session_123' }] },
		},
	},
	streamingListAvatars: {
		input: {},
		output: { error: null, data: [{ avatar_id: 'avatar_123' }] },
	},
	streamingListSessionHistory: {
		input: { page: 1 },
		output: {
			error: null,
			data: { sessions: [{ session_id: 'session_123' }] },
		},
	},

	knowledgeBasesCreate: {
		input: { name: 'Support Bot', opening: 'Hi!', prompt: 'Be helpful' },
		output: { error: null, data: { knowledge_base_id: 'kb_123' } },
	},
	knowledgeBasesList: {
		input: {},
		output: { error: null, data: { list: [{ id: 'kb_123' }] } },
	},
	knowledgeBasesUpdate: {
		input: { knowledge_base_id: 'kb_123', name: 'Updated Bot' },
		output: { error: null, data: {} },
	},
	knowledgeBasesDelete: {
		input: { knowledge_base_id: 'kb_123' },
		output: { error: null, data: {} },
	},

	assetsListTemplates: {
		input: {},
		output: { error: null, data: { templates: [{ template_id: 'tmpl_123' }] } },
	},
	assetsGetTemplate: {
		input: { template_id: 'tmpl_123' },
		output: { error: null, data: { template_id: 'tmpl_123' } },
	},
	assetsUploadAsset: {
		input: { fileBase64: 'aGVsbG8=', contentType: 'image/png' },
		output: {
			error: null,
			data: { id: 'asset_123', url: 'https://x/asset.png' },
		},
	},
	assetsListAssets: {
		input: { page: 1 },
		output: { error: null, data: { assets: [{ id: 'asset_123' }] } },
	},
	assetsListAssets2: {
		input: { cursor: 'cursor_123' },
		output: { error: null, data: { assets: [{ id: 'asset_123' }] } },
	},
	assetsDeleteAsset: {
		input: { asset_id: 'asset_123' },
		output: { error: null, data: {} },
	},
	assetsCreateFolder: {
		input: { name: 'My Folder' },
		output: { error: null, data: { folder_id: 'folder_123' } },
	},
	assetsListFolders: {
		input: { page: 1 },
		output: { error: null, data: { folders: [{ folder_id: 'folder_123' }] } },
	},
	assetsUpdateFolder: {
		input: { folder_id: 'folder_123', name: 'Renamed Folder' },
		output: { error: null, data: {} },
	},
	assetsTrashFolder: {
		input: { folder_id: 'folder_123' },
		output: { error: null, data: {} },
	},
	assetsRestoreFolder: {
		input: { folder_id: 'folder_123' },
		output: { error: null, data: {} },
	},

	webhooksQuotaAddEndpoint: {
		input: {
			url: 'https://example.com/webhook',
			events: ['avatar_video.success'],
		},
		output: { error: null, data: { endpoint_id: 'endpoint_123' } },
	},
	webhooksQuotaListEndpoints: {
		input: {},
		output: { error: null, data: [{ endpoint_id: 'endpoint_123' }] },
	},
	webhooksQuotaListEventTypes: {
		input: {},
		output: { error: null, data: [{ event: 'avatar_video.success' }] },
	},
	webhooksQuotaUpdateEndpoint: {
		input: {
			endpoint_id: 'endpoint_123',
			url: 'https://example.com/new-webhook',
		},
		output: { error: null, data: {} },
	},
	webhooksQuotaDeleteEndpoint: {
		input: { endpoint_id: 'endpoint_123' },
		output: { error: null, data: {} },
	},
	webhooksQuotaGetCurrentUser: {
		input: {},
		output: {
			error: null,
			data: {
				username: 'user123',
				email: 'user@example.com',
				first_name: null,
				last_name: null,
			},
		},
	},
	webhooksQuotaRemainingQuota: {
		input: {},
		output: { error: null, data: { remaining_quota: 1000 } },
	},

	videoAgentsListSessions: {
		input: {},
		output: {
			data: [{ session_id: 'sess_123', created_at: 1700000000 }],
			has_more: false,
			next_token: null,
		},
	},
	videoAgentsCreateSession: {
		input: { prompt: 'Create a product demo video' },
		output: {
			data: {
				session_id: 'sess_123',
				status: 'thinking',
				video_id: null,
				created_at: 1700000000,
			},
		},
	},
	videoAgentsListStyles: {
		input: {},
		output: {
			data: [{ style_id: 'style_123', name: 'Cinematic' }],
			has_more: false,
			next_token: null,
		},
	},
	videoAgentsGetSession: {
		input: { session_id: 'sess_123' },
		output: {
			data: {
				session_id: 'sess_123',
				status: 'completed',
				created_at: 1700000000,
				messages: [],
			},
		},
	},
	videoAgentsSendMessage: {
		input: { session_id: 'sess_123', message: 'Make the intro shorter' },
		output: { data: { session_id: 'sess_123', run_id: 'run_123' } },
	},
	videoAgentsGetResource: {
		input: { session_id: 'sess_123', resource_id: 'res_123' },
		output: { data: { resource_id: 'res_123', resource_type: 'script' } },
	},
	videoAgentsListVideos: {
		input: { session_id: 'sess_123' },
		output: {
			data: [{ id: 'vid_123', status: 'completed' }],
			has_more: false,
			next_token: null,
		},
	},
	videoAgentsStopSession: {
		input: { session_id: 'sess_123' },
		output: { data: { session_id: 'sess_123' } },
	},

	brandListGlossaries: {
		input: {},
		output: {
			data: [
				{
					brand_glossary_id: 'glossary_123',
					name: 'Product Terms',
					created_at: '2026-01-01T00:00:00Z',
					updated_at: '2026-01-01T00:00:00Z',
				},
			],
			has_more: false,
			next_token: null,
		},
	},
	brandListKits: {
		input: {},
		output: {
			data: [{ brand_kit_id: 'kit_123', name: 'Acme Brand' }],
			has_more: false,
			next_token: null,
		},
	},

	avatarsCreate: {
		input: {
			type: 'prompt',
			name: 'My Avatar',
			prompt: 'A friendly presenter',
		},
		output: { data: { avatar_item: null, avatar_group: null } },
	},
	avatarsGetGroup: {
		input: { group_id: 'group_123' },
		output: {
			data: {
				id: 'group_123',
				name: 'My Group',
				created_at: 1700000000,
				looks_count: 1,
			},
		},
	},
	avatarsDeleteGroup: {
		input: { group_id: 'group_123' },
		output: { data: { id: 'group_123' } },
	},
	avatarsCreateConsent: {
		input: { group_id: 'group_123' },
		output: {
			data: {
				avatar_group: {
					id: 'group_123',
					name: 'My Group',
					created_at: 1700000000,
					looks_count: 1,
				},
				url: 'https://app.heygen.com/consent/group_123',
			},
		},
	},
	avatarsListLooks: {
		input: {},
		output: {
			data: [{ id: 'look_123', name: 'Outfit A', avatar_type: 'photo_avatar' }],
			has_more: false,
			next_token: null,
		},
	},
	avatarsGetLook: {
		input: { look_id: 'look_123' },
		output: {
			data: { id: 'look_123', name: 'Outfit A', avatar_type: 'photo_avatar' },
		},
	},
	avatarsDeleteLook: {
		input: { look_id: 'look_123' },
		output: { data: { id: 'look_123' } },
	},
	avatarsUpdateLook: {
		input: { look_id: 'look_123', name: 'Outfit B' },
		output: {
			data: { id: 'look_123', name: 'Outfit B', avatar_type: 'photo_avatar' },
		},
	},

	avatarRealtimeCreateSession: {
		input: {
			type: 'tts',
			avatar_id: 'avatar_123',
			text: 'Hello there',
			voice_id: 'voice_123',
		},
		output: { data: { stream_id: 'stream_123' } },
	},
	avatarRealtimeGetSession: {
		input: { stream_id: 'stream_123' },
		output: { data: { stream_id: 'stream_123', status: 'streaming' } },
	},
	avatarRealtimeAppendText: {
		input: { stream_id: 'stream_123', delta: 'more text' },
		output: { data: { buffered_bytes: 128 } },
	},
	avatarRealtimeCancelSession: {
		input: { stream_id: 'stream_123' },
		output: { data: { stream_id: 'stream_123', cancelled: true } },
	},

	audioSearch: {
		input: { query: 'upbeat corporate' },
		output: {
			data: [{ id: 'sound_123', name: 'Upbeat Corporate' }],
			has_more: false,
			next_token: null,
		},
	},

	voicesGenerateSpeechV3: {
		input: { text: 'Hello world', voice_id: 'voice_123' },
		output: { data: { audio_url: 'https://x/audio.mp3', duration: 2.5 } },
	},
	voicesListV3: {
		input: {},
		output: {
			data: [{ voice_id: 'voice_123', name: 'Aria' }],
			has_more: false,
			next_token: null,
		},
	},
	voicesDesign: {
		input: { prompt: 'A warm, friendly female voice' },
		output: { data: { voices: [{ voice_id: 'voice_123' }], seed: 0 } },
	},
	voicesClone: {
		input: {
			audio: { type: 'url', url: 'https://x/sample.mp3' },
			voice_name: 'My Voice',
		},
		output: { data: { voice_clone_id: 'clone_123' } },
	},
	voicesGetV3: {
		input: { voice_id: 'voice_123' },
		output: { data: { voice_id: 'voice_123', status: 'complete' } },
	},
	voicesDeleteV3: {
		input: { voice_id: 'voice_123' },
		output: { data: { voice_id: 'voice_123' } },
	},

	videosListV3: {
		input: {},
		output: {
			data: [{ id: 'vid_123', status: 'completed' }],
			has_more: false,
			next_token: null,
		},
	},
	videosDeleteV3: {
		input: { video_id: 'vid_123' },
		output: { data: { id: 'vid_123', deleted: true } },
	},

	videoTranslationsList: {
		input: {},
		output: {
			data: [{ id: 'trans_123', status: 'completed' }],
			has_more: false,
			next_token: null,
		},
	},
	videoTranslationsDelete: {
		input: { video_translation_id: 'trans_123' },
		output: { data: { id: 'trans_123' } },
	},
	videoTranslationsUpdate: {
		input: { video_translation_id: 'trans_123', title: 'New Title' },
		output: {
			data: { id: 'trans_123', status: 'completed', title: 'New Title' },
		},
	},

	proofreadCreate: {
		input: {
			video: { type: 'url', url: 'https://x/video.mp4' },
			output_languages: ['Spanish (Spain)'],
			title: 'My Proofread',
		},
		output: { data: { proofread_ids: ['proof_123'], status: 'processing' } },
	},
	proofreadGet: {
		input: { proofread_id: 'proof_123' },
		output: { data: { id: 'proof_123', status: 'processing' } },
	},
	proofreadDownloadSrt: {
		input: { proofread_id: 'proof_123' },
		output: { data: { srt_url: 'https://x/edited.srt' } },
	},
	proofreadUploadSrt: {
		input: {
			proofread_id: 'proof_123',
			srt: { type: 'url', url: 'https://x/edited.srt' },
		},
		output: { data: { id: 'proof_123', status: 'processing' } },
	},
	proofreadGenerateVideo: {
		input: { proofread_id: 'proof_123' },
		output: {
			data: { video_translation_id: 'trans_123', status: 'processing' },
		},
	},

	lipsyncList: {
		input: {},
		output: {
			data: [{ id: 'lip_123', status: 'completed' }],
			has_more: false,
			next_token: null,
		},
	},
	lipsyncCreate: {
		input: {
			video: { type: 'url', url: 'https://x/video.mp4' },
			audio: { type: 'url', url: 'https://x/audio.mp3' },
		},
		output: { data: { lipsync_id: 'lip_123' } },
	},
	lipsyncGet: {
		input: { lipsync_id: 'lip_123' },
		output: { data: { id: 'lip_123', status: 'completed' } },
	},
	lipsyncDelete: {
		input: { lipsync_id: 'lip_123' },
		output: { data: { id: 'lip_123' } },
	},
	lipsyncUpdate: {
		input: { lipsync_id: 'lip_123', title: 'New Title' },
		output: {
			data: { id: 'lip_123', status: 'completed', title: 'New Title' },
		},
	},

	hyperframesList: {
		input: {},
		output: {
			data: [{ render_id: 'render_123', status: 'completed', format: 'mp4' }],
			has_more: false,
			next_token: null,
		},
	},
	hyperframesCreate: {
		input: { project: { type: 'url', url: 'https://x/project.html' } },
		output: { data: { render_id: 'render_123' } },
	},
	hyperframesGet: {
		input: { render_id: 'render_123' },
		output: {
			data: { render_id: 'render_123', status: 'completed', format: 'mp4' },
		},
	},
	hyperframesDelete: {
		input: { render_id: 'render_123' },
		output: { data: { render_id: 'render_123' } },
	},

	webhooksListEventTypesV3: {
		input: {},
		output: {
			data: [
				{ event_type: 'avatar_video.success', description: 'Video completed' },
			],
			has_more: false,
			next_token: null,
		},
	},
	webhooksListEndpointsV3: {
		input: {},
		output: {
			data: [
				{
					endpoint_id: 'ep_123',
					url: 'https://example.com/webhook',
					status: 'enabled',
					created_at: '2026-01-01T00:00:00Z',
				},
			],
			has_more: false,
			next_token: null,
		},
	},
	webhooksAddEndpointV3: {
		input: { url: 'https://example.com/webhook' },
		output: {
			data: {
				endpoint_id: 'ep_123',
				url: 'https://example.com/webhook',
				status: 'enabled',
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	webhooksDeleteEndpointV3: {
		input: { endpoint_id: 'ep_123' },
		output: { data: {} },
	},
	webhooksUpdateEndpointV3: {
		input: { endpoint_id: 'ep_123', url: 'https://example.com/new-webhook' },
		output: {
			data: {
				endpoint_id: 'ep_123',
				url: 'https://example.com/new-webhook',
				status: 'enabled',
				created_at: '2026-01-01T00:00:00Z',
			},
		},
	},
	webhooksRotateSecret: {
		input: { endpoint_id: 'ep_123' },
		output: { data: { endpoint_id: 'ep_123', secret: 'whsec_123' } },
	},
	webhooksListEvents: {
		input: {},
		output: {
			data: [
				{
					event_id: 'evt_123',
					event_type: 'avatar_video.success',
					event_data: { video_id: 'vid_123' },
					created_at: '2026-01-01T00:00:00Z',
				},
			],
			has_more: false,
			next_token: null,
		},
	},

	assetsUploadAssetV3: {
		input: { fileBase64: 'aGVsbG8=', contentType: 'image/png' },
		output: {
			data: {
				asset_id: 'asset_123',
				url: 'https://x/asset.png',
				mime_type: 'image/png',
				size_bytes: 1024,
			},
		},
	},
	assetsGetAsset: {
		input: { asset_id: 'asset_123' },
		output: {
			data: {
				id: 'asset_123',
				name: 'asset.png',
				type: 'image',
				owner: 'user123',
				space_id: 'space_123',
				uploaded_at: 1700000000,
			},
		},
	},
	assetsDeleteAssetV3: {
		input: { asset_id: 'asset_123' },
		output: { data: { id: 'asset_123' } },
	},
	assetsCreateUploadSession: {
		input: {
			filename: 'video.mp4',
			content_type: 'video/mp4',
			size_bytes: 1048576,
		},
		output: {
			data: {
				asset_id: 'asset_123',
				upload_url: 'https://s3.example.com/upload',
				upload_headers: {},
				expires_in_seconds: 3600,
				max_bytes: 1048576,
				status: 'pending_upload',
			},
		},
	},
	assetsCompleteUpload: {
		input: { asset_id: 'asset_123' },
		output: {
			data: {
				asset_id: 'asset_123',
				url: 'https://x/asset.mp4',
				mime_type: 'video/mp4',
				size_bytes: 1048576,
				status: 'processing',
			},
		},
	},

	aiClippingGet: {
		input: { job_id: 'clip_job_123' },
		output: { data: { id: 'clip_job_123', status: 'completed' } },
	},
	aiClippingDelete: {
		input: { job_id: 'clip_job_123' },
		output: { data: {} },
	},
	aiClippingList: {
		input: {},
		output: {
			data: [{ id: 'clip_job_123', status: 'completed' }],
			has_more: false,
			next_token: null,
		},
	},
	aiClippingCreate: {
		input: { video: { type: 'url', url: 'https://x/video.mp4' } },
		output: { data: { ai_clipping_id: 'clip_job_123' } },
	},
};

describe('HeyGen endpoint schemas', () => {
	it('defines input and output schemas for every fixture endpoint', () => {
		const keys = Object.keys(FIXTURES) as (keyof HeygenEndpointInputs)[];
		expect(keys.length).toBeGreaterThan(0);
		for (const key of keys) {
			expect(HeygenEndpointInputSchemas[key]).toBeDefined();
			expect(HeygenEndpointOutputSchemas[key]).toBeDefined();
		}
	});

	for (const key of Object.keys(FIXTURES) as (keyof HeygenEndpointInputs)[]) {
		it(`parses ${key} input and output`, () => {
			const fixture = FIXTURES[key];
			const parsedInput = HeygenEndpointInputSchemas[key].safeParse(
				fixture.input,
			);
			expect(parsedInput.success).toBe(true);
			const parsedOutput = HeygenEndpointOutputSchemas[key].safeParse(
				fixture.output,
			);
			expect(parsedOutput.success).toBe(true);
			if (parsedInput.success) {
				expect(parsedInput.data).toEqual(fixture.input);
			}
		});
	}

	it('rejects invalid avatarsList input when required fields are missing', () => {
		// avatarsList input is typically empty/object; force a known-invalid value type
		const result = HeygenEndpointInputSchemas.avatarsList.safeParse(null);
		expect(result.success).toBe(false);
	});
});

describeIfApiKey('HeyGen API live smoke tests', () => {
	it('lists avatars', async () => {
		// Must match production path: avatarsList uses GET /v3/avatars (not legacy /v1/avatar.list)
		const response = await makeHeygenRequest<
			HeygenEndpointOutputs['avatarsList']
		>('/v3/avatars', TEST_API_KEY!, { method: 'GET' });

		const parsed = HeygenEndpointOutputSchemas.avatarsList.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('lists v2 voices', async () => {
		const response = await makeHeygenRequest<
			HeygenEndpointOutputs['voicesListV2']
		>('/v2/voices', TEST_API_KEY!, { method: 'GET' });

		const parsed = HeygenEndpointOutputSchemas.voicesListV2.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('retrieves remaining quota', async () => {
		const response = await makeHeygenRequest<
			HeygenEndpointOutputs['webhooksQuotaRemainingQuota']
		>('/v2/user/remaining_quota', TEST_API_KEY!, { method: 'GET' });

		const parsed =
			HeygenEndpointOutputSchemas.webhooksQuotaRemainingQuota.safeParse(
				response,
			);
		expect(parsed.success).toBe(true);
	});
});
