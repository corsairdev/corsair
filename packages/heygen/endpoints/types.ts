import { z } from 'zod';

/**
 * HeyGen wraps nearly all responses in this `{ error, data }` envelope (confirmed across
 * v1 and v2 endpoints in HeyGen's official docs/SDK samples). `data` shapes below are kept
 * loose (z.unknown()/.catchall) wherever the exact response fields aren't documented, per
 * project convention for fallback schemas.
 */
function wrapResponse<T extends z.ZodTypeAny>(dataSchema: T) {
	return z.object({
		error: z.unknown().nullable().optional(),
		data: dataSchema,
	});
}

// ---------------------------------------------------------------------------
// Shared sub-schemas
// ---------------------------------------------------------------------------

const DimensionSchema = z.object({
	width: z.number(),
	height: z.number(),
});

// Shared v3 "reference an asset" union (url or an already-uploaded asset_id), used across
// video translations, lipsync, proofread, and hyperframes per developers.heygen.com.
const AssetRefSchema = z.union([
	z.object({ type: z.literal('url'), url: z.string() }),
	z.object({ type: z.literal('asset_id'), asset_id: z.string() }),
]);

// Same as AssetRefSchema plus an inline base64 variant, used where v3 supports uploading
// raw bytes directly (video agent files, avatar creation, AI clipping source video).
const AssetRefWithBase64Schema = z.union([
	z.object({ type: z.literal('url'), url: z.string() }),
	z.object({ type: z.literal('asset_id'), asset_id: z.string() }),
	z.object({
		type: z.literal('base64'),
		media_type: z.string(),
		data: z.string(),
	}),
]);

// v3 success responses are NOT wrapped in the v1/v2 `{error, data}` envelope — they're a flat
// `{data: T}` (or, for lists, `{data: [...], has_more, next_token}`); HTTP errors surface as a
// separate `{error: StandardAPIError}` shape that never reaches these success schemas, since
// makeHeygenRequest throws ApiError on non-2xx responses before Zod ever sees the body.
function v3Response<T extends z.ZodTypeAny>(dataSchema: T) {
	return z.object({ data: dataSchema });
}

// Shared v3 cursor-paginated list envelope: { data: [...], has_more, next_token }.
function v3PaginatedResponse<T extends z.ZodTypeAny>(itemSchema: T) {
	return z.object({
		data: z.array(itemSchema),
		has_more: z.boolean(),
		next_token: z.string().nullable(),
	});
}

// ---------------------------------------------------------------------------
// Domain 1: Videos (generation, templates, translate, personalization) — 12 ops
// ---------------------------------------------------------------------------

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (POST /v3/videos). The v3
// body is a discriminated union on `type`; only fields shared across the `avatar`, `image`,
// and `cinematic_avatar` variants are modeled strictly below, the rest is passed through.
const VideosGenerateInputSchema = z
	.object({
		type: z.enum(['avatar', 'image', 'cinematic_avatar']),
		title: z.string().optional(),
		resolution: z.string().optional(),
		aspect_ratio: z.string().nullable().optional(),
		callback_url: z.string().optional(),
		callback_id: z.string().nullable().optional(),
		folder_id: z.string().optional(),
	})
	.catchall(z.unknown());
export type VideosGenerateInput = z.infer<typeof VideosGenerateInputSchema>;

const VideosGenerateResponseSchema = v3Response(
	z.object({
		video_id: z.string(),
		status: z.string().optional(),
		output_format: z.enum(['mp4', 'webm']).optional(),
	}),
);
export type VideosGenerateResponse = z.infer<
	typeof VideosGenerateResponseSchema
>;

const VideosTemplateGenerateInputSchema = z.object({
	template_id: z.string(),
	title: z.string().optional(),
	caption: z.boolean().optional(),
	test: z.boolean().optional(),
	dimension: DimensionSchema.optional(),
	folder_id: z.string().optional(),
	// Keyed by template variable name; shape depends on the variable's type (text/image/
	// video/audio/voice), so the per-variable value is left permissive.
	variables: z.record(z.string(), z.unknown()).optional(),
});
export type VideosTemplateGenerateInput = z.infer<
	typeof VideosTemplateGenerateInputSchema
>;

const VideosTemplateGenerateResponseSchema = wrapResponse(
	z.object({ video_id: z.string() }),
);
export type VideosTemplateGenerateResponse = z.infer<
	typeof VideosTemplateGenerateResponseSchema
>;

// [B] Path inferred as `/v1/video.webm`, a legacy sibling of `/v1/video.list` /
// `/v1/video.delete`, distinct from the general `/v2/video/generate` endpoint.
const VideosCreateWebmInputSchema = z.object({
	avatar_id: z.string(),
	avatar_style: z.string().optional(),
	input_text: z.string().optional(),
	input_audio: z.string().optional(),
	voice_id: z.string().optional(),
	background_color: z.string().optional(),
	title: z.string().optional(),
	callback_id: z.string().nullable().optional(),
});
export type VideosCreateWebmInput = z.infer<typeof VideosCreateWebmInputSchema>;

const VideosCreateWebmResponseSchema = wrapResponse(
	z.object({ video_id: z.string() }),
);
export type VideosCreateWebmResponse = z.infer<
	typeof VideosCreateWebmResponseSchema
>;

const VideosPersonalizedAddContactInputSchema = z.object({
	project_id: z.string(),
	variables_list: z.array(
		z
			.object({
				email: z.string().optional(),
				first_name: z.string().optional(),
			})
			.catchall(z.unknown()),
	),
});
export type VideosPersonalizedAddContactInput = z.infer<
	typeof VideosPersonalizedAddContactInputSchema
>;

const VideosPersonalizedAddContactResponseSchema = wrapResponse(
	// Response shape not documented beyond success/failure; kept permissive.
	z.record(z.string(), z.unknown()),
);
export type VideosPersonalizedAddContactResponse = z.infer<
	typeof VideosPersonalizedAddContactResponseSchema
>;

const VideosPersonalizedProjectDetailInputSchema = z.object({
	id: z.string(),
});
export type VideosPersonalizedProjectDetailInput = z.infer<
	typeof VideosPersonalizedProjectDetailInputSchema
>;

const VideosPersonalizedProjectDetailResponseSchema = wrapResponse(
	z
		.object({
			project_id: z.string().optional(),
			status: z.string().optional(),
		})
		.catchall(z.unknown()),
);
export type VideosPersonalizedProjectDetailResponse = z.infer<
	typeof VideosPersonalizedProjectDetailResponseSchema
>;

const VideosGetStatusInputSchema = z.object({
	video_id: z.string(),
});
export type VideosGetStatusInput = z.infer<typeof VideosGetStatusInputSchema>;

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (GET /v3/videos/{video_id}).
const VideosGetStatusResponseSchema = v3Response(
	z.object({
		id: z.string(),
		title: z.string().nullable().optional(),
		status: z.enum(['pending', 'processing', 'completed', 'failed']),
		created_at: z.number().nullable().optional(),
		completed_at: z.number().nullable().optional(),
		video_url: z.string().nullable().optional(),
		thumbnail_url: z.string().nullable().optional(),
		gif_url: z.string().nullable().optional(),
		captioned_video_url: z.string().nullable().optional(),
		subtitle_url: z.string().nullable().optional(),
		duration: z.number().nullable().optional(),
		folder_id: z.string().nullable().optional(),
		output_language: z.string().nullable().optional(),
		failure_code: z.string().nullable().optional(),
		failure_message: z.string().nullable().optional(),
		video_page_url: z.string().nullable().optional(),
	}),
);
export type VideosGetStatusResponse = z.infer<
	typeof VideosGetStatusResponseSchema
>;

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (POST /v3/video-translations).
const VideosTranslateInputSchema = z.object({
	video: AssetRefSchema,
	output_languages: z.array(z.string()).min(1),
	title: z.string().optional(),
	audio: AssetRefSchema.nullable().optional(),
	input_language: z.string().nullable().optional(),
	translate_audio_only: z.boolean().optional(),
	speaker_num: z.number().nullable().optional(),
	mode: z.enum(['speed', 'precision']).optional(),
	callback_url: z.string().nullable().optional(),
	callback_id: z.string().nullable().optional(),
	enable_caption: z.boolean().optional(),
	folder_id: z.string().nullable().optional(),
});
export type VideosTranslateInput = z.infer<typeof VideosTranslateInputSchema>;

const VideosTranslateResponseSchema = v3Response(
	z.object({ video_translation_ids: z.array(z.string()) }),
);
export type VideosTranslateResponse = z.infer<
	typeof VideosTranslateResponseSchema
>;

const VideosTranslateStatusInputSchema = z.object({
	video_translate_id: z.string(),
});
export type VideosTranslateStatusInput = z.infer<
	typeof VideosTranslateStatusInputSchema
>;

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (GET /v3/video-translations/{id}).
const VideosTranslateStatusResponseSchema = v3Response(
	z.object({
		id: z.string(),
		status: z.enum(['pending', 'running', 'completed', 'failed']),
		title: z.string().nullable().optional(),
		output_language: z.string().nullable().optional(),
		input_language: z.string().nullable().optional(),
		duration: z.number().nullable().optional(),
		translate_audio_only: z.boolean().nullable().optional(),
		video_url: z.string().nullable().optional(),
		audio_url: z.string().nullable().optional(),
		srt_caption_url: z.string().nullable().optional(),
		vtt_caption_url: z.string().nullable().optional(),
		callback_id: z.string().nullable().optional(),
		created_at: z.number().nullable().optional(),
		failure_message: z.string().nullable().optional(),
	}),
);
export type VideosTranslateStatusResponse = z.infer<
	typeof VideosTranslateStatusResponseSchema
>;

const VideosTranslateTargetLanguagesInputSchema = z.object({});
export type VideosTranslateTargetLanguagesInput = z.infer<
	typeof VideosTranslateTargetLanguagesInputSchema
>;

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (GET /v3/video-translations/languages).
const VideosTranslateTargetLanguagesResponseSchema = v3Response(
	z.object({ languages: z.array(z.string()) }),
);
export type VideosTranslateTargetLanguagesResponse = z.infer<
	typeof VideosTranslateTargetLanguagesResponseSchema
>;

// [B] Path inferred as `/v1/video/share`; HeyGen's docs describe the behavior (a public,
// unauthenticated share link) but no longer expose the concrete path/method.
const VideosGetSharableUrlInputSchema = z.object({
	video_id: z.string(),
});
export type VideosGetSharableUrlInput = z.infer<
	typeof VideosGetSharableUrlInputSchema
>;

const VideosGetSharableUrlResponseSchema = wrapResponse(
	z.object({ share_url: z.string() }).catchall(z.unknown()),
);
export type VideosGetSharableUrlResponse = z.infer<
	typeof VideosGetSharableUrlResponseSchema
>;

const VideosDeleteInputSchema = z.object({
	video_id: z.string(),
});
export type VideosDeleteInput = z.infer<typeof VideosDeleteInputSchema>;

const VideosDeleteResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type VideosDeleteResponse = z.infer<typeof VideosDeleteResponseSchema>;

