import { z } from 'zod';

/**
 * Zod schemas for every documented Magic Hour endpoint.
 *
 * Shapes, enums, constraints, and required fields mirror the published OpenAPI
 * spec at https://docs.magichour.ai/api-reference/openapi.json (single server
 * `https://api.magichour.ai`, all routes under `/v1`). Every response object
 * uses `.catchall(z.unknown())` so newly added provider fields never break
 * parsing, matching the project convention used by the heygen plugin.
 *
 * Note on large catalogs: Magic Hour ships long, fast-moving option lists
 * (voice names, art styles, camera effects, meme templates, and model names).
 * Those are intentionally typed as `z.string()` rather than `z.enum` so a new
 * provider value does not reject an otherwise valid request or response; each
 * such field carries a comment saying so.
 */

// ---------------------------------------------------------------------------
// Shared sub-schemas
// ---------------------------------------------------------------------------

// Every asynchronous create endpoint returns the new project id plus the
// credits deducted immediately (before rendering completes).
const GenerateResponseSchema = z
	.object({
		id: z.string(),
		credits_charged: z.number().int(),
	})
	.catchall(z.unknown());

export type GenerateResponse = z.infer<typeof GenerateResponseSchema>;

const DownloadSchema = z
	.object({
		url: z.string(),
		expires_at: z.string(),
	})
	.catchall(z.unknown());

const ProjectErrorSchema = z
	.object({
		message: z.string(),
		code: z.string(),
	})
	.catchall(z.unknown());

const ProjectStatusSchema = z.enum([
	'draft',
	'queued',
	'rendering',
	'complete',
	'error',
	'canceled',
]);

// Shared input for the three "get project details" and three "delete project"
// operations, all of which take only the project id in the path.
const IdInputSchema = z.object({ id: z.string() }).catchall(z.unknown());

export type IdInput = z.infer<typeof IdInputSchema>;

// Input schema for endpoints that take no fields (GET /v1/account).
const EmptyInputSchema = z.object({}).catchall(z.unknown());

export type EmptyInput = z.infer<typeof EmptyInputSchema>;

// 204 No Content responses have no body; the endpoint functions return nothing.
const DeleteResponseSchema = z.void();

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

const FaceSwapModeSchema = z.enum(['all-faces', 'individual-faces']);

const VideoSourceSchema = z.enum(['file', 'youtube']);

const FaceMappingSchema = z
	.object({
		original_face: z.string(),
		new_face: z.string(),
	})
	.catchall(z.unknown());

const ResolutionSchema = z.enum(['480p', '720p', '1080p']);

// ── Account ─────────────────────────────────────────────────────────────────

const AccountDiscountSchema = z
	.object({
		percent_off: z.number().nullable(),
		amount_off: z.number().int().nullable(),
	})
	.catchall(z.unknown());

const AccountPriceSchema = z
	.object({
		amount: z.number().int().nonnegative(),
		currency: z.string(),
	})
	.catchall(z.unknown());

const AccountSubscriptionSchema = z
	.object({
		name: z.string().nullable(),
		status: z.enum(['active', 'past_due']),
		price: AccountPriceSchema,
		discount: AccountDiscountSchema.nullable(),
		// '' is a documented value in the spec's enum, meaning "unknown".
		billing_interval: z.enum(['month', 'year', '']).nullable(),
		current_period_end: z.string().nullable(),
		cancel_at_period_end: z.boolean(),
	})
	.catchall(z.unknown());

export const AccountGetInputSchema = EmptyInputSchema;
export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;

export const AccountGetResponseSchema = z
	.object({
		id: z.string(),
		email: z.string().nullable(),
		tier: z.enum(['free', 'creator', 'pro', 'business']),
		credits: z.number().int().nonnegative(),
		subscription: AccountSubscriptionSchema.nullable(),
	})
	.catchall(z.unknown());

export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ── Files ───────────────────────────────────────────────────────────────────

export const FilesGenerateUploadUrlsInputSchema = z
	.object({
		items: z
			.array(
				z
					.object({
						type: z.enum(['video', 'audio', 'image']),
						// Extension without the leading dot; the spec's pattern
						// (^[a-z0-9]+$) rejects uppercase and punctuation.
						extension: z.string().regex(/^[a-z0-9]+$/),
					})
					.catchall(z.unknown()),
			)
			.min(1),
	})
	.catchall(z.unknown());

export type FilesGenerateUploadUrlsInput = z.infer<
	typeof FilesGenerateUploadUrlsInputSchema
>;

export const FilesGenerateUploadUrlsResponseSchema = z
	.object({
		items: z.array(
			z
				.object({
					upload_url: z.string(),
					expires_at: z.string(),
					file_path: z.string(),
				})
				.catchall(z.unknown()),
		),
	})
	.catchall(z.unknown());

export type FilesGenerateUploadUrlsResponse = z.infer<
	typeof FilesGenerateUploadUrlsResponseSchema
>;

export const FilesSavedItemsListInputSchema = z
	.object({
		type: z
			.enum(['character', 'reference', 'voice', 'moodboard', 'brand_kit'])
			.optional(),
		limit: z.number().int().min(1).max(100).optional(),
		cursor: z.string().optional(),
	})
	.catchall(z.unknown());

export type FilesSavedItemsListInput = z.infer<
	typeof FilesSavedItemsListInputSchema
>;

const SavedItemAssetSchema = z
	.object({
		file_path: z.string(),
		media_kind: z.enum(['IMAGE', 'VIDEO', 'AUDIO']),
		is_primary: z.boolean(),
		url: z.string(),
		url_expires_at: z.string(),
	})
	.catchall(z.unknown());

const SavedItemSchema = z
	.object({
		id: z.string(),
		type: z.enum(['character', 'reference', 'voice', 'moodboard', 'brand_kit']),
		name: z.string().nullable(),
		assets: z.array(SavedItemAssetSchema),
	})
	.catchall(z.unknown());