const VideosListInputSchema = z.object({
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type VideosListInput = z.infer<typeof VideosListInputSchema>;

const VideosListResponseSchema = wrapResponse(
	z.object({
		videos: z.array(z.record(z.string(), z.unknown())),
		token: z.string().optional(),
	}),
);
export type VideosListResponse = z.infer<typeof VideosListResponseSchema>;

// ---------------------------------------------------------------------------
// Domain 2: Avatars, Looks & Talking Photos — 18 ops
// ---------------------------------------------------------------------------

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (GET /v3/avatars).
const AvatarsListInputSchema = z.object({
	ownership: z.enum(['public', 'private']).optional(),
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type AvatarsListInput = z.infer<typeof AvatarsListInputSchema>;

const AvatarsListResponseSchema = v3PaginatedResponse(
	z.record(z.string(), z.unknown()),
);
export type AvatarsListResponse = z.infer<typeof AvatarsListResponseSchema>;

// [B] Path inferred as `/v2/avatar/{id}/details`, mirroring the `/details` suffix pattern
// used by other HeyGen "retrieve details" operations.
const AvatarsGetDetailsInputSchema = z.object({
	avatar_id: z.string(),
});
export type AvatarsGetDetailsInput = z.infer<
	typeof AvatarsGetDetailsInputSchema
>;

const AvatarsGetDetailsResponseSchema = wrapResponse(
	z.object({ avatar_id: z.string().optional() }).catchall(z.unknown()),
);
export type AvatarsGetDetailsResponse = z.infer<
	typeof AvatarsGetDetailsResponseSchema
>;

// [B] Path inferred as `/v2/avatar_group/list`.
const AvatarsListGroupsInputSchema = z.object({});
export type AvatarsListGroupsInput = z.infer<
	typeof AvatarsListGroupsInputSchema
>;

const AvatarsListGroupsResponseSchema = wrapResponse(
	z.object({ avatar_group_list: z.array(z.record(z.string(), z.unknown())) }),
);
export type AvatarsListGroupsResponse = z.infer<
	typeof AvatarsListGroupsResponseSchema
>;

const AvatarsListGroupAvatarsInputSchema = z.object({
	group_id: z.string(),
});
export type AvatarsListGroupAvatarsInput = z.infer<
	typeof AvatarsListGroupAvatarsInputSchema
>;

const AvatarsListGroupAvatarsResponseSchema = wrapResponse(
	z.object({ avatar_list: z.array(z.record(z.string(), z.unknown())) }),
);
export type AvatarsListGroupAvatarsResponse = z.infer<
	typeof AvatarsListGroupAvatarsResponseSchema
>;

// [B] Path inferred as `/v2/avatar_group/search_public`.
const AvatarsSearchPublicGroupsInputSchema = z.object({
	keyword: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
});
export type AvatarsSearchPublicGroupsInput = z.infer<
	typeof AvatarsSearchPublicGroupsInputSchema
>;

const AvatarsSearchPublicGroupsResponseSchema = wrapResponse(
	z.object({ avatar_group_list: z.array(z.record(z.string(), z.unknown())) }),
);
export type AvatarsSearchPublicGroupsResponse = z.infer<
	typeof AvatarsSearchPublicGroupsResponseSchema
>;

const AvatarsCreatePhotoGroupInputSchema = z.object({
	name: z.string(),
	image_key: z.string(),
	generation_id: z.string().optional(),
});
export type AvatarsCreatePhotoGroupInput = z.infer<
	typeof AvatarsCreatePhotoGroupInputSchema
>;

const AvatarsCreatePhotoGroupResponseSchema = wrapResponse(
	z.object({
		id: z.string(),
		image_url: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
	}),
);
export type AvatarsCreatePhotoGroupResponse = z.infer<
	typeof AvatarsCreatePhotoGroupResponseSchema
>;

const AvatarsGeneratePhotosInputSchema = z.object({
	name: z.string(),
	age: z.string(),
	gender: z.string(),
	ethnicity: z.string(),
	orientation: z.string(),
	pose: z.string(),
	style: z.string(),
	appearance: z.string(),
});
export type AvatarsGeneratePhotosInput = z.infer<
	typeof AvatarsGeneratePhotosInputSchema
>;

const AvatarsGeneratePhotosResponseSchema = wrapResponse(
	z.object({ generation_id: z.string() }),
);
export type AvatarsGeneratePhotosResponse = z.infer<
	typeof AvatarsGeneratePhotosResponseSchema
>;

const AvatarsAddLooksInputSchema = z.object({
	group_id: z.string(),
	image_keys: z.array(z.string()),
	name: z.string().optional(),
	generation_id: z.string().optional(),
});
export type AvatarsAddLooksInput = z.infer<typeof AvatarsAddLooksInputSchema>;

const AvatarsAddLooksResponseSchema = wrapResponse(
	z.object({ generation_id: z.string().optional() }).catchall(z.unknown()),
);
export type AvatarsAddLooksResponse = z.infer<
	typeof AvatarsAddLooksResponseSchema
>;

const AvatarsCheckLookStatusInputSchema = z.object({
	generation_id: z.string(),
});
export type AvatarsCheckLookStatusInput = z.infer<
	typeof AvatarsCheckLookStatusInputSchema
>;

const AvatarsCheckLookStatusResponseSchema = wrapResponse(
	z
		.object({
			generation_id: z.string().optional(),
			status: z.string().optional(),
			image_url_list: z.array(z.string()).optional(),
		})
		.catchall(z.unknown()),
);
export type AvatarsCheckLookStatusResponse = z.infer<
	typeof AvatarsCheckLookStatusResponseSchema
>;

// [B] Path inferred as `/v2/photo_avatar/train/status/{group_id}`.
const AvatarsGetTrainingStatusInputSchema = z.object({
	group_id: z.string(),
});
export type AvatarsGetTrainingStatusInput = z.infer<
	typeof AvatarsGetTrainingStatusInputSchema
>;

const AvatarsGetTrainingStatusResponseSchema = wrapResponse(
	z.object({ status: z.string() }).catchall(z.unknown()),
);
export type AvatarsGetTrainingStatusResponse = z.infer<
	typeof AvatarsGetTrainingStatusResponseSchema
>;

// [B] Path inferred as `/v2/photo_avatar/{id}`.
const AvatarsGetPhotoDetailsInputSchema = z.object({
	id: z.string(),
});
export type AvatarsGetPhotoDetailsInput = z.infer<
	typeof AvatarsGetPhotoDetailsInputSchema
>;

const AvatarsGetPhotoDetailsResponseSchema = wrapResponse(
	z.object({ id: z.string().optional() }).catchall(z.unknown()),
);
export type AvatarsGetPhotoDetailsResponse = z.infer<
	typeof AvatarsGetPhotoDetailsResponseSchema
>;

// [B] Path inferred as `/v2/photo_avatar/avatar_group/{group_id}`.
const AvatarsDeletePhotoGroupInputSchema = z.object({
	group_id: z.string(),
});
export type AvatarsDeletePhotoGroupInput = z.infer<
	typeof AvatarsDeletePhotoGroupInputSchema
>;

const AvatarsDeletePhotoGroupResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type AvatarsDeletePhotoGroupResponse = z.infer<
	typeof AvatarsDeletePhotoGroupResponseSchema
>;

// [B] Path inferred as `/v2/photo_avatar/{id}`.
const AvatarsDeletePhotoInputSchema = z.object({
	id: z.string(),
});
export type AvatarsDeletePhotoInput = z.infer<
	typeof AvatarsDeletePhotoInputSchema
>;

const AvatarsDeletePhotoResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type AvatarsDeletePhotoResponse = z.infer<
	typeof AvatarsDeletePhotoResponseSchema
>;

const AvatarsAddMotionInputSchema = z.object({
	id: z.string(),
});
export type AvatarsAddMotionInput = z.infer<typeof AvatarsAddMotionInputSchema>;

const AvatarsAddMotionResponseSchema = wrapResponse(
	z.object({ id: z.string().optional() }).catchall(z.unknown()),
);
export type AvatarsAddMotionResponse = z.infer<
	typeof AvatarsAddMotionResponseSchema
>;

// [B] Path inferred as `/v2/photo_avatar/upscale`.
const AvatarsUpscaleInputSchema = z.object({
	id: z.string(),
});
export type AvatarsUpscaleInput = z.infer<typeof AvatarsUpscaleInputSchema>;

const AvatarsUpscaleResponseSchema = wrapResponse(
	z.object({ id: z.string().optional() }).catchall(z.unknown()),
);
export type AvatarsUpscaleResponse = z.infer<
	typeof AvatarsUpscaleResponseSchema
>;

const AvatarsListTalkingPhotosInputSchema = z.object({});
export type AvatarsListTalkingPhotosInput = z.infer<
	typeof AvatarsListTalkingPhotosInputSchema
>;

const AvatarsListTalkingPhotosResponseSchema = wrapResponse(
	z.array(z.record(z.string(), z.unknown())),
);
export type AvatarsListTalkingPhotosResponse = z.infer<
	typeof AvatarsListTalkingPhotosResponseSchema
>;

const AvatarsUploadTalkingPhotoInputSchema = z.object({
	// Raw image bytes, base64-encoded for transport through the plugin boundary; the
	// client sends them as the raw request body with the given content type.
	imageBase64: z.string(),
	contentType: z.string(),
});
export type AvatarsUploadTalkingPhotoInput = z.infer<
	typeof AvatarsUploadTalkingPhotoInputSchema
>;

const AvatarsUploadTalkingPhotoResponseSchema = wrapResponse(
	z.object({ talking_photo_id: z.string() }).catchall(z.unknown()),
);
export type AvatarsUploadTalkingPhotoResponse = z.infer<
	typeof AvatarsUploadTalkingPhotoResponseSchema
>;

const AvatarsDeleteTalkingPhotoInputSchema = z.object({
	talking_photo_id: z.string(),
});
export type AvatarsDeleteTalkingPhotoInput = z.infer<
	typeof AvatarsDeleteTalkingPhotoInputSchema
>;

const AvatarsDeleteTalkingPhotoResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type AvatarsDeleteTalkingPhotoResponse = z.infer<
	typeof AvatarsDeleteTalkingPhotoResponseSchema
>;

// --- v3 additions: avatar groups/looks CRUD, per developers.heygen.com ---------

const AvatarErrorSchema = z.object({ code: z.string(), message: z.string() });
const AvatarStatusSchema = z.enum([
	'processing',
	'pending_consent',
	'failed',
	'completed',
]);

const AvatarGroupItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	created_at: z.number(),
	looks_count: z.number(),
	preview_image_url: z.string().nullable().optional(),
	preview_video_url: z.string().nullable().optional(),
	gender: z.string().nullable().optional(),
	default_voice_id: z.string().nullable().optional(),
	consent_status: z.string().nullable().optional(),
	status: AvatarStatusSchema.nullable().optional(),
	error: AvatarErrorSchema.nullable().optional(),
});

const AvatarLookItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatar_type: z.enum(['studio_avatar', 'digital_twin', 'photo_avatar']),
	group_id: z.string().nullable().optional(),
	preview_image_url: z.string().nullable().optional(),
	preview_video_url: z.string().nullable().optional(),
	gender: z.string().nullable().optional(),
	tags: z.array(z.string()).nullable().optional(),
	default_voice_id: z.string().nullable().optional(),
	supported_api_engines: z.array(z.string()).nullable().optional(),
	image_width: z.number().nullable().optional(),
	image_height: z.number().nullable().optional(),
	preferred_orientation: z
		.enum(['portrait', 'landscape', 'square'])
		.nullable()
		.optional(),
	status: AvatarStatusSchema.nullable().optional(),
	error: AvatarErrorSchema.nullable().optional(),
});

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (POST /v3/avatars).
const AvatarsCreateInputSchema = z.union([
	z.object({
		type: z.literal('prompt'),
		name: z.string(),
		prompt: z.string().max(1000),
		reference_images: z.array(AssetRefWithBase64Schema).max(3).optional(),
		avatar_group_id: z.string().nullable().optional(),
		avatar_id: z.string().nullable().optional(),
	}),
	z.object({
		type: z.literal('digital_twin'),
		name: z.string(),
		file: AssetRefWithBase64Schema,
		avatar_group_id: z.string().nullable().optional(),
	}),
	z.object({
		type: z.literal('photo'),
		name: z.string(),
		file: AssetRefWithBase64Schema,
		avatar_group_id: z.string().nullable().optional(),
	}),
]);
export type AvatarsCreateInput = z.infer<typeof AvatarsCreateInputSchema>;

const AvatarsCreateResponseSchema = v3Response(
	z.object({
		avatar_item: AvatarLookItemSchema.nullable(),
		avatar_group: AvatarGroupItemSchema.nullable(),
	}),
);
export type AvatarsCreateResponse = z.infer<typeof AvatarsCreateResponseSchema>;

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (GET /v3/avatars/{group_id}).
const AvatarsGetGroupInputSchema = z.object({ group_id: z.string() });
export type AvatarsGetGroupInput = z.infer<typeof AvatarsGetGroupInputSchema>;

const AvatarsGetGroupResponseSchema = v3Response(AvatarGroupItemSchema);
export type AvatarsGetGroupResponse = z.infer<
	typeof AvatarsGetGroupResponseSchema
>;

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (DELETE /v3/avatars/{group_id}).
const AvatarsDeleteGroupInputSchema = z.object({ group_id: z.string() });
export type AvatarsDeleteGroupInput = z.infer<
	typeof AvatarsDeleteGroupInputSchema
>;

const AvatarsDeleteGroupResponseSchema = v3Response(
	z.object({ id: z.string() }),
);
export type AvatarsDeleteGroupResponse = z.infer<
	typeof AvatarsDeleteGroupResponseSchema
>;

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (POST /v3/avatars/{group_id}/consent).
const AvatarsCreateConsentInputSchema = z.object({
	group_id: z.string(),
	reroute_url: z.string().nullable().optional(),
	consent_text: z.string().max(1000).nullable().optional(),
});
export type AvatarsCreateConsentInput = z.infer<
	typeof AvatarsCreateConsentInputSchema
>;

const AvatarsCreateConsentResponseSchema = v3Response(
	z.object({ avatar_group: AvatarGroupItemSchema, url: z.string() }),
);
export type AvatarsCreateConsentResponse = z.infer<
	typeof AvatarsCreateConsentResponseSchema
>;

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (GET /v3/avatars/looks).
const AvatarsListLooksInputSchema = z.object({
	group_id: z.string().optional(),
	avatar_type: z
		.enum(['studio_avatar', 'digital_twin', 'photo_avatar'])
		.optional(),
	ownership: z.enum(['public', 'private']).optional(),
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type AvatarsListLooksInput = z.infer<typeof AvatarsListLooksInputSchema>;

const AvatarsListLooksResponseSchema =
	v3PaginatedResponse(AvatarLookItemSchema);
export type AvatarsListLooksResponse = z.infer<
	typeof AvatarsListLooksResponseSchema
>;

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (GET /v3/avatars/looks/{look_id}).
const AvatarsGetLookInputSchema = z.object({ look_id: z.string() });
export type AvatarsGetLookInput = z.infer<typeof AvatarsGetLookInputSchema>;

const AvatarsGetLookResponseSchema = v3Response(AvatarLookItemSchema);
export type AvatarsGetLookResponse = z.infer<
	typeof AvatarsGetLookResponseSchema
>;

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (DELETE /v3/avatars/looks/{look_id}).
const AvatarsDeleteLookInputSchema = z.object({ look_id: z.string() });
export type AvatarsDeleteLookInput = z.infer<
	typeof AvatarsDeleteLookInputSchema
>;

const AvatarsDeleteLookResponseSchema = v3Response(
	z.object({ id: z.string() }),
);
export type AvatarsDeleteLookResponse = z.infer<
	typeof AvatarsDeleteLookResponseSchema
>;

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (PATCH /v3/avatars/looks/{look_id}).
const AvatarsUpdateLookInputSchema = z.object({
	look_id: z.string(),
	name: z.string().max(255).nullable().optional(),
});
export type AvatarsUpdateLookInput = z.infer<
	typeof AvatarsUpdateLookInputSchema
>;

const AvatarsUpdateLookResponseSchema = v3Response(AvatarLookItemSchema);
export type AvatarsUpdateLookResponse = z.infer<
	typeof AvatarsUpdateLookResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 3: Starfish Voice & TTS — 7 ops
// ---------------------------------------------------------------------------

// [B] Path inferred as `/v1/voice/generate`.
const VoicesGenerateSpeechInputSchema = z.object({
	text: z.string(),
	voice_id: z.string(),
	speed: z.number().optional(),
	pitch: z.number().optional(),
	locale: z.string().optional(),
	input_type: z.enum(['text', 'ssml']).optional(),
});
export type VoicesGenerateSpeechInput = z.infer<
	typeof VoicesGenerateSpeechInputSchema
>;

const VoicesGenerateSpeechResponseSchema = wrapResponse(
	z
		.object({
			audio_url: z.string().optional(),
			duration: z.number().optional(),
		})
		.catchall(z.unknown()),
);
export type VoicesGenerateSpeechResponse = z.infer<
	typeof VoicesGenerateSpeechResponseSchema
>;

// [B] Path inferred as `/v1/voice/preview` (Enterprise Beta feature per CLAUDE.md).
const VoicesGeneratePreviewInputSchema = z.object({
	voice_id: z.string(),
	text: z.string().optional(),
});
export type VoicesGeneratePreviewInput = z.infer<
	typeof VoicesGeneratePreviewInputSchema
>;

const VoicesGeneratePreviewResponseSchema = wrapResponse(
	z.object({ audio_url: z.string().optional() }).catchall(z.unknown()),
);
export type VoicesGeneratePreviewResponse = z.infer<
	typeof VoicesGeneratePreviewResponseSchema
>;

// [B] Path inferred as `/v1/voice/list_tts`.
const VoicesListTtsInputSchema = z.object({
	language: z.string().optional(),
	gender: z.string().optional(),
});
export type VoicesListTtsInput = z.infer<typeof VoicesListTtsInputSchema>;

const VoicesListTtsResponseSchema = wrapResponse(
	z.object({ voices: z.array(z.record(z.string(), z.unknown())) }),
);
export type VoicesListTtsResponse = z.infer<typeof VoicesListTtsResponseSchema>;

// [B] Path inferred as `/v1/voice/locale.list`.
const VoicesListLocalesInputSchema = z.object({});
export type VoicesListLocalesInput = z.infer<
	typeof VoicesListLocalesInputSchema
>;

const VoicesListLocalesResponseSchema = wrapResponse(
	z.object({ locales: z.array(z.record(z.string(), z.unknown())) }),
);
export type VoicesListLocalesResponse = z.infer<
	typeof VoicesListLocalesResponseSchema
>;

const VoicesListV2InputSchema = z.object({});
export type VoicesListV2Input = z.infer<typeof VoicesListV2InputSchema>;

const VoicesListV2ResponseSchema = wrapResponse(
	z.object({ voices: z.array(z.record(z.string(), z.unknown())) }),
);
export type VoicesListV2Response = z.infer<typeof VoicesListV2ResponseSchema>;

const VoicesListV1InputSchema = z.object({});
export type VoicesListV1Input = z.infer<typeof VoicesListV1InputSchema>;

const VoicesListV1ResponseSchema = wrapResponse(
	z.object({ voices: z.array(z.record(z.string(), z.unknown())) }),
);
export type VoicesListV1Response = z.infer<typeof VoicesListV1ResponseSchema>;

// [B] Path inferred as `/v1/voice/brand.list`.
const VoicesListBrandVoicesInputSchema = z.object({});
export type VoicesListBrandVoicesInput = z.infer<
	typeof VoicesListBrandVoicesInputSchema
>;

const VoicesListBrandVoicesResponseSchema = wrapResponse(
	z.object({ brand_voices: z.array(z.record(z.string(), z.unknown())) }),
);
export type VoicesListBrandVoicesResponse = z.infer<
	typeof VoicesListBrandVoicesResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 4: Real-Time Interactive Streaming Avatars — 12 ops
// ---------------------------------------------------------------------------

const StreamingNewSessionInputSchema = z.object({
	quality: z.string().optional(),
	avatar_id: z.string().optional(),
	// HeyGen accepts a free-form voice config object (voice_id, rate, emotion, etc.);
	// the exact key set varies by avatar/version and is not a fixed public schema.
	voice: z.record(z.string(), z.unknown()).optional(),
	knowledge_base_id: z.string().optional(),
	version: z.string().optional(),
});
export type StreamingNewSessionInput = z.infer<
	typeof StreamingNewSessionInputSchema
>;

const StreamingNewSessionResponseSchema = wrapResponse(
	z
		.object({
			session_id: z.string(),
			sdp: z.unknown().optional(),
			access_token: z.string().optional(),
			url: z.string().optional(),
			ice_servers: z.unknown().optional(),
			session_duration_limit: z.number().optional(),
		})
		.catchall(z.unknown()),
);
export type StreamingNewSessionResponse = z.infer<
	typeof StreamingNewSessionResponseSchema
>;

const StreamingCreateTokenInputSchema = z.object({});
export type StreamingCreateTokenInput = z.infer<
	typeof StreamingCreateTokenInputSchema
>;

const StreamingCreateTokenResponseSchema = wrapResponse(
	z.object({ token: z.string() }),
);
export type StreamingCreateTokenResponse = z.infer<
	typeof StreamingCreateTokenResponseSchema
>;

const StreamingStartInputSchema = z.object({
	session_id: z.string(),
	sdp: z.object({ type: z.string(), sdp: z.string() }),
});
export type StreamingStartInput = z.infer<typeof StreamingStartInputSchema>;

const StreamingStartResponseSchema = wrapResponse(
	z.object({ sdp: z.unknown().optional() }).catchall(z.unknown()),
);
export type StreamingStartResponse = z.infer<
	typeof StreamingStartResponseSchema
>;

const StreamingStopInputSchema = z.object({
	session_id: z.string(),
});
export type StreamingStopInput = z.infer<typeof StreamingStopInputSchema>;

const StreamingStopResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type StreamingStopResponse = z.infer<typeof StreamingStopResponseSchema>;

const StreamingInterruptInputSchema = z.object({
	session_id: z.string(),
});
export type StreamingInterruptInput = z.infer<
	typeof StreamingInterruptInputSchema
>;

const StreamingInterruptResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type StreamingInterruptResponse = z.infer<
	typeof StreamingInterruptResponseSchema
>;

// [B] Path inferred as `/v1/streaming.keep_alive`, mirroring the dot-style naming of
// sibling streaming.* endpoints.
const StreamingKeepAliveInputSchema = z.object({
	session_id: z.string(),
});
export type StreamingKeepAliveInput = z.infer<
	typeof StreamingKeepAliveInputSchema
>;

const StreamingKeepAliveResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type StreamingKeepAliveResponse = z.infer<
	typeof StreamingKeepAliveResponseSchema
>;

const StreamingTaskInputSchema = z.object({
	session_id: z.string(),
	text: z.string(),
	task_type: z.enum(['talk', 'repeat']).optional(),
});
export type StreamingTaskInput = z.infer<typeof StreamingTaskInputSchema>;

const StreamingTaskResponseSchema = wrapResponse(
	z.object({ duration_ms: z.number().optional() }).catchall(z.unknown()),
);
export type StreamingTaskResponse = z.infer<typeof StreamingTaskResponseSchema>;

const StreamingIceInputSchema = z.object({
	session_id: z.string(),
	candidate: z.object({
		candidate: z.string(),
		sdpMLineIndex: z.union([z.string(), z.number()]).optional(),
		sdpMid: z.string().optional(),
		usernameFragment: z.string().optional(),
	}),
});
export type StreamingIceInput = z.infer<typeof StreamingIceInputSchema>;

const StreamingIceResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type StreamingIceResponse = z.infer<typeof StreamingIceResponseSchema>;

const StreamingNewInputSchema = z.object({
	quality: z.string().optional(),
});
export type StreamingNewInput = z.infer<typeof StreamingNewInputSchema>;

const StreamingNewResponseSchema = wrapResponse(
	z
		.object({ session_id: z.string(), sdp: z.unknown().optional() })
		.catchall(z.unknown()),
);
export type StreamingNewResponse = z.infer<typeof StreamingNewResponseSchema>;

const StreamingListInputSchema = z.object({});
export type StreamingListInput = z.infer<typeof StreamingListInputSchema>;

const StreamingListResponseSchema = wrapResponse(
	z.object({ sessions: z.array(z.record(z.string(), z.unknown())) }),
);
export type StreamingListResponse = z.infer<typeof StreamingListResponseSchema>;

const StreamingListAvatarsInputSchema = z.object({});
export type StreamingListAvatarsInput = z.infer<
	typeof StreamingListAvatarsInputSchema
>;

const StreamingListAvatarsResponseSchema = wrapResponse(
	z.array(z.record(z.string(), z.unknown())),
);
export type StreamingListAvatarsResponse = z.infer<
	typeof StreamingListAvatarsResponseSchema
>;

// [B] Path inferred as `/v1/streaming.history`, distinguishing past sessions from the
// active-session list at `/v1/streaming.list`.
const StreamingListSessionHistoryInputSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
});
export type StreamingListSessionHistoryInput = z.infer<
	typeof StreamingListSessionHistoryInputSchema
>;

const StreamingListSessionHistoryResponseSchema = wrapResponse(
	z.object({ sessions: z.array(z.record(z.string(), z.unknown())) }),
);
export type StreamingListSessionHistoryResponse = z.infer<
	typeof StreamingListSessionHistoryResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 5: Knowledge Bases — 4 ops
// [B] All four paths inferred under the `/v1/streaming/knowledge_base/*` base confirmed
// by HeyGen's "Knowledge Base Management Endpoints" changelog entry; the exact per-action
// sub-paths are not published, so create/update/delete/list are modeled as sibling actions.
// ---------------------------------------------------------------------------

const KnowledgeBasesCreateInputSchema = z.object({
	name: z.string(),
	opening: z.string().optional(),
	prompt: z.string().optional(),
});
export type KnowledgeBasesCreateInput = z.infer<
	typeof KnowledgeBasesCreateInputSchema
>;

const KnowledgeBasesCreateResponseSchema = wrapResponse(
	z.object({ knowledge_base_id: z.string() }).catchall(z.unknown()),
);
export type KnowledgeBasesCreateResponse = z.infer<
	typeof KnowledgeBasesCreateResponseSchema
>;

const KnowledgeBasesListInputSchema = z.object({});
export type KnowledgeBasesListInput = z.infer<
	typeof KnowledgeBasesListInputSchema
>;

const KnowledgeBasesListResponseSchema = wrapResponse(
	z.object({ list: z.array(z.record(z.string(), z.unknown())) }),
);
export type KnowledgeBasesListResponse = z.infer<
	typeof KnowledgeBasesListResponseSchema
>;

const KnowledgeBasesUpdateInputSchema = z.object({
	knowledge_base_id: z.string(),
	name: z.string().optional(),
	opening: z.string().optional(),
	prompt: z.string().optional(),
});
export type KnowledgeBasesUpdateInput = z.infer<
	typeof KnowledgeBasesUpdateInputSchema
>;

const KnowledgeBasesUpdateResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type KnowledgeBasesUpdateResponse = z.infer<
	typeof KnowledgeBasesUpdateResponseSchema
>;

const KnowledgeBasesDeleteInputSchema = z.object({
	knowledge_base_id: z.string(),
});
export type KnowledgeBasesDeleteInput = z.infer<
	typeof KnowledgeBasesDeleteInputSchema
>;

const KnowledgeBasesDeleteResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type KnowledgeBasesDeleteResponse = z.infer<
	typeof KnowledgeBasesDeleteResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 6: Templates, Assets & Folder Organization — 12 ops
// ---------------------------------------------------------------------------

const AssetsListTemplatesInputSchema = z.object({});
export type AssetsListTemplatesInput = z.infer<
	typeof AssetsListTemplatesInputSchema
>;

const AssetsListTemplatesResponseSchema = wrapResponse(
	z.object({ templates: z.array(z.record(z.string(), z.unknown())) }),
);
export type AssetsListTemplatesResponse = z.infer<
	typeof AssetsListTemplatesResponseSchema
>;

const AssetsGetTemplateInputSchema = z.object({
	template_id: z.string(),
});
export type AssetsGetTemplateInput = z.infer<
	typeof AssetsGetTemplateInputSchema
>;

const AssetsGetTemplateResponseSchema = wrapResponse(
	z.object({ template_id: z.string().optional() }).catchall(z.unknown()),
);
export type AssetsGetTemplateResponse = z.infer<
	typeof AssetsGetTemplateResponseSchema
>;

const AssetsUploadAssetInputSchema = z.object({
	// Raw file bytes, base64-encoded for transport through the plugin boundary.
	fileBase64: z.string(),
	contentType: z.string(),
});
export type AssetsUploadAssetInput = z.infer<
	typeof AssetsUploadAssetInputSchema
>;

const AssetsUploadAssetResponseSchema = wrapResponse(
	z
		.object({ id: z.string().optional(), url: z.string().optional() })
		.catchall(z.unknown()),
);
export type AssetsUploadAssetResponse = z.infer<
	typeof AssetsUploadAssetResponseSchema
>;

const AssetsListAssetsInputSchema = z.object({
	file_type: z.string().optional(),
	folder_id: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
});
export type AssetsListAssetsInput = z.infer<typeof AssetsListAssetsInputSchema>;

const AssetsListAssetsResponseSchema = wrapResponse(
	z.object({ assets: z.array(z.record(z.string(), z.unknown())) }),
);
export type AssetsListAssetsResponse = z.infer<
	typeof AssetsListAssetsResponseSchema
>;

// [B] Path inferred as `/v2/assets`, a cursor-paginated sibling of the page-paginated
// `/v1/asset/list` above (HeyGen's issue lists both as distinct operations).
const AssetsListAssets2InputSchema = z.object({
	cursor: z.string().optional(),
	limit: z.number().optional(),
});
export type AssetsListAssets2Input = z.infer<
	typeof AssetsListAssets2InputSchema
>;

const AssetsListAssets2ResponseSchema = wrapResponse(
	z.object({
		assets: z.array(z.record(z.string(), z.unknown())),
		next_cursor: z.string().optional(),
	}),
);
export type AssetsListAssets2Response = z.infer<
	typeof AssetsListAssets2ResponseSchema
>;

const AssetsDeleteAssetInputSchema = z.object({
	asset_id: z.string(),
});
export type AssetsDeleteAssetInput = z.infer<
	typeof AssetsDeleteAssetInputSchema
>;

const AssetsDeleteAssetResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type AssetsDeleteAssetResponse = z.infer<
	typeof AssetsDeleteAssetResponseSchema
>;

const AssetsCreateFolderInputSchema = z.object({
	name: z.string(),
	parent_folder_id: z.string().optional(),
});
export type AssetsCreateFolderInput = z.infer<
	typeof AssetsCreateFolderInputSchema
>;

const AssetsCreateFolderResponseSchema = wrapResponse(
	z.object({ folder_id: z.string() }).catchall(z.unknown()),
);
export type AssetsCreateFolderResponse = z.infer<
	typeof AssetsCreateFolderResponseSchema
>;

const AssetsListFoldersInputSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
});
export type AssetsListFoldersInput = z.infer<
	typeof AssetsListFoldersInputSchema
>;

const AssetsListFoldersResponseSchema = wrapResponse(
	z.object({ folders: z.array(z.record(z.string(), z.unknown())) }),
);
export type AssetsListFoldersResponse = z.infer<
	typeof AssetsListFoldersResponseSchema
>;

// [B] Path inferred as `PATCH /v1/folders/{folder_id}` (rename only).
const AssetsUpdateFolderInputSchema = z.object({
	folder_id: z.string(),
	name: z.string(),
});
export type AssetsUpdateFolderInput = z.infer<
	typeof AssetsUpdateFolderInputSchema
>;

const AssetsUpdateFolderResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type AssetsUpdateFolderResponse = z.infer<
	typeof AssetsUpdateFolderResponseSchema
>;

// [B] Path inferred as `POST /v1/folders/{folder_id}/trash`.
const AssetsTrashFolderInputSchema = z.object({
	folder_id: z.string(),
});
export type AssetsTrashFolderInput = z.infer<
	typeof AssetsTrashFolderInputSchema
>;

const AssetsTrashFolderResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type AssetsTrashFolderResponse = z.infer<
	typeof AssetsTrashFolderResponseSchema
>;

// [B] Path inferred as `POST /v1/folders/{folder_id}/restore`.
const AssetsRestoreFolderInputSchema = z.object({
	folder_id: z.string(),
});
export type AssetsRestoreFolderInput = z.infer<
	typeof AssetsRestoreFolderInputSchema
>;

const AssetsRestoreFolderResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type AssetsRestoreFolderResponse = z.infer<
	typeof AssetsRestoreFolderResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 7: Webhooks & Quota — 7 ops
// ---------------------------------------------------------------------------

const WebhooksQuotaAddEndpointInputSchema = z.object({
	url: z.string(),
	events: z.array(z.string()),
});
export type WebhooksQuotaAddEndpointInput = z.infer<
	typeof WebhooksQuotaAddEndpointInputSchema
>;

const WebhooksQuotaAddEndpointResponseSchema = wrapResponse(
	z.object({ endpoint_id: z.string() }).catchall(z.unknown()),
);
export type WebhooksQuotaAddEndpointResponse = z.infer<
	typeof WebhooksQuotaAddEndpointResponseSchema
>;

const WebhooksQuotaListEndpointsInputSchema = z.object({});
export type WebhooksQuotaListEndpointsInput = z.infer<
	typeof WebhooksQuotaListEndpointsInputSchema
>;

const WebhooksQuotaListEndpointsResponseSchema = wrapResponse(
	z.array(z.record(z.string(), z.unknown())),
);
export type WebhooksQuotaListEndpointsResponse = z.infer<
	typeof WebhooksQuotaListEndpointsResponseSchema
>;

const WebhooksQuotaListEventTypesInputSchema = z.object({});
export type WebhooksQuotaListEventTypesInput = z.infer<
	typeof WebhooksQuotaListEventTypesInputSchema
>;

const WebhooksQuotaListEventTypesResponseSchema = wrapResponse(
	z.array(z.record(z.string(), z.unknown())),
);
export type WebhooksQuotaListEventTypesResponse = z.infer<
	typeof WebhooksQuotaListEventTypesResponseSchema
>;

// [B] Path inferred as `PATCH /v1/webhook/endpoint.update`.
const WebhooksQuotaUpdateEndpointInputSchema = z.object({
	endpoint_id: z.string(),
	url: z.string().optional(),
	events: z.array(z.string()).optional(),
});
export type WebhooksQuotaUpdateEndpointInput = z.infer<
	typeof WebhooksQuotaUpdateEndpointInputSchema
>;

const WebhooksQuotaUpdateEndpointResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type WebhooksQuotaUpdateEndpointResponse = z.infer<
	typeof WebhooksQuotaUpdateEndpointResponseSchema
>;

const WebhooksQuotaDeleteEndpointInputSchema = z.object({
	endpoint_id: z.string(),
});
export type WebhooksQuotaDeleteEndpointInput = z.infer<
	typeof WebhooksQuotaDeleteEndpointInputSchema
>;

const WebhooksQuotaDeleteEndpointResponseSchema = wrapResponse(
	z.record(z.string(), z.unknown()),
);
export type WebhooksQuotaDeleteEndpointResponse = z.infer<
	typeof WebhooksQuotaDeleteEndpointResponseSchema
>;