export const FilesSavedItemsListResponseSchema = z
	.object({
		items: z.array(SavedItemSchema),
		next_cursor: z.string().nullable(),
	})
	.catchall(z.unknown());

export type FilesSavedItemsListResponse = z.infer<
	typeof FilesSavedItemsListResponseSchema
>;

// ── Face detection ──────────────────────────────────────────────────────────

export const FaceDetectionDetectInputSchema = z
	.object({
		confidence_score: z.number().min(0).max(1).optional(),
		assets: z
			.object({
				target_file_path: z.string(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type FaceDetectionDetectInput = z.infer<
	typeof FaceDetectionDetectInputSchema
>;

export const FaceDetectionDetectResponseSchema = GenerateResponseSchema;
export type FaceDetectionDetectResponse = z.infer<
	typeof FaceDetectionDetectResponseSchema
>;

export const FaceDetectionGetDetailsInputSchema = IdInputSchema;
export type FaceDetectionGetDetailsInput = z.infer<
	typeof FaceDetectionGetDetailsInputSchema
>;

const DetectedFaceSchema = z
	.object({
		path: z.string(),
		url: z.string(),
	})
	.catchall(z.unknown());

export const FaceDetectionGetDetailsResponseSchema = z
	.object({
		id: z.string(),
		credits_charged: z.number().int(),
		status: z.enum(['queued', 'rendering', 'complete', 'error']),
		faces: z.array(DetectedFaceSchema),
	})
	.catchall(z.unknown());

export type FaceDetectionGetDetailsResponse = z.infer<
	typeof FaceDetectionGetDetailsResponseSchema
>;

// ── Video projects ──────────────────────────────────────────────────────────

export const VideoProjectsGetDetailsInputSchema = IdInputSchema;
export type VideoProjectsGetDetailsInput = z.infer<
	typeof VideoProjectsGetDetailsInputSchema
>;

// `downloads` and `error` are documented as always present, but they are
// relaxed to optional here because a freshly queued project may omit them
// before rendering finishes; that keeps polling resilient.
export const VideoProjectResponseSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable(),
		status: ProjectStatusSchema,
		type: z.string(),
		created_at: z.string(),
		width: z.number().int(),
		height: z.number().int(),
		enabled: z.boolean(),
		start_seconds: z.number(),
		end_seconds: z.number(),
		credits_charged: z.number().int(),
		fps: z.number(),
		error: ProjectErrorSchema.nullable().optional(),
		downloads: z.array(DownloadSchema).optional(),
	})
	.catchall(z.unknown());

export type VideoProjectResponse = z.infer<typeof VideoProjectResponseSchema>;

export const VideoProjectsDeleteInputSchema = IdInputSchema;
export type VideoProjectsDeleteInput = z.infer<
	typeof VideoProjectsDeleteInputSchema
>;

export const VideoProjectsDeleteResponseSchema = DeleteResponseSchema;
export type VideoProjectsDeleteResponse = z.infer<
	typeof VideoProjectsDeleteResponseSchema
>;

// ── Video generation ────────────────────────────────────────────────────────

export const VideosTalkingPhotoInputSchema = z
	.object({
		name: z.string().optional(),
		start_seconds: z.number().nonnegative(),
		end_seconds: z.number().min(0.1),
		assets: z
			.object({
				image_file_path: z.string().min(1),
				audio_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
		style: z
			.object({
				generation_mode: z
					.enum([
						'realistic',
						'prompted',
						'pro',
						'standard',
						'stable',
						'expressive',
					])
					.optional(),
				prompt: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
		resolution: z.enum(['480p', '720p']).optional(),
	})
	.catchall(z.unknown());

export type VideosTalkingPhotoInput = z.infer<
	typeof VideosTalkingPhotoInputSchema
>;

export const VideosTalkingPhotoResponseSchema = GenerateResponseSchema;
export type VideosTalkingPhotoResponse = z.infer<
	typeof VideosTalkingPhotoResponseSchema
>;

export const VideosUgcAdInputSchema = z
	.object({
		assets: z
			.object({
				image_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
		script: z.string().min(1),
		end_seconds: z.number().min(1),
		model: z.enum(['kling-3.0', 'ltx-2.5', 'veo3.1']).optional(),
		resolution: ResolutionSchema.optional(),
	})
	.catchall(z.unknown());

export type VideosUgcAdInput = z.infer<typeof VideosUgcAdInputSchema>;

export const VideosUgcAdResponseSchema = GenerateResponseSchema;
export type VideosUgcAdResponse = z.infer<typeof VideosUgcAdResponseSchema>;

export const VideosVideoEditorInputSchema = z
	.object({
		name: z.string().optional(),
		start_seconds: z.number().nonnegative().optional(),
		end_seconds: z.number().min(0.1),
		model: z
			.enum(['gemini-omni-1.1', 'gemini-omni', 'ltx-2.5', 'ltx-2.3'])
			.optional(),
		resolution: ResolutionSchema.optional(),
		style: z
			.object({
				prompt: z.string().min(1),
			})
			.catchall(z.unknown()),
		assets: z
			.object({
				video_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type VideosVideoEditorInput = z.infer<
	typeof VideosVideoEditorInputSchema
>;

export const VideosVideoEditorResponseSchema = GenerateResponseSchema;
export type VideosVideoEditorResponse = z.infer<
	typeof VideosVideoEditorResponseSchema
>;

export const VideosVideoTranslatorInputSchema = z
	.object({
		name: z.string().optional(),
		start_seconds: z.number().nonnegative().optional(),
		end_seconds: z.number().min(0.1),
		// The spec lists ~50 display-name languages; kept as a string so newly
		// supported languages are accepted without a schema bump.
		target_language: z.string(),
		resolution: ResolutionSchema.optional(),
		assets: z
			.object({
				video_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type VideosVideoTranslatorInput = z.infer<
	typeof VideosVideoTranslatorInputSchema
>;

export const VideosVideoTranslatorResponseSchema = GenerateResponseSchema;
export type VideosVideoTranslatorResponse = z.infer<
	typeof VideosVideoTranslatorResponseSchema
>;

export const VideosAnimationInputSchema = z
	.object({
		name: z.string().optional(),
		fps: z.number().min(1),
		end_seconds: z.number().min(0.1),
		height: z.number().int().min(64),
		width: z.number().int().min(64),
		style: z
			.object({
				// ~50-value provider art-style catalog; volatile, so a string.
				art_style: z.string(),
				art_style_custom: z.string().optional(),
				// ~50-value provider camera-effect catalog; volatile, so a string.
				camera_effect: z.string(),
				prompt_type: z.enum(['custom', 'use_lyrics', 'ai_choose']),
				prompt: z.string().optional(),
				transition_speed: z.number().int().min(1).max(10),
			})
			.catchall(z.unknown()),
		assets: z
			.object({
				audio_source: z.enum(['none', 'file', 'youtube']),
				audio_file_path: z.string().min(1).optional(),
				youtube_url: z.string().min(1).optional(),
				image_file_path: z.string().min(1).optional(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type VideosAnimationInput = z.infer<typeof VideosAnimationInputSchema>;

export const VideosAnimationResponseSchema = GenerateResponseSchema;
export type VideosAnimationResponse = z.infer<
	typeof VideosAnimationResponseSchema
>;

export const VideosAudioToVideoInputSchema = z
	.object({
		name: z.string().optional(),
		start_seconds: z.number().nonnegative().optional(),
		end_seconds: z.number().min(0.1),
		resolution: ResolutionSchema.optional(),
		assets: z
			.object({
				audio_file_path: z.string().min(1),
				image_file_path: z.string().min(1).optional(),
			})
			.catchall(z.unknown()),
		style: z
			.object({
				prompt: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.catchall(z.unknown());

export type VideosAudioToVideoInput = z.infer<
	typeof VideosAudioToVideoInputSchema
>;

export const VideosAudioToVideoResponseSchema = GenerateResponseSchema;
export type VideosAudioToVideoResponse = z.infer<
	typeof VideosAudioToVideoResponseSchema
>;

const SubtitleCustomConfigSchema = z
	.object({
		font: z.string().optional(),
		font_size: z.number().optional(),
		font_style: z.string().optional(),
		text_color: z.string().optional(),
		highlighted_text_color: z.string().optional(),
		stroke_color: z.string().optional(),
		stroke_width: z.number().optional(),
		vertical_position: z.string().optional(),
		horizontal_position: z.string().optional(),
	})
	.catchall(z.unknown());

export const VideosAutoSubtitleGeneratorInputSchema = z
	.object({
		name: z.string().optional(),
		start_seconds: z.number().nonnegative(),
		end_seconds: z.number().min(0.1),
		assets: z
			.object({
				video_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
		style: z
			.object({
				template: z
					.enum(['karaoke', 'cinematic', 'minimalist', 'highlight'])
					.optional(),
				custom_config: SubtitleCustomConfigSchema.optional(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type VideosAutoSubtitleGeneratorInput = z.infer<
	typeof VideosAutoSubtitleGeneratorInputSchema
>;

export const VideosAutoSubtitleGeneratorResponseSchema = GenerateResponseSchema;
export type VideosAutoSubtitleGeneratorResponse = z.infer<
	typeof VideosAutoSubtitleGeneratorResponseSchema
>;

const CharacterReplacePointSchema = z
	.object({
		position_x: z.number().int().nonnegative(),
		position_y: z.number().int().nonnegative(),
		time_seconds: z.number().nonnegative(),
	})
	.catchall(z.unknown());

export const VideosCharacterReplaceInputSchema = z
	.object({
		name: z.string().optional(),
		start_seconds: z.number().nonnegative().optional(),
		end_seconds: z.number().min(0.1),
		model: z.enum(['wan-animate', 'kling-3.0']).optional(),
		resolution: ResolutionSchema.optional(),
		assets: z
			.object({
				video_file_path: z.string().min(1),
				image_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
		style: z
			.object({
				mode: z.enum(['replace', 'animate']).optional(),
				selection_mode: z.enum(['auto', 'point']).optional(),
				points: z.array(CharacterReplacePointSchema).optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.catchall(z.unknown());

export type VideosCharacterReplaceInput = z.infer<
	typeof VideosCharacterReplaceInputSchema
>;

export const VideosCharacterReplaceResponseSchema = GenerateResponseSchema;
export type VideosCharacterReplaceResponse = z.infer<
	typeof VideosCharacterReplaceResponseSchema
>;

export const VideosFaceSwapInputSchema = z
	.object({
		name: z.string().optional(),
		start_seconds: z.number().nonnegative(),
		end_seconds: z.number().min(0.1),
		style: z
			.object({
				version: z.enum(['v1', 'v2', 'default']).optional(),
			})
			.catchall(z.unknown())
			.optional(),
		assets: z
			.object({
				face_swap_mode: FaceSwapModeSchema.optional(),
				image_file_path: z.string().optional(),
				face_mappings: z.array(FaceMappingSchema).max(5).optional(),
				video_source: VideoSourceSchema,
				video_file_path: z.string().optional(),
				youtube_url: z.string().optional(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type VideosFaceSwapInput = z.infer<typeof VideosFaceSwapInputSchema>;

export const VideosFaceSwapResponseSchema = GenerateResponseSchema;
export type VideosFaceSwapResponse = z.infer<
	typeof VideosFaceSwapResponseSchema
>;

export const VideosImageToVideoInputSchema = z
	.object({
		name: z.string().optional(),
		end_seconds: z.number().min(1).max(60),
		// ~20-value provider model catalog that changes often, so a string.
		model: z.string().optional(),
		resolution: z.enum(['360p', '480p', '720p', '1080p', '4k']).optional(),
		audio: z.boolean().optional(),
		style: z
			.object({
				prompt: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
		assets: z
			.object({
				image_file_path: z.string().min(1),
				end_image_file_path: z.string().min(1).optional(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type VideosImageToVideoInput = z.infer<
	typeof VideosImageToVideoInputSchema
>;

export const VideosImageToVideoResponseSchema = GenerateResponseSchema;
export type VideosImageToVideoResponse = z.infer<
	typeof VideosImageToVideoResponseSchema
>;

export const VideosLipSyncInputSchema = z
	.object({
		name: z.string().optional(),
		start_seconds: z.number().nonnegative(),
		end_seconds: z.number().min(0.1),
		max_fps_limit: z.number().min(1).optional(),
		assets: z
			.object({
				audio_file_path: z.string().min(1),
				video_source: VideoSourceSchema,
				video_file_path: z.string().optional(),
				youtube_url: z.string().optional(),
			})
			.catchall(z.unknown()),
		style: z
			.object({
				generation_mode: z.enum(['lite', 'standard', 'pro']).optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.catchall(z.unknown());

export type VideosLipSyncInput = z.infer<typeof VideosLipSyncInputSchema>;

export const VideosLipSyncResponseSchema = GenerateResponseSchema;
export type VideosLipSyncResponse = z.infer<typeof VideosLipSyncResponseSchema>;

export const VideosTextToVideoReferenceSchema = z
	.object({
		name: z.string(),
		file_path: z.string().min(1),
	})
	.catchall(z.unknown());

export const VideosTextToVideoInputSchema = z
	.object({
		name: z.string().optional(),
		end_seconds: z.number().min(1).max(60),
		aspect_ratio: z.enum(['16:9', '9:16', '1:1']).optional(),
		resolution: z.enum(['360p', '480p', '720p', '1080p', '4k']).optional(),
		// ~20-value provider model catalog that changes often, so a string.
		model: z.string().optional(),
		audio: z.boolean().optional(),
		style: z
			.object({
				prompt: z.string().min(1).max(20000),
			})
			.catchall(z.unknown()),
		references: z
			.array(VideosTextToVideoReferenceSchema)
			.min(1)
			.max(10)
			.optional(),
	})
	.catchall(z.unknown());

export type VideosTextToVideoInput = z.infer<
	typeof VideosTextToVideoInputSchema
>;

export const VideosTextToVideoResponseSchema = GenerateResponseSchema;
export type VideosTextToVideoResponse = z.infer<
	typeof VideosTextToVideoResponseSchema
>;

export const VideosVideoToVideoInputSchema = z
	.object({
		name: z.string().optional(),
		start_seconds: z.number().nonnegative(),
		end_seconds: z.number().min(0.1),
		fps_resolution: z.enum(['FULL', 'HALF']).optional(),
		style: z
			.object({
				// ~75-value provider art-style catalog; volatile, so a string.
				art_style: z.string(),
				version: z.enum(['v1', 'v2', 'default']).optional(),
				prompt_type: z.enum(['default', 'custom', 'append_default']).optional(),
				prompt: z.string().nullable().optional(),
				model: z
					.enum([
						'Dreamshaper',
						'Absolute Reality',
						'Flat 2D Anime',
						'Soft Anime',
						'Kaywaii',
						'Western Anime',
						'3D Anime',
						'default',
					])
					.optional(),
			})
			.catchall(z.unknown()),
		assets: z
			.object({
				video_source: VideoSourceSchema,
				video_file_path: z.string().optional(),
				youtube_url: z.string().optional(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type VideosVideoToVideoInput = z.infer<
	typeof VideosVideoToVideoInputSchema
>;

export const VideosVideoToVideoResponseSchema = GenerateResponseSchema;
export type VideosVideoToVideoResponse = z.infer<
	typeof VideosVideoToVideoResponseSchema
>;

// ── Image projects ──────────────────────────────────────────────────────────

export const ImageProjectsGetDetailsInputSchema = IdInputSchema;
export type ImageProjectsGetDetailsInput = z.infer<
	typeof ImageProjectsGetDetailsInputSchema
>;

export const ImageProjectResponseSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable(),
		status: ProjectStatusSchema,
		image_count: z.number().int(),
		type: z.string(),
		created_at: z.string(),
		enabled: z.boolean(),
		credits_charged: z.number().int(),
		// `downloads`/`error` are documented as present but relaxed to optional
		// so a freshly queued project parses cleanly before rendering finishes.
		downloads: z.array(DownloadSchema).optional(),
		error: ProjectErrorSchema.nullable().optional(),
	})
	.catchall(z.unknown());

export type ImageProjectResponse = z.infer<typeof ImageProjectResponseSchema>;

export const ImageProjectsDeleteInputSchema = IdInputSchema;
export type ImageProjectsDeleteInput = z.infer<
	typeof ImageProjectsDeleteInputSchema
>;

export const ImageProjectsDeleteResponseSchema = DeleteResponseSchema;
export type ImageProjectsDeleteResponse = z.infer<
	typeof ImageProjectsDeleteResponseSchema
>;

// ── Image generation ────────────────────────────────────────────────────────

export const ImagesClothesChangerInputSchema = z
	.object({
		name: z.string().optional(),
		assets: z
			.object({
				person_file_path: z.string().min(1),
				garment_file_path: z.string().min(1),
				garment_type: z
					.enum(['entire_outfit', 'upper_body', 'lower_body', 'dresses'])
					.optional(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type ImagesClothesChangerInput = z.infer<
	typeof ImagesClothesChangerInputSchema
>;

export const ImagesClothesChangerResponseSchema = GenerateResponseSchema;
export type ImagesClothesChangerResponse = z.infer<
	typeof ImagesClothesChangerResponseSchema
>;

const FaceEditorStyleSchema = z
	.object({
		enhance_face: z.boolean().optional(),
		eyebrow_direction: z.number().min(-100).max(100).optional(),
		eye_gaze_horizontal: z.number().min(-100).max(100).optional(),
		eye_gaze_vertical: z.number().min(-100).max(100).optional(),
		eye_open_ratio: z.number().min(-100).max(100).optional(),
		lip_open_ratio: z.number().min(-100).max(100).optional(),
		head_roll: z.number().min(-100).max(100).optional(),
		mouth_grim: z.number().min(-100).max(100).optional(),
		mouth_pout: z.number().min(-100).max(100).optional(),
		mouth_purse: z.number().min(-100).max(100).optional(),
		mouth_smile: z.number().min(-100).max(100).optional(),
		mouth_position_horizontal: z.number().min(-100).max(100).optional(),
		mouth_position_vertical: z.number().min(-100).max(100).optional(),
		head_pitch: z.number().min(-100).max(100).optional(),
		head_yaw: z.number().min(-100).max(100).optional(),
	})
	.catchall(z.unknown());

export const ImagesFaceEditorInputSchema = z
	.object({
		name: z.string().optional(),
		assets: z
			.object({
				image_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
		style: FaceEditorStyleSchema,
	})
	.catchall(z.unknown());

export type ImagesFaceEditorInput = z.infer<typeof ImagesFaceEditorInputSchema>;

export const ImagesFaceEditorResponseSchema = GenerateResponseSchema;
export type ImagesFaceEditorResponse = z.infer<
	typeof ImagesFaceEditorResponseSchema
>;

export const ImagesGifGeneratorInputSchema = z
	.object({
		name: z.string().optional(),
		style: z
			.object({
				prompt: z.string().min(1).max(500),
			})
			.catchall(z.unknown()),
		output_format: z.enum(['gif', 'mp4', 'webm']).optional(),
	})
	.catchall(z.unknown());

export type ImagesGifGeneratorInput = z.infer<
	typeof ImagesGifGeneratorInputSchema
>;

export const ImagesGifGeneratorResponseSchema = GenerateResponseSchema;
export type ImagesGifGeneratorResponse = z.infer<
	typeof ImagesGifGeneratorResponseSchema
>;

export const ImagesHeadshotGeneratorInputSchema = z
	.object({
		name: z.string().optional(),
		style: z
			.object({
				prompt: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
		assets: z
			.object({
				image_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type ImagesHeadshotGeneratorInput = z.infer<
	typeof ImagesHeadshotGeneratorInputSchema
>;

export const ImagesHeadshotGeneratorResponseSchema = GenerateResponseSchema;
export type ImagesHeadshotGeneratorResponse = z.infer<
	typeof ImagesHeadshotGeneratorResponseSchema
>;

export const ImagesImageEditorInputSchema = z
	.object({
		name: z.string().optional(),
		image_count: z
			.union([z.literal(1), z.literal(4), z.literal(9), z.literal(16)])
			.optional(),
		// ~15-value provider model catalog that changes often, so a string.
		model: z.string().optional(),
		aspect_ratio: z
			.enum(['auto', '16:9', '9:16', '4:3', '3:2', '1:1', '4:5', '2:3'])
			.optional(),
		resolution: z.enum(['auto', '640px', '1k', '2k', '4k']).optional(),
		style: z
			.object({
				prompt: z.string().min(1).max(15000),
			})
			.catchall(z.unknown()),
		assets: z
			.object({
				image_file_paths: z.array(z.string().min(1)).max(10).optional(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type ImagesImageEditorInput = z.infer<
	typeof ImagesImageEditorInputSchema
>;

export const ImagesImageEditorResponseSchema = GenerateResponseSchema;
export type ImagesImageEditorResponse = z.infer<
	typeof ImagesImageEditorResponseSchema
>;

export const ImagesImageGeneratorInputSchema = z
	.object({
		name: z.string().optional(),
		image_count: z.number().int().min(1).max(16),
		// ~16-value provider model catalog that changes often, so a string.
		model: z.string().optional(),
		aspect_ratio: z.enum(['1:1', '16:9', '9:16']).optional(),
		resolution: z.enum(['auto', '640px', '1k', '2k', '4k']).optional(),
		style: z
			.object({
				prompt: z.string().min(1),
				// ~35-value provider tool catalog; volatile, so a string.
				tool: z.string().optional(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type ImagesImageGeneratorInput = z.infer<
	typeof ImagesImageGeneratorInputSchema
>;

export const ImagesImageGeneratorResponseSchema = GenerateResponseSchema;
export type ImagesImageGeneratorResponse = z.infer<
	typeof ImagesImageGeneratorResponseSchema
>;

export const ImagesImageUpscalerInputSchema = z
	.object({
		name: z.string().optional(),
		// The spec restricts this to exactly 2 or 4.
		scale_factor: z.union([z.literal(2), z.literal(4)]),
		style: z
			.object({
				mode: z.enum(['pro', 'preserve', 'balanced', 'creative']).optional(),
				prompt: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
		assets: z
			.object({
				image_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type ImagesImageUpscalerInput = z.infer<
	typeof ImagesImageUpscalerInputSchema
>;

export const ImagesImageUpscalerResponseSchema = GenerateResponseSchema;
export type ImagesImageUpscalerResponse = z.infer<
	typeof ImagesImageUpscalerResponseSchema
>;

export const ImagesMemeGeneratorInputSchema = z
	.object({
		name: z.string().optional(),
		style: z
			.object({
				topic: z.string().min(1).max(200),
				// ~100-value provider meme-template catalog; volatile, so a string.
				template: z.string(),
				searchWeb: z.boolean().optional(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type ImagesMemeGeneratorInput = z.infer<
	typeof ImagesMemeGeneratorInputSchema
>;

export const ImagesMemeGeneratorResponseSchema = GenerateResponseSchema;
export type ImagesMemeGeneratorResponse = z.infer<
	typeof ImagesMemeGeneratorResponseSchema
>;

export const ImagesQrCodeGeneratorInputSchema = z
	.object({
		name: z.string().optional(),
		content: z.string(),
		style: z
			.object({
				art_style: z.string(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type ImagesQrCodeGeneratorInput = z.infer<
	typeof ImagesQrCodeGeneratorInputSchema
>;

export const ImagesQrCodeGeneratorResponseSchema = GenerateResponseSchema;
export type ImagesQrCodeGeneratorResponse = z.infer<
	typeof ImagesQrCodeGeneratorResponseSchema
>;

export const ImagesBodySwapInputSchema = z
	.object({
		name: z.string().optional(),
		resolution: z.enum(['640px', '1k', '2k', '4k']),
		assets: z
			.object({
				person_file_path: z.string().min(1),
				scene_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type ImagesBodySwapInput = z.infer<typeof ImagesBodySwapInputSchema>;

export const ImagesBodySwapResponseSchema = GenerateResponseSchema;
export type ImagesBodySwapResponse = z.infer<
	typeof ImagesBodySwapResponseSchema
>;

export const ImagesFaceSwapPhotoInputSchema = z
	.object({
		name: z.string().optional(),
		assets: z
			.object({
				face_swap_mode: FaceSwapModeSchema.optional(),
				source_file_path: z.string().min(1).optional(),
				face_mappings: z.array(FaceMappingSchema).max(5).optional(),
				target_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type ImagesFaceSwapPhotoInput = z.infer<
	typeof ImagesFaceSwapPhotoInputSchema
>;

export const ImagesFaceSwapPhotoResponseSchema = GenerateResponseSchema;
export type ImagesFaceSwapPhotoResponse = z.infer<
	typeof ImagesFaceSwapPhotoResponseSchema
>;

export const ImagesHeadSwapInputSchema = z
	.object({
		name: z.string().optional(),
		max_resolution: z.number().int().optional(),
		assets: z
			.object({
				body_file_path: z.string().min(1),
				head_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type ImagesHeadSwapInput = z.infer<typeof ImagesHeadSwapInputSchema>;

export const ImagesHeadSwapResponseSchema = GenerateResponseSchema;
export type ImagesHeadSwapResponse = z.infer<
	typeof ImagesHeadSwapResponseSchema
>;

export const ImagesBackgroundRemoverInputSchema = z
	.object({
		name: z.string().optional(),
		assets: z
			.object({
				image_file_path: z.string(),
				background_image_file_path: z.string().optional(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type ImagesBackgroundRemoverInput = z.infer<
	typeof ImagesBackgroundRemoverInputSchema
>;

export const ImagesBackgroundRemoverResponseSchema = GenerateResponseSchema;
export type ImagesBackgroundRemoverResponse = z.infer<
	typeof ImagesBackgroundRemoverResponseSchema
>;

export const ImagesPhotoColorizerInputSchema = z
	.object({
		name: z.string().optional(),
		assets: z
			.object({
				image_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type ImagesPhotoColorizerInput = z.infer<
	typeof ImagesPhotoColorizerInputSchema
>;

export const ImagesPhotoColorizerResponseSchema = GenerateResponseSchema;
export type ImagesPhotoColorizerResponse = z.infer<
	typeof ImagesPhotoColorizerResponseSchema
>;

// ── Audio projects ──────────────────────────────────────────────────────────

export const AudioProjectsGetDetailsInputSchema = IdInputSchema;
export type AudioProjectsGetDetailsInput = z.infer<
	typeof AudioProjectsGetDetailsInputSchema
>;

export const AudioProjectResponseSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable(),
		status: ProjectStatusSchema,
		type: z.string(),
		created_at: z.string(),
		enabled: z.boolean(),
		credits_charged: z.number().int(),
		// Relaxed to optional for the same reason as the video/image projects.
		downloads: z.array(DownloadSchema).optional(),
		error: ProjectErrorSchema.nullable().optional(),
	})
	.catchall(z.unknown());

export type AudioProjectResponse = z.infer<typeof AudioProjectResponseSchema>;

export const AudioProjectsDeleteInputSchema = IdInputSchema;
export type AudioProjectsDeleteInput = z.infer<
	typeof AudioProjectsDeleteInputSchema
>;

export const AudioProjectsDeleteResponseSchema = DeleteResponseSchema;
export type AudioProjectsDeleteResponse = z.infer<
	typeof AudioProjectsDeleteResponseSchema
>;

// ── Audio generation ────────────────────────────────────────────────────────

export const AudioVoiceGeneratorInputSchema = z
	.object({
		name: z.string().optional(),
		style: z
			.object({
				prompt: z.string().min(1),
				// Hundreds of provider voice names; volatile, so a string.
				voice_name: z.string(),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type AudioVoiceGeneratorInput = z.infer<
	typeof AudioVoiceGeneratorInputSchema
>;

export const AudioVoiceGeneratorResponseSchema = GenerateResponseSchema;
export type AudioVoiceGeneratorResponse = z.infer<
	typeof AudioVoiceGeneratorResponseSchema
>;

export const AudioVoiceClonerInputSchema = z
	.object({
		name: z.string().optional(),
		assets: z
			.object({
				audio_file_path: z.string().min(1),
			})
			.catchall(z.unknown()),
		style: z
			.object({
				prompt: z.string().min(1).max(1000),
			})
			.catchall(z.unknown()),
	})
	.catchall(z.unknown());

export type AudioVoiceClonerInput = z.infer<typeof AudioVoiceClonerInputSchema>;

export const AudioVoiceClonerResponseSchema = GenerateResponseSchema;
export type AudioVoiceClonerResponse = z.infer<
	typeof AudioVoiceClonerResponseSchema
>;

// ── Plugin endpoint input/output collections ────────────────────────────────

export type MagicHourEndpointInputs = {
	accountGet: AccountGetInput;
	filesGenerateUploadUrls: FilesGenerateUploadUrlsInput;
	filesSavedItemsList: FilesSavedItemsListInput;
	faceDetectionDetect: FaceDetectionDetectInput;
	faceDetectionGetDetails: FaceDetectionGetDetailsInput;
	videoProjectsGetDetails: VideoProjectsGetDetailsInput;
	videoProjectsDelete: VideoProjectsDeleteInput;
	videosTalkingPhoto: VideosTalkingPhotoInput;
	videosUgcAd: VideosUgcAdInput;
	videosVideoEditor: VideosVideoEditorInput;
	videosVideoTranslator: VideosVideoTranslatorInput;
	videosAnimation: VideosAnimationInput;
	videosAudioToVideo: VideosAudioToVideoInput;
	videosAutoSubtitleGenerator: VideosAutoSubtitleGeneratorInput;
	videosCharacterReplace: VideosCharacterReplaceInput;
	videosFaceSwap: VideosFaceSwapInput;
	videosImageToVideo: VideosImageToVideoInput;
	videosLipSync: VideosLipSyncInput;
	videosTextToVideo: VideosTextToVideoInput;
	videosVideoToVideo: VideosVideoToVideoInput;
	imageProjectsGetDetails: ImageProjectsGetDetailsInput;
	imageProjectsDelete: ImageProjectsDeleteInput;
	imagesClothesChanger: ImagesClothesChangerInput;
	imagesFaceEditor: ImagesFaceEditorInput;
	imagesGifGenerator: ImagesGifGeneratorInput;
	imagesHeadshotGenerator: ImagesHeadshotGeneratorInput;
	imagesImageEditor: ImagesImageEditorInput;
	imagesImageGenerator: ImagesImageGeneratorInput;
	imagesImageUpscaler: ImagesImageUpscalerInput;
	imagesMemeGenerator: ImagesMemeGeneratorInput;
	imagesQrCodeGenerator: ImagesQrCodeGeneratorInput;
	imagesBodySwap: ImagesBodySwapInput;
	imagesFaceSwapPhoto: ImagesFaceSwapPhotoInput;
	imagesHeadSwap: ImagesHeadSwapInput;
	imagesBackgroundRemover: ImagesBackgroundRemoverInput;
	imagesPhotoColorizer: ImagesPhotoColorizerInput;
	audioProjectsGetDetails: AudioProjectsGetDetailsInput;
	audioProjectsDelete: AudioProjectsDeleteInput;
	audioVoiceGenerator: AudioVoiceGeneratorInput;
	audioVoiceCloner: AudioVoiceClonerInput;
};

export type MagicHourEndpointOutputs = {
	accountGet: AccountGetResponse;
	filesGenerateUploadUrls: FilesGenerateUploadUrlsResponse;
	filesSavedItemsList: FilesSavedItemsListResponse;
	faceDetectionDetect: FaceDetectionDetectResponse;
	faceDetectionGetDetails: FaceDetectionGetDetailsResponse;
	videoProjectsGetDetails: VideoProjectResponse;
	videoProjectsDelete: VideoProjectsDeleteResponse;
	videosTalkingPhoto: VideosTalkingPhotoResponse;
	videosUgcAd: VideosUgcAdResponse;
	videosVideoEditor: VideosVideoEditorResponse;
	videosVideoTranslator: VideosVideoTranslatorResponse;
	videosAnimation: VideosAnimationResponse;
	videosAudioToVideo: VideosAudioToVideoResponse;
	videosAutoSubtitleGenerator: VideosAutoSubtitleGeneratorResponse;
	videosCharacterReplace: VideosCharacterReplaceResponse;
	videosFaceSwap: VideosFaceSwapResponse;
	videosImageToVideo: VideosImageToVideoResponse;
	videosLipSync: VideosLipSyncResponse;
	videosTextToVideo: VideosTextToVideoResponse;
	videosVideoToVideo: VideosVideoToVideoResponse;
	imageProjectsGetDetails: ImageProjectResponse;
	imageProjectsDelete: ImageProjectsDeleteResponse;
	imagesClothesChanger: ImagesClothesChangerResponse;
	imagesFaceEditor: ImagesFaceEditorResponse;
	imagesGifGenerator: ImagesGifGeneratorResponse;
	imagesHeadshotGenerator: ImagesHeadshotGeneratorResponse;
	imagesImageEditor: ImagesImageEditorResponse;
	imagesImageGenerator: ImagesImageGeneratorResponse;
	imagesImageUpscaler: ImagesImageUpscalerResponse;
	imagesMemeGenerator: ImagesMemeGeneratorResponse;
	imagesQrCodeGenerator: ImagesQrCodeGeneratorResponse;
	imagesBodySwap: ImagesBodySwapResponse;
	imagesFaceSwapPhoto: ImagesFaceSwapPhotoResponse;
	imagesHeadSwap: ImagesHeadSwapResponse;
	imagesBackgroundRemover: ImagesBackgroundRemoverResponse;
	imagesPhotoColorizer: ImagesPhotoColorizerResponse;
	audioProjectsGetDetails: AudioProjectResponse;
	audioProjectsDelete: AudioProjectsDeleteResponse;
	audioVoiceGenerator: AudioVoiceGeneratorResponse;
	audioVoiceCloner: AudioVoiceClonerResponse;
};

export const MagicHourEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	filesGenerateUploadUrls: FilesGenerateUploadUrlsInputSchema,
	filesSavedItemsList: FilesSavedItemsListInputSchema,
	faceDetectionDetect: FaceDetectionDetectInputSchema,
	faceDetectionGetDetails: FaceDetectionGetDetailsInputSchema,
	videoProjectsGetDetails: VideoProjectsGetDetailsInputSchema,
	videoProjectsDelete: VideoProjectsDeleteInputSchema,
	videosTalkingPhoto: VideosTalkingPhotoInputSchema,
	videosUgcAd: VideosUgcAdInputSchema,
	videosVideoEditor: VideosVideoEditorInputSchema,
	videosVideoTranslator: VideosVideoTranslatorInputSchema,
	videosAnimation: VideosAnimationInputSchema,
	videosAudioToVideo: VideosAudioToVideoInputSchema,
	videosAutoSubtitleGenerator: VideosAutoSubtitleGeneratorInputSchema,
	videosCharacterReplace: VideosCharacterReplaceInputSchema,
	videosFaceSwap: VideosFaceSwapInputSchema,
	videosImageToVideo: VideosImageToVideoInputSchema,
	videosLipSync: VideosLipSyncInputSchema,
	videosTextToVideo: VideosTextToVideoInputSchema,
	videosVideoToVideo: VideosVideoToVideoInputSchema,
	imageProjectsGetDetails: ImageProjectsGetDetailsInputSchema,
	imageProjectsDelete: ImageProjectsDeleteInputSchema,
	imagesClothesChanger: ImagesClothesChangerInputSchema,
	imagesFaceEditor: ImagesFaceEditorInputSchema,
	imagesGifGenerator: ImagesGifGeneratorInputSchema,
	imagesHeadshotGenerator: ImagesHeadshotGeneratorInputSchema,
	imagesImageEditor: ImagesImageEditorInputSchema,
	imagesImageGenerator: ImagesImageGeneratorInputSchema,
	imagesImageUpscaler: ImagesImageUpscalerInputSchema,
	imagesMemeGenerator: ImagesMemeGeneratorInputSchema,
	imagesQrCodeGenerator: ImagesQrCodeGeneratorInputSchema,
	imagesBodySwap: ImagesBodySwapInputSchema,
	imagesFaceSwapPhoto: ImagesFaceSwapPhotoInputSchema,
	imagesHeadSwap: ImagesHeadSwapInputSchema,
	imagesBackgroundRemover: ImagesBackgroundRemoverInputSchema,
	imagesPhotoColorizer: ImagesPhotoColorizerInputSchema,
	audioProjectsGetDetails: AudioProjectsGetDetailsInputSchema,
	audioProjectsDelete: AudioProjectsDeleteInputSchema,
	audioVoiceGenerator: AudioVoiceGeneratorInputSchema,
	audioVoiceCloner: AudioVoiceClonerInputSchema,
} as const;

export const MagicHourEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	filesGenerateUploadUrls: FilesGenerateUploadUrlsResponseSchema,
	filesSavedItemsList: FilesSavedItemsListResponseSchema,
	faceDetectionDetect: FaceDetectionDetectResponseSchema,
	faceDetectionGetDetails: FaceDetectionGetDetailsResponseSchema,
	videoProjectsGetDetails: VideoProjectResponseSchema,
	videoProjectsDelete: VideoProjectsDeleteResponseSchema,
	videosTalkingPhoto: VideosTalkingPhotoResponseSchema,
	videosUgcAd: VideosUgcAdResponseSchema,
	videosVideoEditor: VideosVideoEditorResponseSchema,
	videosVideoTranslator: VideosVideoTranslatorResponseSchema,
	videosAnimation: VideosAnimationResponseSchema,
	videosAudioToVideo: VideosAudioToVideoResponseSchema,
	videosAutoSubtitleGenerator: VideosAutoSubtitleGeneratorResponseSchema,
	videosCharacterReplace: VideosCharacterReplaceResponseSchema,
	videosFaceSwap: VideosFaceSwapResponseSchema,
	videosImageToVideo: VideosImageToVideoResponseSchema,
	videosLipSync: VideosLipSyncResponseSchema,
	videosTextToVideo: VideosTextToVideoResponseSchema,
	videosVideoToVideo: VideosVideoToVideoResponseSchema,
	imageProjectsGetDetails: ImageProjectResponseSchema,
	imageProjectsDelete: ImageProjectsDeleteResponseSchema,
	imagesClothesChanger: ImagesClothesChangerResponseSchema,
	imagesFaceEditor: ImagesFaceEditorResponseSchema,
	imagesGifGenerator: ImagesGifGeneratorResponseSchema,
	imagesHeadshotGenerator: ImagesHeadshotGeneratorResponseSchema,
	imagesImageEditor: ImagesImageEditorResponseSchema,
	imagesImageGenerator: ImagesImageGeneratorResponseSchema,
	imagesImageUpscaler: ImagesImageUpscalerResponseSchema,
	imagesMemeGenerator: ImagesMemeGeneratorResponseSchema,
	imagesQrCodeGenerator: ImagesQrCodeGeneratorResponseSchema,
	imagesBodySwap: ImagesBodySwapResponseSchema,
	imagesFaceSwapPhoto: ImagesFaceSwapPhotoResponseSchema,
	imagesHeadSwap: ImagesHeadSwapResponseSchema,
	imagesBackgroundRemover: ImagesBackgroundRemoverResponseSchema,
	imagesPhotoColorizer: ImagesPhotoColorizerResponseSchema,
	audioProjectsGetDetails: AudioProjectResponseSchema,
	audioProjectsDelete: AudioProjectsDeleteResponseSchema,
	audioVoiceGenerator: AudioVoiceGeneratorResponseSchema,
	audioVoiceCloner: AudioVoiceClonerResponseSchema,
} as const;