// Migrated to HeyGen v3 API endpoint per developers.heygen.com (GET /v3/users/me).
const WebhooksQuotaGetCurrentUserInputSchema = z.object({});
export type WebhooksQuotaGetCurrentUserInput = z.infer<
	typeof WebhooksQuotaGetCurrentUserInputSchema
>;

const WebhooksQuotaGetCurrentUserResponseSchema = v3Response(
	z.object({
		username: z.string(),
		email: z.string().nullable(),
		first_name: z.string().nullable(),
		last_name: z.string().nullable(),
		billing_type: z
			.enum(['wallet', 'subscription', 'usage_based'])
			.nullable()
			.optional(),
		// Exactly one of these is populated depending on `billing_type`; shapes vary per tier
		// so they're left permissive rather than fully modeled.
		wallet: z.record(z.string(), z.unknown()).optional(),
		subscription: z.record(z.string(), z.unknown()).optional(),
		usage_based: z.record(z.string(), z.unknown()).optional(),
	}),
);
export type WebhooksQuotaGetCurrentUserResponse = z.infer<
	typeof WebhooksQuotaGetCurrentUserResponseSchema
>;

const WebhooksQuotaRemainingQuotaInputSchema = z.object({});
export type WebhooksQuotaRemainingQuotaInput = z.infer<
	typeof WebhooksQuotaRemainingQuotaInputSchema
>;

const WebhooksQuotaRemainingQuotaResponseSchema = wrapResponse(
	z.object({ remaining_quota: z.number().optional() }).catchall(z.unknown()),
);
export type WebhooksQuotaRemainingQuotaResponse = z.infer<
	typeof WebhooksQuotaRemainingQuotaResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 8: Video Agent — 8 ops
// Migrated to HeyGen v3 API per developers.heygen.com. Video Agent is a v3-only, prompt-driven
// video generation surface with no v1/v2 equivalent.
// ---------------------------------------------------------------------------

const VideoAgentFileSchema = AssetRefWithBase64Schema;

const VideoAgentListSessionsInputSchema = z.object({
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type VideoAgentListSessionsInput = z.infer<
	typeof VideoAgentListSessionsInputSchema
>;

const VideoAgentListSessionsResponseSchema = v3PaginatedResponse(
	z.object({
		session_id: z.string(),
		title: z.string().nullable().optional(),
		created_at: z.number(),
	}),
);
export type VideoAgentListSessionsResponse = z.infer<
	typeof VideoAgentListSessionsResponseSchema
>;

const VideoAgentCreateSessionInputSchema = z.object({
	prompt: z.string().min(1).max(10000),
	mode: z.enum(['generate', 'chat']).optional(),
	avatar_id: z.string().nullable().optional(),
	voice_id: z.string().nullable().optional(),
	style_id: z.string().nullable().optional(),
	brand_kit_id: z.string().nullable().optional(),
	orientation: z.enum(['landscape', 'portrait']).nullable().optional(),
	files: z.array(VideoAgentFileSchema).max(20).optional(),
	callback_url: z.string().nullable().optional(),
	callback_id: z.string().nullable().optional(),
	incognito_mode: z.boolean().optional(),
});
export type VideoAgentCreateSessionInput = z.infer<
	typeof VideoAgentCreateSessionInputSchema
>;

const VideoAgentCreateSessionResponseSchema = v3Response(
	z.object({
		session_id: z.string(),
		status: z.enum(['generating', 'thinking', 'completed', 'failed']),
		video_id: z.string().nullable().optional(),
		created_at: z.number(),
	}),
);
export type VideoAgentCreateSessionResponse = z.infer<
	typeof VideoAgentCreateSessionResponseSchema
>;

const VideoAgentListStylesInputSchema = z.object({
	tag: z.string().optional(),
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type VideoAgentListStylesInput = z.infer<
	typeof VideoAgentListStylesInputSchema
>;

const VideoAgentListStylesResponseSchema = v3PaginatedResponse(
	z.object({
		style_id: z.string(),
		name: z.string(),
		thumbnail_url: z.string().nullable().optional(),
		preview_video_url: z.string().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
		aspect_ratio: z.string().nullable().optional(),
	}),
);
export type VideoAgentListStylesResponse = z.infer<
	typeof VideoAgentListStylesResponseSchema
>;

const VideoAgentGetSessionInputSchema = z.object({
	session_id: z.string(),
});
export type VideoAgentGetSessionInput = z.infer<
	typeof VideoAgentGetSessionInputSchema
>;

const VideoAgentSessionMessageSchema = z.object({
	role: z.string(),
	content: z.string(),
	type: z.enum(['text', 'resource', 'error']),
	created_at: z.number().nullable().optional(),
	resource_ids: z.array(z.string()).nullable().optional(),
});

const VideoAgentGetSessionResponseSchema = v3Response(
	z.object({
		session_id: z.string(),
		status: z.enum([
			'thinking',
			'waiting_for_input',
			'reviewing',
			'generating',
			'completed',
			'failed',
		]),
		progress: z.number().optional(),
		title: z.string().nullable().optional(),
		video_id: z.string().nullable().optional(),
		created_at: z.number(),
		messages: z.array(VideoAgentSessionMessageSchema),
	}),
);
export type VideoAgentGetSessionResponse = z.infer<
	typeof VideoAgentGetSessionResponseSchema
>;

const VideoAgentSendMessageInputSchema = z.object({
	session_id: z.string(),
	message: z.string().min(1).max(10000),
	avatar_id: z.string().nullable().optional(),
	voice_id: z.string().nullable().optional(),
	brand_kit_id: z.string().nullable().optional(),
	files: z.array(VideoAgentFileSchema).max(20).optional(),
});
export type VideoAgentSendMessageInput = z.infer<
	typeof VideoAgentSendMessageInputSchema
>;

const VideoAgentSendMessageResponseSchema = v3Response(
	z.object({
		session_id: z.string(),
		run_id: z.string(),
		title: z.string().nullable().optional(),
	}),
);
export type VideoAgentSendMessageResponse = z.infer<
	typeof VideoAgentSendMessageResponseSchema
>;

const VideoAgentGetResourceInputSchema = z.object({
	session_id: z.string(),
	resource_id: z.string(),
});
export type VideoAgentGetResourceInput = z.infer<
	typeof VideoAgentGetResourceInputSchema
>;

const VideoAgentGetResourceResponseSchema = v3Response(
	z
		.object({
			resource_id: z.string(),
			resource_type: z.string(),
			source_type: z.string().nullable().optional(),
			url: z.string().nullable().optional(),
			thumbnail_url: z.string().nullable().optional(),
			preview_url: z.string().nullable().optional(),
			created_at: z.number().nullable().optional(),
			metadata: z.record(z.string(), z.unknown()).nullable().optional(),
		})
		.catchall(z.unknown()),
);
export type VideoAgentGetResourceResponse = z.infer<
	typeof VideoAgentGetResourceResponseSchema
>;

const VideoAgentListVideosInputSchema = z.object({
	session_id: z.string(),
});
export type VideoAgentListVideosInput = z.infer<
	typeof VideoAgentListVideosInputSchema
>;

const VideoAgentListVideosResponseSchema = v3PaginatedResponse(
	z
		.object({
			id: z.string(),
			status: z.enum(['pending', 'processing', 'completed', 'failed']),
		})
		.catchall(z.unknown()),
);
export type VideoAgentListVideosResponse = z.infer<
	typeof VideoAgentListVideosResponseSchema
>;

const VideoAgentStopSessionInputSchema = z.object({
	session_id: z.string(),
});
export type VideoAgentStopSessionInput = z.infer<
	typeof VideoAgentStopSessionInputSchema
>;

const VideoAgentStopSessionResponseSchema = v3Response(
	z.object({ session_id: z.string() }),
);
export type VideoAgentStopSessionResponse = z.infer<
	typeof VideoAgentStopSessionResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 9: Brand Kits & Glossaries — 2 ops
// Migrated to HeyGen v3 API per developers.heygen.com. v3-only, no v1/v2 equivalent.
// ---------------------------------------------------------------------------

const BrandListGlossariesInputSchema = z.object({
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type BrandListGlossariesInput = z.infer<
	typeof BrandListGlossariesInputSchema
>;

const BrandListGlossariesResponseSchema = v3PaginatedResponse(
	z.object({
		brand_glossary_id: z.string(),
		name: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
	}),
);
export type BrandListGlossariesResponse = z.infer<
	typeof BrandListGlossariesResponseSchema
>;

const BrandListKitsInputSchema = z.object({
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type BrandListKitsInput = z.infer<typeof BrandListKitsInputSchema>;

const BrandListKitsResponseSchema = v3PaginatedResponse(
	z.object({
		brand_kit_id: z.string(),
		name: z.string(),
		logo_url: z.string().nullable().optional(),
		colors: z.array(z.string()).optional(),
	}),
);
export type BrandListKitsResponse = z.infer<typeof BrandListKitsResponseSchema>;

// ---------------------------------------------------------------------------
// Domain 10: Avatar Realtime Streaming — 4 ops
// Migrated to HeyGen v3 API per developers.heygen.com. Note: a "stream word timestamps"
// operation does not exist in HeyGen's v3 API (confirmed against the live docs) and was
// dropped rather than invented.
// ---------------------------------------------------------------------------

const AvatarRealtimeCreateSessionInputSchema = z.union([
	z.object({
		type: z.literal('tts'),
		avatar_id: z.string(),
		text: z.string().min(1),
		voice_id: z.string(),
	}),
	z.object({
		type: z.literal('audio'),
		avatar_id: z.string(),
		audio: AssetRefWithBase64Schema,
	}),
	z.object({
		type: z.literal('text_stream'),
		avatar_id: z.string(),
		voice_id: z.string(),
		text: z.string().min(1),
	}),
]);
export type AvatarRealtimeCreateSessionInput = z.infer<
	typeof AvatarRealtimeCreateSessionInputSchema
>;

const AvatarRealtimeCreateSessionResponseSchema = v3Response(
	z.object({ stream_id: z.string() }),
);
export type AvatarRealtimeCreateSessionResponse = z.infer<
	typeof AvatarRealtimeCreateSessionResponseSchema
>;

const AvatarRealtimeGetSessionInputSchema = z.object({ stream_id: z.string() });
export type AvatarRealtimeGetSessionInput = z.infer<
	typeof AvatarRealtimeGetSessionInputSchema
>;

const AvatarRealtimeGetSessionResponseSchema = v3Response(
	z.object({
		stream_id: z.string(),
		status: z.enum(['pending', 'streaming', 'completed', 'error']),
		hls_url: z.string().nullable().optional(),
		error_message: z.string().nullable().optional(),
		end_reason: z.enum(['final_marker', 'idle_timeout']).nullable().optional(),
	}),
);
export type AvatarRealtimeGetSessionResponse = z.infer<
	typeof AvatarRealtimeGetSessionResponseSchema
>;

const AvatarRealtimeAppendTextInputSchema = z.object({
	stream_id: z.string(),
	delta: z.string(),
	final: z.boolean().optional(),
});
export type AvatarRealtimeAppendTextInput = z.infer<
	typeof AvatarRealtimeAppendTextInputSchema
>;

const AvatarRealtimeAppendTextResponseSchema = v3Response(
	z.object({
		ok: z.boolean().optional(),
		buffered_bytes: z.number(),
	}),
);
export type AvatarRealtimeAppendTextResponse = z.infer<
	typeof AvatarRealtimeAppendTextResponseSchema
>;

const AvatarRealtimeCancelSessionInputSchema = z.object({
	stream_id: z.string(),
});
export type AvatarRealtimeCancelSessionInput = z.infer<
	typeof AvatarRealtimeCancelSessionInputSchema
>;

const AvatarRealtimeCancelSessionResponseSchema = v3Response(
	z.object({ stream_id: z.string(), cancelled: z.boolean() }),
);
export type AvatarRealtimeCancelSessionResponse = z.infer<
	typeof AvatarRealtimeCancelSessionResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 11: Audio Search — 1 op
// Migrated to HeyGen v3 API per developers.heygen.com. v3-only, no v1/v2 equivalent.
// ---------------------------------------------------------------------------

const AudioSearchInputSchema = z.object({
	query: z.string(),
	type: z.enum(['music', 'sound_effects']).optional(),
	limit: z.number().optional(),
	min_score: z.number().optional(),
	token: z.string().optional(),
});
export type AudioSearchInput = z.infer<typeof AudioSearchInputSchema>;

const AudioSearchResponseSchema = v3PaginatedResponse(
	z.record(z.string(), z.unknown()),
);
export type AudioSearchResponse = z.infer<typeof AudioSearchResponseSchema>;

// ---------------------------------------------------------------------------
// Domain 12: Starfish Voice & TTS — v3 additions (6 ops)
// Migrated to HeyGen v3 API per developers.heygen.com. Named with a `V3` suffix since these
// are new v3 operations that would otherwise collide with the legacy v1/v2 voice operations above.
// ---------------------------------------------------------------------------

const AudioVoiceItemSchema = z.object({
	voice_id: z.string(),
	name: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	gender: z.string().nullable().optional(),
	preview_audio_url: z.string().nullable().optional(),
	support_pause: z.boolean().optional(),
	support_locale: z.boolean().optional(),
	type: z.enum(['public', 'private']).optional(),
});

const VoicesGenerateSpeechV3InputSchema = z.object({
	text: z.string().min(1).max(5000),
	voice_id: z.string(),
	input_type: z.enum(['text', 'ssml']).optional(),
	speed: z.number().optional(),
	language: z.string().nullable().optional(),
	locale: z.string().nullable().optional(),
});
export type VoicesGenerateSpeechV3Input = z.infer<
	typeof VoicesGenerateSpeechV3InputSchema
>;

const VoicesGenerateSpeechV3ResponseSchema = v3Response(
	z.object({
		audio_url: z.string(),
		duration: z.number(),
		request_id: z.string().nullable().optional(),
		word_timestamps: z
			.array(z.object({ word: z.string(), start: z.number(), end: z.number() }))
			.nullable()
			.optional(),
	}),
);
export type VoicesGenerateSpeechV3Response = z.infer<
	typeof VoicesGenerateSpeechV3ResponseSchema
>;

const VoicesListV3InputSchema = z.object({
	type: z.enum(['public', 'private']).optional(),
	engine: z.string().optional(),
	language: z.string().optional(),
	gender: z.enum(['male', 'female']).optional(),
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type VoicesListV3Input = z.infer<typeof VoicesListV3InputSchema>;

const VoicesListV3ResponseSchema = v3PaginatedResponse(AudioVoiceItemSchema);
export type VoicesListV3Response = z.infer<typeof VoicesListV3ResponseSchema>;

const VoicesDesignInputSchema = z.object({
	prompt: z.string().min(1).max(1000),
	gender: z.string().nullable().optional(),
	locale: z.string().nullable().optional(),
	seed: z.number().optional(),
});
export type VoicesDesignInput = z.infer<typeof VoicesDesignInputSchema>;

const VoicesDesignResponseSchema = v3Response(
	z.object({ voices: z.array(AudioVoiceItemSchema).max(3), seed: z.number() }),
);
export type VoicesDesignResponse = z.infer<typeof VoicesDesignResponseSchema>;

const VoicesCloneInputSchema = z.object({
	audio: AssetRefWithBase64Schema,
	voice_name: z.string().min(1).max(100),
	language: z.string().nullable().optional(),
	remove_background_noise: z.boolean().optional(),
});
export type VoicesCloneInput = z.infer<typeof VoicesCloneInputSchema>;

const VoicesCloneResponseSchema = v3Response(
	z.object({ voice_clone_id: z.string() }),
);
export type VoicesCloneResponse = z.infer<typeof VoicesCloneResponseSchema>;

const VoicesGetV3InputSchema = z.object({ voice_id: z.string() });
export type VoicesGetV3Input = z.infer<typeof VoicesGetV3InputSchema>;

const VoicesGetV3ResponseSchema = v3Response(
	z.object({
		voice_id: z.string(),
		name: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		gender: z.string().nullable().optional(),
		preview_audio_url: z.string().nullable().optional(),
		status: z.enum(['processing', 'complete', 'failed']).nullable().optional(),
		failure_message: z.string().nullable().optional(),
		support_pause: z.boolean().optional(),
		support_interactive_avatar: z.boolean().optional(),
		created_at: z.number().nullable().optional(),
	}),
);
export type VoicesGetV3Response = z.infer<typeof VoicesGetV3ResponseSchema>;

const VoicesDeleteV3InputSchema = z.object({ voice_id: z.string() });
export type VoicesDeleteV3Input = z.infer<typeof VoicesDeleteV3InputSchema>;

const VoicesDeleteV3ResponseSchema = v3Response(
	z.object({ voice_id: z.string() }),
);
export type VoicesDeleteV3Response = z.infer<
	typeof VoicesDeleteV3ResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 13: Videos — v3 additions (2 ops)
// Migrated to HeyGen v3 API per developers.heygen.com. Named with a `V3` suffix since these
// collide in concept with the legacy v1 `videos.list`/`videos.delete` operations above.
// ---------------------------------------------------------------------------

const VideoDetailV3Schema = z
	.object({
		id: z.string(),
		status: z.enum(['pending', 'processing', 'completed', 'failed']),
	})
	.catchall(z.unknown());

const VideosListV3InputSchema = z.object({
	limit: z.number().optional(),
	token: z.string().optional(),
	folder_id: z.string().optional(),
	title: z.string().optional(),
});
export type VideosListV3Input = z.infer<typeof VideosListV3InputSchema>;

const VideosListV3ResponseSchema = v3PaginatedResponse(VideoDetailV3Schema);
export type VideosListV3Response = z.infer<typeof VideosListV3ResponseSchema>;

const VideosDeleteV3InputSchema = z.object({ video_id: z.string() });
export type VideosDeleteV3Input = z.infer<typeof VideosDeleteV3InputSchema>;

const VideosDeleteV3ResponseSchema = v3Response(
	z.object({ id: z.string(), deleted: z.boolean().optional() }),
);
export type VideosDeleteV3Response = z.infer<
	typeof VideosDeleteV3ResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 14: Video Translations — v3 additions (3 ops)
// Migrated to HeyGen v3 API per developers.heygen.com. Separate nested domain from the
// existing `videos.translate*` operations (list/delete/update have no v1/v2 equivalent).
// ---------------------------------------------------------------------------

const VideoTranslationDetailSchema = z.object({
	id: z.string(),
	status: z.enum(['pending', 'running', 'completed', 'failed']),
	title: z.string().nullable().optional(),
	output_language: z.string().nullable().optional(),
	input_language: z.string().nullable().optional(),
	duration: z.number().nullable().optional(),
	translate_audio_only: z.boolean().nullable().optional(),
	video_url: z.string().nullable().optional(),
	audio_url: z.string().nullable().optional(),
	srt_caption_url: z.string().nullable().optional(),
	vtt_caption_url: z.string().nullable().optional(),
	callback_id: z.string().nullable().optional(),
	created_at: z.number().nullable().optional(),
	failure_message: z.string().nullable().optional(),
});

const VideoTranslationsListInputSchema = z.object({
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type VideoTranslationsListInput = z.infer<
	typeof VideoTranslationsListInputSchema
>;

const VideoTranslationsListResponseSchema = v3PaginatedResponse(
	VideoTranslationDetailSchema,
);
export type VideoTranslationsListResponse = z.infer<
	typeof VideoTranslationsListResponseSchema
>;

const VideoTranslationsDeleteInputSchema = z.object({
	video_translation_id: z.string(),
});
export type VideoTranslationsDeleteInput = z.infer<
	typeof VideoTranslationsDeleteInputSchema
>;

const VideoTranslationsDeleteResponseSchema = v3Response(
	z.object({ id: z.string() }),
);
export type VideoTranslationsDeleteResponse = z.infer<
	typeof VideoTranslationsDeleteResponseSchema
>;

const VideoTranslationsUpdateInputSchema = z.object({
	video_translation_id: z.string(),
	title: z.string(),
});
export type VideoTranslationsUpdateInput = z.infer<
	typeof VideoTranslationsUpdateInputSchema
>;

const VideoTranslationsUpdateResponseSchema = v3Response(
	VideoTranslationDetailSchema,
);
export type VideoTranslationsUpdateResponse = z.infer<
	typeof VideoTranslationsUpdateResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 15: Proofread Sessions — 5 ops
// Migrated to HeyGen v3 API per developers.heygen.com. v3-only, no v1/v2 equivalent.
// ---------------------------------------------------------------------------

const ProofreadDetailSchema = z.object({
	id: z.string(),
	status: z.enum(['processing', 'completed', 'failed']),
	title: z.string().nullable().optional(),
	output_language: z.string().nullable().optional(),
	input_language: z.string().nullable().optional(),
	submitted_for_review: z.boolean().nullable().optional(),
	created_at: z.number().nullable().optional(),
	failure_message: z.string().nullable().optional(),
});

const ProofreadCreateInputSchema = z.object({
	video: AssetRefSchema,
	output_languages: z.array(z.string()).min(1),
	title: z.string(),
	brand_voice_id: z.string().nullable().optional(),
	brand_glossary_id: z.string().nullable().optional(),
	speaker_num: z.number().nullable().optional(),
	folder_id: z.string().nullable().optional(),
	enable_video_stretching: z.boolean().optional(),
	disable_music_track: z.boolean().optional(),
	enable_speech_enhancement: z.boolean().optional(),
	srt: AssetRefSchema.nullable().optional(),
	mode: z.enum(['speed', 'precision']).optional(),
	keep_the_same_format: z.boolean().optional(),
});
export type ProofreadCreateInput = z.infer<typeof ProofreadCreateInputSchema>;

const ProofreadCreateResponseSchema = v3Response(
	z.object({
		proofread_ids: z.array(z.string()),
		status: z.enum(['processing', 'completed', 'failed']),
	}),
);
export type ProofreadCreateResponse = z.infer<
	typeof ProofreadCreateResponseSchema
>;

const ProofreadGetInputSchema = z.object({ proofread_id: z.string() });
export type ProofreadGetInput = z.infer<typeof ProofreadGetInputSchema>;

const ProofreadGetResponseSchema = v3Response(ProofreadDetailSchema);
export type ProofreadGetResponse = z.infer<typeof ProofreadGetResponseSchema>;

const ProofreadDownloadSrtInputSchema = z.object({ proofread_id: z.string() });
export type ProofreadDownloadSrtInput = z.infer<
	typeof ProofreadDownloadSrtInputSchema
>;

const ProofreadDownloadSrtResponseSchema = v3Response(
	z.object({
		srt_url: z.string(),
		original_srt_url: z.string().nullable().optional(),
	}),
);
export type ProofreadDownloadSrtResponse = z.infer<
	typeof ProofreadDownloadSrtResponseSchema
>;

const ProofreadUploadSrtInputSchema = z.object({
	proofread_id: z.string(),
	srt: AssetRefSchema,
});
export type ProofreadUploadSrtInput = z.infer<
	typeof ProofreadUploadSrtInputSchema
>;

const ProofreadUploadSrtResponseSchema = v3Response(ProofreadDetailSchema);
export type ProofreadUploadSrtResponse = z.infer<
	typeof ProofreadUploadSrtResponseSchema
>;

const ProofreadGenerateVideoInputSchema = z.object({
	proofread_id: z.string(),
	captions: z.boolean().optional(),
	translate_audio_only: z.boolean().optional(),
	callback_id: z.string().nullable().optional(),
	callback_url: z.string().nullable().optional(),
});
export type ProofreadGenerateVideoInput = z.infer<
	typeof ProofreadGenerateVideoInputSchema
>;

const ProofreadGenerateVideoResponseSchema = v3Response(
	z.object({
		video_translation_id: z.string(),
		status: z.enum(['processing', 'completed', 'failed']),
	}),
);
export type ProofreadGenerateVideoResponse = z.infer<
	typeof ProofreadGenerateVideoResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 16: Lipsync — 5 ops
// Migrated to HeyGen v3 API per developers.heygen.com. v3-only, no v1/v2 equivalent.
// ---------------------------------------------------------------------------

const LipsyncDetailSchema = z.object({
	id: z.string(),
	title: z.string().nullable().optional(),
	status: z.enum(['pending', 'running', 'completed', 'failed']),
	duration: z.number().nullable().optional(),
	video_url: z.string().nullable().optional(),
	caption_url: z.string().nullable().optional(),
	callback_id: z.string().nullable().optional(),
	created_at: z.number().nullable().optional(),
	failure_message: z.string().nullable().optional(),
});

const LipsyncListInputSchema = z.object({
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type LipsyncListInput = z.infer<typeof LipsyncListInputSchema>;

const LipsyncListResponseSchema = v3PaginatedResponse(LipsyncDetailSchema);
export type LipsyncListResponse = z.infer<typeof LipsyncListResponseSchema>;

const LipsyncCreateInputSchema = z.object({
	video: AssetRefSchema,
	audio: AssetRefSchema,
	title: z.string().optional(),
	mode: z.enum(['speed', 'precision']).optional(),
	callback_url: z.string().nullable().optional(),
	callback_id: z.string().nullable().optional(),
	enable_caption: z.boolean().optional(),
	keep_the_same_format: z.boolean().nullable().optional(),
	enable_dynamic_duration: z.boolean().optional(),
	disable_music_track: z.boolean().optional(),
	enable_speech_enhancement: z.boolean().optional(),
	enable_watermark: z.boolean().optional(),
	start_time: z.number().nullable().optional(),
	end_time: z.number().nullable().optional(),
	fps_mode: z.enum(['vfr', 'cfr', 'passthrough']).nullable().optional(),
	folder_id: z.string().nullable().optional(),
});
export type LipsyncCreateInput = z.infer<typeof LipsyncCreateInputSchema>;

const LipsyncCreateResponseSchema = v3Response(
	z.object({ lipsync_id: z.string() }),
);
export type LipsyncCreateResponse = z.infer<typeof LipsyncCreateResponseSchema>;

const LipsyncGetInputSchema = z.object({ lipsync_id: z.string() });
export type LipsyncGetInput = z.infer<typeof LipsyncGetInputSchema>;

const LipsyncGetResponseSchema = v3Response(LipsyncDetailSchema);
export type LipsyncGetResponse = z.infer<typeof LipsyncGetResponseSchema>;

const LipsyncDeleteInputSchema = z.object({ lipsync_id: z.string() });
export type LipsyncDeleteInput = z.infer<typeof LipsyncDeleteInputSchema>;

const LipsyncDeleteResponseSchema = v3Response(z.object({ id: z.string() }));
export type LipsyncDeleteResponse = z.infer<typeof LipsyncDeleteResponseSchema>;

const LipsyncUpdateInputSchema = z.object({
	lipsync_id: z.string(),
	title: z.string(),
});
export type LipsyncUpdateInput = z.infer<typeof LipsyncUpdateInputSchema>;

const LipsyncUpdateResponseSchema = v3Response(LipsyncDetailSchema);
export type LipsyncUpdateResponse = z.infer<typeof LipsyncUpdateResponseSchema>;

// ---------------------------------------------------------------------------
// Domain 17: HyperFrames — 4 ops
// Migrated to HeyGen v3 API per developers.heygen.com. v3-only, no v1/v2 equivalent.
// ---------------------------------------------------------------------------

const HyperframeDetailSchema = z.object({
	render_id: z.string(),
	status: z.enum(['queued', 'rendering', 'completed', 'failed']),
	format: z.enum(['mp4', 'webm', 'mov']),
	title: z.string().nullable().optional(),
	callback_id: z.string().nullable().optional(),
	video_url: z.string().nullable().optional(),
	thumbnail_url: z.string().nullable().optional(),
	duration: z.number().nullable().optional(),
	fps: z.number().nullable().optional(),
	quality: z.enum(['draft', 'standard', 'high']).nullable().optional(),
	resolution: z.enum(['1080p', '4k']).nullable().optional(),
	aspect_ratio: z.enum(['16:9', '9:16', '1:1']).nullable().optional(),
	composition: z.string().nullable().optional(),
	created_at: z.number().nullable().optional(),
	completed_at: z.number().nullable().optional(),
	failure_message: z.string().nullable().optional(),
});

const HyperframesListInputSchema = z.object({
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type HyperframesListInput = z.infer<typeof HyperframesListInputSchema>;

const HyperframesListResponseSchema = v3PaginatedResponse(
	HyperframeDetailSchema,
);
export type HyperframesListResponse = z.infer<
	typeof HyperframesListResponseSchema
>;

const HyperframesCreateInputSchema = z.object({
	project: AssetRefWithBase64Schema,
	fps: z.number().nullable().optional(),
	quality: z.enum(['draft', 'standard', 'high']).optional(),
	format: z.enum(['mp4', 'webm', 'mov']).optional(),
	resolution: z.enum(['1080p', '4k']).optional(),
	aspect_ratio: z.enum(['16:9', '9:16', '1:1']).optional(),
	composition: z.string().max(512).nullable().optional(),
	variables: z.record(z.string(), z.unknown()).nullable().optional(),
	title: z.string().max(500).nullable().optional(),
	callback_id: z.string().max(256).nullable().optional(),
	callback_url: z.string().nullable().optional(),
});
export type HyperframesCreateInput = z.infer<
	typeof HyperframesCreateInputSchema
>;

const HyperframesCreateResponseSchema = v3Response(
	z.object({ render_id: z.string() }),
);
export type HyperframesCreateResponse = z.infer<
	typeof HyperframesCreateResponseSchema
>;

const HyperframesGetInputSchema = z.object({ render_id: z.string() });
export type HyperframesGetInput = z.infer<typeof HyperframesGetInputSchema>;

const HyperframesGetResponseSchema = v3Response(HyperframeDetailSchema);
export type HyperframesGetResponse = z.infer<
	typeof HyperframesGetResponseSchema
>;

const HyperframesDeleteInputSchema = z.object({ render_id: z.string() });
export type HyperframesDeleteInput = z.infer<
	typeof HyperframesDeleteInputSchema
>;

const HyperframesDeleteResponseSchema = v3Response(
	z.object({ render_id: z.string() }),
);
export type HyperframesDeleteResponse = z.infer<
	typeof HyperframesDeleteResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 18: Webhooks — v3 additions (7 ops)
// Migrated to HeyGen v3 API per developers.heygen.com. Named with a `V3` suffix since these
// collide in concept with the legacy v1 `webhooksQuota.*Endpoint*` operations above.
// ---------------------------------------------------------------------------

const WebhookEndpointResponseItemSchema = z.object({
	endpoint_id: z.string(),
	url: z.string(),
	events: z.array(z.string()).nullable().optional(),
	status: z.string(),
	created_at: z.string(),
	secret: z.string().nullable().optional(),
});

const WebhooksListEventTypesV3InputSchema = z.object({});
export type WebhooksListEventTypesV3Input = z.infer<
	typeof WebhooksListEventTypesV3InputSchema
>;

const WebhooksListEventTypesV3ResponseSchema = v3PaginatedResponse(
	z.object({ event_type: z.string(), description: z.string() }),
);
export type WebhooksListEventTypesV3Response = z.infer<
	typeof WebhooksListEventTypesV3ResponseSchema
>;

const WebhooksListEndpointsV3InputSchema = z.object({
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type WebhooksListEndpointsV3Input = z.infer<
	typeof WebhooksListEndpointsV3InputSchema
>;

const WebhooksListEndpointsV3ResponseSchema = v3PaginatedResponse(
	WebhookEndpointResponseItemSchema,
);
export type WebhooksListEndpointsV3Response = z.infer<
	typeof WebhooksListEndpointsV3ResponseSchema
>;

const WebhooksAddEndpointV3InputSchema = z.object({
	url: z.string(),
	events: z.array(z.string()).nullable().optional(),
	entity_id: z.string().nullable().optional(),
});
export type WebhooksAddEndpointV3Input = z.infer<
	typeof WebhooksAddEndpointV3InputSchema
>;

const WebhooksAddEndpointV3ResponseSchema = v3Response(
	WebhookEndpointResponseItemSchema,
);
export type WebhooksAddEndpointV3Response = z.infer<
	typeof WebhooksAddEndpointV3ResponseSchema
>;

const WebhooksDeleteEndpointV3InputSchema = z.object({
	endpoint_id: z.string(),
});
export type WebhooksDeleteEndpointV3Input = z.infer<
	typeof WebhooksDeleteEndpointV3InputSchema
>;

const WebhooksDeleteEndpointV3ResponseSchema = v3Response(z.object({}));
export type WebhooksDeleteEndpointV3Response = z.infer<
	typeof WebhooksDeleteEndpointV3ResponseSchema
>;

const WebhooksUpdateEndpointV3InputSchema = z.object({
	endpoint_id: z.string(),
	url: z.string().nullable().optional(),
	events: z.array(z.string()).nullable().optional(),
});
export type WebhooksUpdateEndpointV3Input = z.infer<
	typeof WebhooksUpdateEndpointV3InputSchema
>;

const WebhooksUpdateEndpointV3ResponseSchema = v3Response(
	WebhookEndpointResponseItemSchema,
);
export type WebhooksUpdateEndpointV3Response = z.infer<
	typeof WebhooksUpdateEndpointV3ResponseSchema
>;

const WebhooksRotateSecretInputSchema = z.object({ endpoint_id: z.string() });
export type WebhooksRotateSecretInput = z.infer<
	typeof WebhooksRotateSecretInputSchema
>;

const WebhooksRotateSecretResponseSchema = v3Response(
	z.object({ endpoint_id: z.string(), secret: z.string() }),
);
export type WebhooksRotateSecretResponse = z.infer<
	typeof WebhooksRotateSecretResponseSchema
>;

const WebhooksListEventsInputSchema = z.object({
	event_type: z.string().optional(),
	entity_id: z.string().optional(),
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type WebhooksListEventsInput = z.infer<
	typeof WebhooksListEventsInputSchema
>;

const WebhooksListEventsResponseSchema = v3PaginatedResponse(
	z.object({
		event_id: z.string(),
		event_type: z.string(),
		event_data: z.record(z.string(), z.unknown()),
		created_at: z.string(),
	}),
);
export type WebhooksListEventsResponse = z.infer<
	typeof WebhooksListEventsResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 19: Assets — v3 additions (5 ops)
// Migrated to HeyGen v3 API per developers.heygen.com. Named with a `V3` suffix since
// `uploadAssetV3` collides in concept with the legacy v1 `assets.uploadAsset` operation above.
// ---------------------------------------------------------------------------

const AssetsUploadAssetV3InputSchema = z.object({
	// Raw file bytes, base64-encoded for transport through the plugin boundary; sent as
	// multipart/form-data to POST /v3/assets (unlike the presigned-URL upload flow below).
	fileBase64: z.string(),
	contentType: z.string(),
});
export type AssetsUploadAssetV3Input = z.infer<
	typeof AssetsUploadAssetV3InputSchema
>;

const AssetsUploadAssetV3ResponseSchema = v3Response(
	z.object({
		asset_id: z.string(),
		url: z.string(),
		mime_type: z.string(),
		size_bytes: z.number(),
	}),
);
export type AssetsUploadAssetV3Response = z.infer<
	typeof AssetsUploadAssetV3ResponseSchema
>;

const AssetsGetAssetInputSchema = z.object({ asset_id: z.string() });
export type AssetsGetAssetInput = z.infer<typeof AssetsGetAssetInputSchema>;

const AssetsGetAssetResponseSchema = v3Response(
	z.object({
		id: z.string(),
		name: z.string(),
		type: z.string(),
		owner: z.string(),
		space_id: z.string(),
		folder_id: z.string().nullable().optional(),
		uploaded_at: z.number(),
		url: z.string().nullable().optional(),
	}),
);
export type AssetsGetAssetResponse = z.infer<
	typeof AssetsGetAssetResponseSchema
>;

const AssetsDeleteAssetV3InputSchema = z.object({ asset_id: z.string() });
export type AssetsDeleteAssetV3Input = z.infer<
	typeof AssetsDeleteAssetV3InputSchema
>;

const AssetsDeleteAssetV3ResponseSchema = v3Response(
	z.object({ id: z.string() }),
);
export type AssetsDeleteAssetV3Response = z.infer<
	typeof AssetsDeleteAssetV3ResponseSchema
>;

const AssetsCreateUploadSessionInputSchema = z.object({
	filename: z.string(),
	content_type: z.string(),
	size_bytes: z.number(),
	checksum_sha256: z.string().nullable().optional(),
});
export type AssetsCreateUploadSessionInput = z.infer<
	typeof AssetsCreateUploadSessionInputSchema
>;

const AssetsCreateUploadSessionResponseSchema = v3Response(
	z.object({
		asset_id: z.string(),
		upload_url: z.string(),
		upload_headers: z.record(z.string(), z.unknown()),
		expires_in_seconds: z.number(),
		max_bytes: z.number(),
		status: z.literal('pending_upload'),
	}),
);
export type AssetsCreateUploadSessionResponse = z.infer<
	typeof AssetsCreateUploadSessionResponseSchema
>;

const AssetsCompleteUploadInputSchema = z.object({
	asset_id: z.string(),
	checksum_sha256: z.string().nullable().optional(),
});
export type AssetsCompleteUploadInput = z.infer<
	typeof AssetsCompleteUploadInputSchema
>;

const AssetsCompleteUploadResponseSchema = v3Response(
	z.object({
		asset_id: z.string(),
		url: z.string(),
		mime_type: z.string(),
		size_bytes: z.number(),
		status: z.string(),
	}),
);
export type AssetsCompleteUploadResponse = z.infer<
	typeof AssetsCompleteUploadResponseSchema
>;

// ---------------------------------------------------------------------------
// Domain 20: AI Clipping — 4 ops
// Migrated to HeyGen v3 API per developers.heygen.com. v3-only, no v1/v2 equivalent.
// ---------------------------------------------------------------------------

const ClipSchema = z.object({
	id: z.string(),
	status: z.enum(['pending', 'completed', 'failed']),
	duration_seconds: z.number().nullable().optional(),
	aspect_ratio: z
		.enum(['landscape', 'portrait', 'square'])
		.nullable()
		.optional(),
	title: z.string().nullable().optional(),
	virality_score: z.number().nullable().optional(),
	thumbnail_url: z.string().nullable().optional(),
	video_url: z.string().nullable().optional(),
	failure_message: z.string().nullable().optional(),
});

const AiClippingDetailSchema = z.object({
	id: z.string(),
	title: z.string().nullable().optional(),
	status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']),
	input_language: z.string().nullable().optional(),
	source_duration: z.number().nullable().optional(),
	clips: z.array(ClipSchema).optional(),
	progress: z.number().optional(),
	callback_id: z.string().nullable().optional(),
	created_at: z.number().nullable().optional(),
	failure_message: z.string().nullable().optional(),
});

const AiClippingCreateInputSchema = z.object({
	video: AssetRefSchema,
	title: z.string().max(255).optional(),
	input_language: z.string().optional(),
	output_settings: z
		.object({
			duration_types: z
				.array(z.enum(['30', '60', '180', 'long']))
				.min(1)
				.max(4),
			aspect_ratio: z.enum(['landscape', 'portrait', 'square']).optional(),
			captions: z.boolean().optional(),
			caption_style: z.string().optional(),
			prompt: z.string().max(500).optional(),
		})
		.optional(),
	callback_url: z.string().nullable().optional(),
	callback_id: z.string().max(128).nullable().optional(),
});
export type AiClippingCreateInput = z.infer<typeof AiClippingCreateInputSchema>;

const AiClippingCreateResponseSchema = v3Response(
	z.object({ ai_clipping_id: z.string() }),
);
export type AiClippingCreateResponse = z.infer<
	typeof AiClippingCreateResponseSchema
>;

const AiClippingGetInputSchema = z.object({ job_id: z.string() });
export type AiClippingGetInput = z.infer<typeof AiClippingGetInputSchema>;

const AiClippingGetResponseSchema = v3Response(AiClippingDetailSchema);
export type AiClippingGetResponse = z.infer<typeof AiClippingGetResponseSchema>;

const AiClippingDeleteInputSchema = z.object({ job_id: z.string() });
export type AiClippingDeleteInput = z.infer<typeof AiClippingDeleteInputSchema>;

const AiClippingDeleteResponseSchema = v3Response(z.object({}));
export type AiClippingDeleteResponse = z.infer<
	typeof AiClippingDeleteResponseSchema
>;

const AiClippingListInputSchema = z.object({
	limit: z.number().optional(),
	token: z.string().optional(),
});
export type AiClippingListInput = z.infer<typeof AiClippingListInputSchema>;

const AiClippingListResponseSchema = v3PaginatedResponse(
	AiClippingDetailSchema,
);
export type AiClippingListResponse = z.infer<
	typeof AiClippingListResponseSchema
>;

// ---------------------------------------------------------------------------
// Aggregated maps
// ---------------------------------------------------------------------------

export type HeygenEndpointInputs = {
	videosGenerate: VideosGenerateInput;
	videosTemplateGenerate: VideosTemplateGenerateInput;
	videosCreateWebm: VideosCreateWebmInput;
	videosPersonalizedAddContact: VideosPersonalizedAddContactInput;
	videosPersonalizedProjectDetail: VideosPersonalizedProjectDetailInput;
	videosGetStatus: VideosGetStatusInput;
	videosTranslate: VideosTranslateInput;
	videosTranslateStatus: VideosTranslateStatusInput;
	videosTranslateTargetLanguages: VideosTranslateTargetLanguagesInput;
	videosGetSharableUrl: VideosGetSharableUrlInput;
	videosDelete: VideosDeleteInput;
	videosList: VideosListInput;

	avatarsList: AvatarsListInput;
	avatarsGetDetails: AvatarsGetDetailsInput;
	avatarsListGroups: AvatarsListGroupsInput;
	avatarsListGroupAvatars: AvatarsListGroupAvatarsInput;
	avatarsSearchPublicGroups: AvatarsSearchPublicGroupsInput;
	avatarsCreatePhotoGroup: AvatarsCreatePhotoGroupInput;
	avatarsGeneratePhotos: AvatarsGeneratePhotosInput;
	avatarsAddLooks: AvatarsAddLooksInput;
	avatarsCheckLookStatus: AvatarsCheckLookStatusInput;
	avatarsGetTrainingStatus: AvatarsGetTrainingStatusInput;
	avatarsGetPhotoDetails: AvatarsGetPhotoDetailsInput;
	avatarsDeletePhotoGroup: AvatarsDeletePhotoGroupInput;
	avatarsDeletePhoto: AvatarsDeletePhotoInput;
	avatarsAddMotion: AvatarsAddMotionInput;
	avatarsUpscale: AvatarsUpscaleInput;
	avatarsListTalkingPhotos: AvatarsListTalkingPhotosInput;
	avatarsUploadTalkingPhoto: AvatarsUploadTalkingPhotoInput;
	avatarsDeleteTalkingPhoto: AvatarsDeleteTalkingPhotoInput;

	voicesGenerateSpeech: VoicesGenerateSpeechInput;
	voicesGeneratePreview: VoicesGeneratePreviewInput;
	voicesListTts: VoicesListTtsInput;
	voicesListLocales: VoicesListLocalesInput;
	voicesListV2: VoicesListV2Input;
	voicesListV1: VoicesListV1Input;
	voicesListBrandVoices: VoicesListBrandVoicesInput;

	streamingNewSession: StreamingNewSessionInput;
	streamingCreateToken: StreamingCreateTokenInput;
	streamingStart: StreamingStartInput;
	streamingStop: StreamingStopInput;
	streamingInterrupt: StreamingInterruptInput;
	streamingKeepAlive: StreamingKeepAliveInput;
	streamingTask: StreamingTaskInput;
	streamingIce: StreamingIceInput;
	streamingNew: StreamingNewInput;
	streamingList: StreamingListInput;
	streamingListAvatars: StreamingListAvatarsInput;
	streamingListSessionHistory: StreamingListSessionHistoryInput;

	knowledgeBasesCreate: KnowledgeBasesCreateInput;
	knowledgeBasesList: KnowledgeBasesListInput;
	knowledgeBasesUpdate: KnowledgeBasesUpdateInput;
	knowledgeBasesDelete: KnowledgeBasesDeleteInput;

	assetsListTemplates: AssetsListTemplatesInput;
	assetsGetTemplate: AssetsGetTemplateInput;
	assetsUploadAsset: AssetsUploadAssetInput;
	assetsListAssets: AssetsListAssetsInput;
	assetsListAssets2: AssetsListAssets2Input;
	assetsDeleteAsset: AssetsDeleteAssetInput;
	assetsCreateFolder: AssetsCreateFolderInput;
	assetsListFolders: AssetsListFoldersInput;
	assetsUpdateFolder: AssetsUpdateFolderInput;
	assetsTrashFolder: AssetsTrashFolderInput;
	assetsRestoreFolder: AssetsRestoreFolderInput;

	webhooksQuotaAddEndpoint: WebhooksQuotaAddEndpointInput;
	webhooksQuotaListEndpoints: WebhooksQuotaListEndpointsInput;
	webhooksQuotaListEventTypes: WebhooksQuotaListEventTypesInput;
	webhooksQuotaUpdateEndpoint: WebhooksQuotaUpdateEndpointInput;
	webhooksQuotaDeleteEndpoint: WebhooksQuotaDeleteEndpointInput;
	webhooksQuotaGetCurrentUser: WebhooksQuotaGetCurrentUserInput;
	webhooksQuotaRemainingQuota: WebhooksQuotaRemainingQuotaInput;

	videoAgentsListSessions: VideoAgentListSessionsInput;
	videoAgentsCreateSession: VideoAgentCreateSessionInput;
	videoAgentsListStyles: VideoAgentListStylesInput;
	videoAgentsGetSession: VideoAgentGetSessionInput;
	videoAgentsSendMessage: VideoAgentSendMessageInput;
	videoAgentsGetResource: VideoAgentGetResourceInput;
	videoAgentsListVideos: VideoAgentListVideosInput;
	videoAgentsStopSession: VideoAgentStopSessionInput;

	brandListGlossaries: BrandListGlossariesInput;
	brandListKits: BrandListKitsInput;

	avatarsCreate: AvatarsCreateInput;
	avatarsGetGroup: AvatarsGetGroupInput;
	avatarsDeleteGroup: AvatarsDeleteGroupInput;
	avatarsCreateConsent: AvatarsCreateConsentInput;
	avatarsListLooks: AvatarsListLooksInput;
	avatarsGetLook: AvatarsGetLookInput;
	avatarsDeleteLook: AvatarsDeleteLookInput;
	avatarsUpdateLook: AvatarsUpdateLookInput;

	avatarRealtimeCreateSession: AvatarRealtimeCreateSessionInput;
	avatarRealtimeGetSession: AvatarRealtimeGetSessionInput;
	avatarRealtimeAppendText: AvatarRealtimeAppendTextInput;
	avatarRealtimeCancelSession: AvatarRealtimeCancelSessionInput;

	audioSearch: AudioSearchInput;

	voicesGenerateSpeechV3: VoicesGenerateSpeechV3Input;
	voicesListV3: VoicesListV3Input;
	voicesDesign: VoicesDesignInput;
	voicesClone: VoicesCloneInput;
	voicesGetV3: VoicesGetV3Input;
	voicesDeleteV3: VoicesDeleteV3Input;

	videosListV3: VideosListV3Input;
	videosDeleteV3: VideosDeleteV3Input;

	videoTranslationsList: VideoTranslationsListInput;
	videoTranslationsDelete: VideoTranslationsDeleteInput;
	videoTranslationsUpdate: VideoTranslationsUpdateInput;

	proofreadCreate: ProofreadCreateInput;
	proofreadGet: ProofreadGetInput;
	proofreadDownloadSrt: ProofreadDownloadSrtInput;
	proofreadUploadSrt: ProofreadUploadSrtInput;
	proofreadGenerateVideo: ProofreadGenerateVideoInput;

	lipsyncList: LipsyncListInput;
	lipsyncCreate: LipsyncCreateInput;
	lipsyncGet: LipsyncGetInput;
	lipsyncDelete: LipsyncDeleteInput;
	lipsyncUpdate: LipsyncUpdateInput;

	hyperframesList: HyperframesListInput;
	hyperframesCreate: HyperframesCreateInput;
	hyperframesGet: HyperframesGetInput;
	hyperframesDelete: HyperframesDeleteInput;

	webhooksListEventTypesV3: WebhooksListEventTypesV3Input;
	webhooksListEndpointsV3: WebhooksListEndpointsV3Input;
	webhooksAddEndpointV3: WebhooksAddEndpointV3Input;
	webhooksDeleteEndpointV3: WebhooksDeleteEndpointV3Input;
	webhooksUpdateEndpointV3: WebhooksUpdateEndpointV3Input;
	webhooksRotateSecret: WebhooksRotateSecretInput;
	webhooksListEvents: WebhooksListEventsInput;

	assetsUploadAssetV3: AssetsUploadAssetV3Input;
	assetsGetAsset: AssetsGetAssetInput;
	assetsDeleteAssetV3: AssetsDeleteAssetV3Input;
	assetsCreateUploadSession: AssetsCreateUploadSessionInput;
	assetsCompleteUpload: AssetsCompleteUploadInput;

	aiClippingGet: AiClippingGetInput;
	aiClippingDelete: AiClippingDeleteInput;
	aiClippingList: AiClippingListInput;
	aiClippingCreate: AiClippingCreateInput;
};

export type HeygenEndpointOutputs = {
	videosGenerate: VideosGenerateResponse;
	videosTemplateGenerate: VideosTemplateGenerateResponse;
	videosCreateWebm: VideosCreateWebmResponse;
	videosPersonalizedAddContact: VideosPersonalizedAddContactResponse;
	videosPersonalizedProjectDetail: VideosPersonalizedProjectDetailResponse;
	videosGetStatus: VideosGetStatusResponse;
	videosTranslate: VideosTranslateResponse;
	videosTranslateStatus: VideosTranslateStatusResponse;
	videosTranslateTargetLanguages: VideosTranslateTargetLanguagesResponse;
	videosGetSharableUrl: VideosGetSharableUrlResponse;
	videosDelete: VideosDeleteResponse;
	videosList: VideosListResponse;

	avatarsList: AvatarsListResponse;
	avatarsGetDetails: AvatarsGetDetailsResponse;
	avatarsListGroups: AvatarsListGroupsResponse;
	avatarsListGroupAvatars: AvatarsListGroupAvatarsResponse;
	avatarsSearchPublicGroups: AvatarsSearchPublicGroupsResponse;
	avatarsCreatePhotoGroup: AvatarsCreatePhotoGroupResponse;
	avatarsGeneratePhotos: AvatarsGeneratePhotosResponse;
	avatarsAddLooks: AvatarsAddLooksResponse;
	avatarsCheckLookStatus: AvatarsCheckLookStatusResponse;
	avatarsGetTrainingStatus: AvatarsGetTrainingStatusResponse;
	avatarsGetPhotoDetails: AvatarsGetPhotoDetailsResponse;
	avatarsDeletePhotoGroup: AvatarsDeletePhotoGroupResponse;
	avatarsDeletePhoto: AvatarsDeletePhotoResponse;
	avatarsAddMotion: AvatarsAddMotionResponse;
	avatarsUpscale: AvatarsUpscaleResponse;
	avatarsListTalkingPhotos: AvatarsListTalkingPhotosResponse;
	avatarsUploadTalkingPhoto: AvatarsUploadTalkingPhotoResponse;
	avatarsDeleteTalkingPhoto: AvatarsDeleteTalkingPhotoResponse;

	voicesGenerateSpeech: VoicesGenerateSpeechResponse;
	voicesGeneratePreview: VoicesGeneratePreviewResponse;
	voicesListTts: VoicesListTtsResponse;
	voicesListLocales: VoicesListLocalesResponse;
	voicesListV2: VoicesListV2Response;
	voicesListV1: VoicesListV1Response;
	voicesListBrandVoices: VoicesListBrandVoicesResponse;

	streamingNewSession: StreamingNewSessionResponse;
	streamingCreateToken: StreamingCreateTokenResponse;
	streamingStart: StreamingStartResponse;
	streamingStop: StreamingStopResponse;
	streamingInterrupt: StreamingInterruptResponse;
	streamingKeepAlive: StreamingKeepAliveResponse;
	streamingTask: StreamingTaskResponse;
	streamingIce: StreamingIceResponse;
	streamingNew: StreamingNewResponse;
	streamingList: StreamingListResponse;
	streamingListAvatars: StreamingListAvatarsResponse;
	streamingListSessionHistory: StreamingListSessionHistoryResponse;

	knowledgeBasesCreate: KnowledgeBasesCreateResponse;
	knowledgeBasesList: KnowledgeBasesListResponse;
	knowledgeBasesUpdate: KnowledgeBasesUpdateResponse;
	knowledgeBasesDelete: KnowledgeBasesDeleteResponse;

	assetsListTemplates: AssetsListTemplatesResponse;
	assetsGetTemplate: AssetsGetTemplateResponse;
	assetsUploadAsset: AssetsUploadAssetResponse;
	assetsListAssets: AssetsListAssetsResponse;
	assetsListAssets2: AssetsListAssets2Response;
	assetsDeleteAsset: AssetsDeleteAssetResponse;
	assetsCreateFolder: AssetsCreateFolderResponse;
	assetsListFolders: AssetsListFoldersResponse;
	assetsUpdateFolder: AssetsUpdateFolderResponse;
	assetsTrashFolder: AssetsTrashFolderResponse;
	assetsRestoreFolder: AssetsRestoreFolderResponse;

	webhooksQuotaAddEndpoint: WebhooksQuotaAddEndpointResponse;
	webhooksQuotaListEndpoints: WebhooksQuotaListEndpointsResponse;
	webhooksQuotaListEventTypes: WebhooksQuotaListEventTypesResponse;
	webhooksQuotaUpdateEndpoint: WebhooksQuotaUpdateEndpointResponse;
	webhooksQuotaDeleteEndpoint: WebhooksQuotaDeleteEndpointResponse;
	webhooksQuotaGetCurrentUser: WebhooksQuotaGetCurrentUserResponse;
	webhooksQuotaRemainingQuota: WebhooksQuotaRemainingQuotaResponse;

	videoAgentsListSessions: VideoAgentListSessionsResponse;
	videoAgentsCreateSession: VideoAgentCreateSessionResponse;
	videoAgentsListStyles: VideoAgentListStylesResponse;
	videoAgentsGetSession: VideoAgentGetSessionResponse;
	videoAgentsSendMessage: VideoAgentSendMessageResponse;
	videoAgentsGetResource: VideoAgentGetResourceResponse;
	videoAgentsListVideos: VideoAgentListVideosResponse;
	videoAgentsStopSession: VideoAgentStopSessionResponse;

	brandListGlossaries: BrandListGlossariesResponse;
	brandListKits: BrandListKitsResponse;

	avatarsCreate: AvatarsCreateResponse;
	avatarsGetGroup: AvatarsGetGroupResponse;
	avatarsDeleteGroup: AvatarsDeleteGroupResponse;
	avatarsCreateConsent: AvatarsCreateConsentResponse;
	avatarsListLooks: AvatarsListLooksResponse;
	avatarsGetLook: AvatarsGetLookResponse;
	avatarsDeleteLook: AvatarsDeleteLookResponse;
	avatarsUpdateLook: AvatarsUpdateLookResponse;

	avatarRealtimeCreateSession: AvatarRealtimeCreateSessionResponse;
	avatarRealtimeGetSession: AvatarRealtimeGetSessionResponse;
	avatarRealtimeAppendText: AvatarRealtimeAppendTextResponse;
	avatarRealtimeCancelSession: AvatarRealtimeCancelSessionResponse;

	audioSearch: AudioSearchResponse;

	voicesGenerateSpeechV3: VoicesGenerateSpeechV3Response;
	voicesListV3: VoicesListV3Response;
	voicesDesign: VoicesDesignResponse;
	voicesClone: VoicesCloneResponse;
	voicesGetV3: VoicesGetV3Response;
	voicesDeleteV3: VoicesDeleteV3Response;

	videosListV3: VideosListV3Response;
	videosDeleteV3: VideosDeleteV3Response;

	videoTranslationsList: VideoTranslationsListResponse;
	videoTranslationsDelete: VideoTranslationsDeleteResponse;
	videoTranslationsUpdate: VideoTranslationsUpdateResponse;

	proofreadCreate: ProofreadCreateResponse;
	proofreadGet: ProofreadGetResponse;
	proofreadDownloadSrt: ProofreadDownloadSrtResponse;
	proofreadUploadSrt: ProofreadUploadSrtResponse;
	proofreadGenerateVideo: ProofreadGenerateVideoResponse;

	lipsyncList: LipsyncListResponse;
	lipsyncCreate: LipsyncCreateResponse;
	lipsyncGet: LipsyncGetResponse;
	lipsyncDelete: LipsyncDeleteResponse;
	lipsyncUpdate: LipsyncUpdateResponse;

	hyperframesList: HyperframesListResponse;
	hyperframesCreate: HyperframesCreateResponse;
	hyperframesGet: HyperframesGetResponse;
	hyperframesDelete: HyperframesDeleteResponse;

	webhooksListEventTypesV3: WebhooksListEventTypesV3Response;
	webhooksListEndpointsV3: WebhooksListEndpointsV3Response;
	webhooksAddEndpointV3: WebhooksAddEndpointV3Response;
	webhooksDeleteEndpointV3: WebhooksDeleteEndpointV3Response;
	webhooksUpdateEndpointV3: WebhooksUpdateEndpointV3Response;
	webhooksRotateSecret: WebhooksRotateSecretResponse;
	webhooksListEvents: WebhooksListEventsResponse;

	assetsUploadAssetV3: AssetsUploadAssetV3Response;
	assetsGetAsset: AssetsGetAssetResponse;
	assetsDeleteAssetV3: AssetsDeleteAssetV3Response;
	assetsCreateUploadSession: AssetsCreateUploadSessionResponse;
	assetsCompleteUpload: AssetsCompleteUploadResponse;

	aiClippingGet: AiClippingGetResponse;
	aiClippingDelete: AiClippingDeleteResponse;
	aiClippingList: AiClippingListResponse;
	aiClippingCreate: AiClippingCreateResponse;
};

export const HeygenEndpointInputSchemas = {
	videosGenerate: VideosGenerateInputSchema,
	videosTemplateGenerate: VideosTemplateGenerateInputSchema,
	videosCreateWebm: VideosCreateWebmInputSchema,
	videosPersonalizedAddContact: VideosPersonalizedAddContactInputSchema,
	videosPersonalizedProjectDetail: VideosPersonalizedProjectDetailInputSchema,
	videosGetStatus: VideosGetStatusInputSchema,
	videosTranslate: VideosTranslateInputSchema,
	videosTranslateStatus: VideosTranslateStatusInputSchema,
	videosTranslateTargetLanguages: VideosTranslateTargetLanguagesInputSchema,
	videosGetSharableUrl: VideosGetSharableUrlInputSchema,
	videosDelete: VideosDeleteInputSchema,
	videosList: VideosListInputSchema,

	avatarsList: AvatarsListInputSchema,
	avatarsGetDetails: AvatarsGetDetailsInputSchema,
	avatarsListGroups: AvatarsListGroupsInputSchema,
	avatarsListGroupAvatars: AvatarsListGroupAvatarsInputSchema,
	avatarsSearchPublicGroups: AvatarsSearchPublicGroupsInputSchema,
	avatarsCreatePhotoGroup: AvatarsCreatePhotoGroupInputSchema,
	avatarsGeneratePhotos: AvatarsGeneratePhotosInputSchema,
	avatarsAddLooks: AvatarsAddLooksInputSchema,
	avatarsCheckLookStatus: AvatarsCheckLookStatusInputSchema,
	avatarsGetTrainingStatus: AvatarsGetTrainingStatusInputSchema,
	avatarsGetPhotoDetails: AvatarsGetPhotoDetailsInputSchema,
	avatarsDeletePhotoGroup: AvatarsDeletePhotoGroupInputSchema,
	avatarsDeletePhoto: AvatarsDeletePhotoInputSchema,
	avatarsAddMotion: AvatarsAddMotionInputSchema,
	avatarsUpscale: AvatarsUpscaleInputSchema,
	avatarsListTalkingPhotos: AvatarsListTalkingPhotosInputSchema,
	avatarsUploadTalkingPhoto: AvatarsUploadTalkingPhotoInputSchema,
	avatarsDeleteTalkingPhoto: AvatarsDeleteTalkingPhotoInputSchema,

	voicesGenerateSpeech: VoicesGenerateSpeechInputSchema,
	voicesGeneratePreview: VoicesGeneratePreviewInputSchema,
	voicesListTts: VoicesListTtsInputSchema,
	voicesListLocales: VoicesListLocalesInputSchema,
	voicesListV2: VoicesListV2InputSchema,
	voicesListV1: VoicesListV1InputSchema,
	voicesListBrandVoices: VoicesListBrandVoicesInputSchema,

	streamingNewSession: StreamingNewSessionInputSchema,
	streamingCreateToken: StreamingCreateTokenInputSchema,
	streamingStart: StreamingStartInputSchema,
	streamingStop: StreamingStopInputSchema,
	streamingInterrupt: StreamingInterruptInputSchema,
	streamingKeepAlive: StreamingKeepAliveInputSchema,
	streamingTask: StreamingTaskInputSchema,
	streamingIce: StreamingIceInputSchema,
	streamingNew: StreamingNewInputSchema,
	streamingList: StreamingListInputSchema,
	streamingListAvatars: StreamingListAvatarsInputSchema,
	streamingListSessionHistory: StreamingListSessionHistoryInputSchema,

	knowledgeBasesCreate: KnowledgeBasesCreateInputSchema,
	knowledgeBasesList: KnowledgeBasesListInputSchema,
	knowledgeBasesUpdate: KnowledgeBasesUpdateInputSchema,
	knowledgeBasesDelete: KnowledgeBasesDeleteInputSchema,

	assetsListTemplates: AssetsListTemplatesInputSchema,
	assetsGetTemplate: AssetsGetTemplateInputSchema,
	assetsUploadAsset: AssetsUploadAssetInputSchema,
	assetsListAssets: AssetsListAssetsInputSchema,
	assetsListAssets2: AssetsListAssets2InputSchema,
	assetsDeleteAsset: AssetsDeleteAssetInputSchema,
	assetsCreateFolder: AssetsCreateFolderInputSchema,
	assetsListFolders: AssetsListFoldersInputSchema,
	assetsUpdateFolder: AssetsUpdateFolderInputSchema,
	assetsTrashFolder: AssetsTrashFolderInputSchema,
	assetsRestoreFolder: AssetsRestoreFolderInputSchema,

	webhooksQuotaAddEndpoint: WebhooksQuotaAddEndpointInputSchema,
	webhooksQuotaListEndpoints: WebhooksQuotaListEndpointsInputSchema,
	webhooksQuotaListEventTypes: WebhooksQuotaListEventTypesInputSchema,
	webhooksQuotaUpdateEndpoint: WebhooksQuotaUpdateEndpointInputSchema,
	webhooksQuotaDeleteEndpoint: WebhooksQuotaDeleteEndpointInputSchema,
	webhooksQuotaGetCurrentUser: WebhooksQuotaGetCurrentUserInputSchema,
	webhooksQuotaRemainingQuota: WebhooksQuotaRemainingQuotaInputSchema,

	videoAgentsListSessions: VideoAgentListSessionsInputSchema,
	videoAgentsCreateSession: VideoAgentCreateSessionInputSchema,
	videoAgentsListStyles: VideoAgentListStylesInputSchema,
	videoAgentsGetSession: VideoAgentGetSessionInputSchema,
	videoAgentsSendMessage: VideoAgentSendMessageInputSchema,
	videoAgentsGetResource: VideoAgentGetResourceInputSchema,
	videoAgentsListVideos: VideoAgentListVideosInputSchema,
	videoAgentsStopSession: VideoAgentStopSessionInputSchema,

	brandListGlossaries: BrandListGlossariesInputSchema,
	brandListKits: BrandListKitsInputSchema,

	avatarsCreate: AvatarsCreateInputSchema,
	avatarsGetGroup: AvatarsGetGroupInputSchema,
	avatarsDeleteGroup: AvatarsDeleteGroupInputSchema,
	avatarsCreateConsent: AvatarsCreateConsentInputSchema,
	avatarsListLooks: AvatarsListLooksInputSchema,
	avatarsGetLook: AvatarsGetLookInputSchema,
	avatarsDeleteLook: AvatarsDeleteLookInputSchema,
	avatarsUpdateLook: AvatarsUpdateLookInputSchema,

	avatarRealtimeCreateSession: AvatarRealtimeCreateSessionInputSchema,
	avatarRealtimeGetSession: AvatarRealtimeGetSessionInputSchema,
	avatarRealtimeAppendText: AvatarRealtimeAppendTextInputSchema,
	avatarRealtimeCancelSession: AvatarRealtimeCancelSessionInputSchema,

	audioSearch: AudioSearchInputSchema,

	voicesGenerateSpeechV3: VoicesGenerateSpeechV3InputSchema,
	voicesListV3: VoicesListV3InputSchema,
	voicesDesign: VoicesDesignInputSchema,
	voicesClone: VoicesCloneInputSchema,
	voicesGetV3: VoicesGetV3InputSchema,
	voicesDeleteV3: VoicesDeleteV3InputSchema,

	videosListV3: VideosListV3InputSchema,
	videosDeleteV3: VideosDeleteV3InputSchema,

	videoTranslationsList: VideoTranslationsListInputSchema,
	videoTranslationsDelete: VideoTranslationsDeleteInputSchema,
	videoTranslationsUpdate: VideoTranslationsUpdateInputSchema,

	proofreadCreate: ProofreadCreateInputSchema,
	proofreadGet: ProofreadGetInputSchema,
	proofreadDownloadSrt: ProofreadDownloadSrtInputSchema,
	proofreadUploadSrt: ProofreadUploadSrtInputSchema,
	proofreadGenerateVideo: ProofreadGenerateVideoInputSchema,

	lipsyncList: LipsyncListInputSchema,
	lipsyncCreate: LipsyncCreateInputSchema,
	lipsyncGet: LipsyncGetInputSchema,
	lipsyncDelete: LipsyncDeleteInputSchema,
	lipsyncUpdate: LipsyncUpdateInputSchema,

	hyperframesList: HyperframesListInputSchema,
	hyperframesCreate: HyperframesCreateInputSchema,
	hyperframesGet: HyperframesGetInputSchema,
	hyperframesDelete: HyperframesDeleteInputSchema,

	webhooksListEventTypesV3: WebhooksListEventTypesV3InputSchema,
	webhooksListEndpointsV3: WebhooksListEndpointsV3InputSchema,
	webhooksAddEndpointV3: WebhooksAddEndpointV3InputSchema,
	webhooksDeleteEndpointV3: WebhooksDeleteEndpointV3InputSchema,
	webhooksUpdateEndpointV3: WebhooksUpdateEndpointV3InputSchema,
	webhooksRotateSecret: WebhooksRotateSecretInputSchema,
	webhooksListEvents: WebhooksListEventsInputSchema,

	assetsUploadAssetV3: AssetsUploadAssetV3InputSchema,
	assetsGetAsset: AssetsGetAssetInputSchema,
	assetsDeleteAssetV3: AssetsDeleteAssetV3InputSchema,
	assetsCreateUploadSession: AssetsCreateUploadSessionInputSchema,
	assetsCompleteUpload: AssetsCompleteUploadInputSchema,

	aiClippingGet: AiClippingGetInputSchema,
	aiClippingDelete: AiClippingDeleteInputSchema,
	aiClippingList: AiClippingListInputSchema,
	aiClippingCreate: AiClippingCreateInputSchema,
} as const;

export const HeygenEndpointOutputSchemas = {
	videosGenerate: VideosGenerateResponseSchema,
	videosTemplateGenerate: VideosTemplateGenerateResponseSchema,
	videosCreateWebm: VideosCreateWebmResponseSchema,
	videosPersonalizedAddContact: VideosPersonalizedAddContactResponseSchema,
	videosPersonalizedProjectDetail:
		VideosPersonalizedProjectDetailResponseSchema,
	videosGetStatus: VideosGetStatusResponseSchema,
	videosTranslate: VideosTranslateResponseSchema,
	videosTranslateStatus: VideosTranslateStatusResponseSchema,
	videosTranslateTargetLanguages: VideosTranslateTargetLanguagesResponseSchema,
	videosGetSharableUrl: VideosGetSharableUrlResponseSchema,
	videosDelete: VideosDeleteResponseSchema,
	videosList: VideosListResponseSchema,

	avatarsList: AvatarsListResponseSchema,
	avatarsGetDetails: AvatarsGetDetailsResponseSchema,
	avatarsListGroups: AvatarsListGroupsResponseSchema,
	avatarsListGroupAvatars: AvatarsListGroupAvatarsResponseSchema,
	avatarsSearchPublicGroups: AvatarsSearchPublicGroupsResponseSchema,
	avatarsCreatePhotoGroup: AvatarsCreatePhotoGroupResponseSchema,
	avatarsGeneratePhotos: AvatarsGeneratePhotosResponseSchema,
	avatarsAddLooks: AvatarsAddLooksResponseSchema,
	avatarsCheckLookStatus: AvatarsCheckLookStatusResponseSchema,
	avatarsGetTrainingStatus: AvatarsGetTrainingStatusResponseSchema,
	avatarsGetPhotoDetails: AvatarsGetPhotoDetailsResponseSchema,
	avatarsDeletePhotoGroup: AvatarsDeletePhotoGroupResponseSchema,
	avatarsDeletePhoto: AvatarsDeletePhotoResponseSchema,
	avatarsAddMotion: AvatarsAddMotionResponseSchema,
	avatarsUpscale: AvatarsUpscaleResponseSchema,
	avatarsListTalkingPhotos: AvatarsListTalkingPhotosResponseSchema,
	avatarsUploadTalkingPhoto: AvatarsUploadTalkingPhotoResponseSchema,
	avatarsDeleteTalkingPhoto: AvatarsDeleteTalkingPhotoResponseSchema,

	voicesGenerateSpeech: VoicesGenerateSpeechResponseSchema,
	voicesGeneratePreview: VoicesGeneratePreviewResponseSchema,
	voicesListTts: VoicesListTtsResponseSchema,
	voicesListLocales: VoicesListLocalesResponseSchema,
	voicesListV2: VoicesListV2ResponseSchema,
	voicesListV1: VoicesListV1ResponseSchema,
	voicesListBrandVoices: VoicesListBrandVoicesResponseSchema,

	streamingNewSession: StreamingNewSessionResponseSchema,
	streamingCreateToken: StreamingCreateTokenResponseSchema,
	streamingStart: StreamingStartResponseSchema,
	streamingStop: StreamingStopResponseSchema,
	streamingInterrupt: StreamingInterruptResponseSchema,
	streamingKeepAlive: StreamingKeepAliveResponseSchema,
	streamingTask: StreamingTaskResponseSchema,
	streamingIce: StreamingIceResponseSchema,
	streamingNew: StreamingNewResponseSchema,
	streamingList: StreamingListResponseSchema,
	streamingListAvatars: StreamingListAvatarsResponseSchema,
	streamingListSessionHistory: StreamingListSessionHistoryResponseSchema,

	knowledgeBasesCreate: KnowledgeBasesCreateResponseSchema,
	knowledgeBasesList: KnowledgeBasesListResponseSchema,
	knowledgeBasesUpdate: KnowledgeBasesUpdateResponseSchema,
	knowledgeBasesDelete: KnowledgeBasesDeleteResponseSchema,

	assetsListTemplates: AssetsListTemplatesResponseSchema,
	assetsGetTemplate: AssetsGetTemplateResponseSchema,
	assetsUploadAsset: AssetsUploadAssetResponseSchema,
	assetsListAssets: AssetsListAssetsResponseSchema,
	assetsListAssets2: AssetsListAssets2ResponseSchema,
	assetsDeleteAsset: AssetsDeleteAssetResponseSchema,
	assetsCreateFolder: AssetsCreateFolderResponseSchema,
	assetsListFolders: AssetsListFoldersResponseSchema,
	assetsUpdateFolder: AssetsUpdateFolderResponseSchema,
	assetsTrashFolder: AssetsTrashFolderResponseSchema,
	assetsRestoreFolder: AssetsRestoreFolderResponseSchema,

	webhooksQuotaAddEndpoint: WebhooksQuotaAddEndpointResponseSchema,
	webhooksQuotaListEndpoints: WebhooksQuotaListEndpointsResponseSchema,
	webhooksQuotaListEventTypes: WebhooksQuotaListEventTypesResponseSchema,
	webhooksQuotaUpdateEndpoint: WebhooksQuotaUpdateEndpointResponseSchema,
	webhooksQuotaDeleteEndpoint: WebhooksQuotaDeleteEndpointResponseSchema,
	webhooksQuotaGetCurrentUser: WebhooksQuotaGetCurrentUserResponseSchema,
	webhooksQuotaRemainingQuota: WebhooksQuotaRemainingQuotaResponseSchema,

	videoAgentsListSessions: VideoAgentListSessionsResponseSchema,
	videoAgentsCreateSession: VideoAgentCreateSessionResponseSchema,
	videoAgentsListStyles: VideoAgentListStylesResponseSchema,
	videoAgentsGetSession: VideoAgentGetSessionResponseSchema,
	videoAgentsSendMessage: VideoAgentSendMessageResponseSchema,
	videoAgentsGetResource: VideoAgentGetResourceResponseSchema,
	videoAgentsListVideos: VideoAgentListVideosResponseSchema,
	videoAgentsStopSession: VideoAgentStopSessionResponseSchema,

	brandListGlossaries: BrandListGlossariesResponseSchema,
	brandListKits: BrandListKitsResponseSchema,

	avatarsCreate: AvatarsCreateResponseSchema,
	avatarsGetGroup: AvatarsGetGroupResponseSchema,
	avatarsDeleteGroup: AvatarsDeleteGroupResponseSchema,
	avatarsCreateConsent: AvatarsCreateConsentResponseSchema,
	avatarsListLooks: AvatarsListLooksResponseSchema,
	avatarsGetLook: AvatarsGetLookResponseSchema,
	avatarsDeleteLook: AvatarsDeleteLookResponseSchema,
	avatarsUpdateLook: AvatarsUpdateLookResponseSchema,

	avatarRealtimeCreateSession: AvatarRealtimeCreateSessionResponseSchema,
	avatarRealtimeGetSession: AvatarRealtimeGetSessionResponseSchema,
	avatarRealtimeAppendText: AvatarRealtimeAppendTextResponseSchema,
	avatarRealtimeCancelSession: AvatarRealtimeCancelSessionResponseSchema,

	audioSearch: AudioSearchResponseSchema,

	voicesGenerateSpeechV3: VoicesGenerateSpeechV3ResponseSchema,
	voicesListV3: VoicesListV3ResponseSchema,
	voicesDesign: VoicesDesignResponseSchema,
	voicesClone: VoicesCloneResponseSchema,
	voicesGetV3: VoicesGetV3ResponseSchema,
	voicesDeleteV3: VoicesDeleteV3ResponseSchema,

	videosListV3: VideosListV3ResponseSchema,
	videosDeleteV3: VideosDeleteV3ResponseSchema,

	videoTranslationsList: VideoTranslationsListResponseSchema,
	videoTranslationsDelete: VideoTranslationsDeleteResponseSchema,
	videoTranslationsUpdate: VideoTranslationsUpdateResponseSchema,

	proofreadCreate: ProofreadCreateResponseSchema,
	proofreadGet: ProofreadGetResponseSchema,
	proofreadDownloadSrt: ProofreadDownloadSrtResponseSchema,
	proofreadUploadSrt: ProofreadUploadSrtResponseSchema,
	proofreadGenerateVideo: ProofreadGenerateVideoResponseSchema,

	lipsyncList: LipsyncListResponseSchema,
	lipsyncCreate: LipsyncCreateResponseSchema,
	lipsyncGet: LipsyncGetResponseSchema,
	lipsyncDelete: LipsyncDeleteResponseSchema,
	lipsyncUpdate: LipsyncUpdateResponseSchema,

	hyperframesList: HyperframesListResponseSchema,
	hyperframesCreate: HyperframesCreateResponseSchema,
	hyperframesGet: HyperframesGetResponseSchema,
	hyperframesDelete: HyperframesDeleteResponseSchema,

	webhooksListEventTypesV3: WebhooksListEventTypesV3ResponseSchema,
	webhooksListEndpointsV3: WebhooksListEndpointsV3ResponseSchema,
	webhooksAddEndpointV3: WebhooksAddEndpointV3ResponseSchema,
	webhooksDeleteEndpointV3: WebhooksDeleteEndpointV3ResponseSchema,
	webhooksUpdateEndpointV3: WebhooksUpdateEndpointV3ResponseSchema,
	webhooksRotateSecret: WebhooksRotateSecretResponseSchema,
	webhooksListEvents: WebhooksListEventsResponseSchema,

	assetsUploadAssetV3: AssetsUploadAssetV3ResponseSchema,
	assetsGetAsset: AssetsGetAssetResponseSchema,
	assetsDeleteAssetV3: AssetsDeleteAssetV3ResponseSchema,
	assetsCreateUploadSession: AssetsCreateUploadSessionResponseSchema,
	assetsCompleteUpload: AssetsCompleteUploadResponseSchema,

	aiClippingGet: AiClippingGetResponseSchema,
	aiClippingDelete: AiClippingDeleteResponseSchema,
	aiClippingList: AiClippingListResponseSchema,
	aiClippingCreate: AiClippingCreateResponseSchema,
} as const;
