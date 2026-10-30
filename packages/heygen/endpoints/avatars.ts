import { logEventFromContext } from 'corsair/core';
import {
	base64ToBlob,
	makeHeygenRequest,
	makeHeygenUploadRequest,
} from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// The avatar-details/group/photo-avatar/talking-photo operations below have no published v3
// equivalent per developers.heygen.com/endpoint-version-comparison, so they stay on their
// confirmed v1/v2 paths until HeyGen ships v3 replacements.

// Migrated to HeyGen v3 API endpoint per developers.heygen.com
export const list: HeygenEndpoints['avatarsList'] = async (ctx, input) => {
	const result = await makeHeygenRequest<HeygenEndpointOutputs['avatarsList']>(
		'/v3/avatars',
		ctx.key,
		{
			method: 'GET',
			query: {
				ownership: input.ownership,
				limit: input.limit,
				token: input.token,
			},
		},
	);

	await logEventFromContext(ctx, 'heygen.avatars.list', {}, 'completed');
	return result;
};

// [B] Path inferred as `/v2/avatar/{id}/details`; see endpoints/types.ts for details.
export const getDetails: HeygenEndpoints['avatarsGetDetails'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsGetDetails']
	>(`/v2/avatar/${input.avatar_id}/details`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'heygen.avatars.getDetails',
		{ avatarId: input.avatar_id },
		'completed',
	);
	return result;
};

// [B] Path inferred as `/v2/avatar_group/list`; see endpoints/types.ts for details.
export const listGroups: HeygenEndpoints['avatarsListGroups'] = async (ctx) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsListGroups']
	>('/v2/avatar_group/list', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'heygen.avatars.listGroups', {}, 'completed');
	return result;
};

export const listGroupAvatars: HeygenEndpoints['avatarsListGroupAvatars'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['avatarsListGroupAvatars']
		>(`/v2/avatar_group/${input.group_id}/avatars`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'heygen.avatars.listGroupAvatars',
			{ groupId: input.group_id },
			'completed',
		);
		return result;
	};

// [B] Path inferred as `/v2/avatar_group/search_public`; see endpoints/types.ts.
export const searchPublicGroups: HeygenEndpoints['avatarsSearchPublicGroups'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['avatarsSearchPublicGroups']
		>('/v2/avatar_group/search_public', ctx.key, {
			method: 'GET',
			query: { keyword: input.keyword, page: input.page, limit: input.limit },
		});

		await logEventFromContext(
			ctx,
			'heygen.avatars.searchPublicGroups',
			{},
			'completed',
		);
		return result;
	};

export const createPhotoGroup: HeygenEndpoints['avatarsCreatePhotoGroup'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['avatarsCreatePhotoGroup']
		>('/v2/photo_avatar/avatar_group/create', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'heygen.avatars.createPhotoGroup',
			{},
			'completed',
		);
		return result;
	};

export const generatePhotos: HeygenEndpoints['avatarsGeneratePhotos'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsGeneratePhotos']
	>('/v2/photo_avatar/photo/generate', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'heygen.avatars.generatePhotos',
		{},
		'completed',
	);
	return result;
};

export const addLooks: HeygenEndpoints['avatarsAddLooks'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsAddLooks']
	>('/v2/photo_avatar/avatar_group/add_looks', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'heygen.avatars.addLooks',
		{ groupId: input.group_id, itemCount: input.image_keys.length },
		'completed',
	);
	return result;
};

export const checkLookStatus: HeygenEndpoints['avatarsCheckLookStatus'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['avatarsCheckLookStatus']
		>(`/v2/photo_avatar/generation/${input.generation_id}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'heygen.avatars.checkLookStatus',
			{ generationId: input.generation_id },
			'completed',
		);
		return result;
	};

// [B] Path inferred as `/v2/photo_avatar/train/status/{group_id}`; see endpoints/types.ts.
export const getTrainingStatus: HeygenEndpoints['avatarsGetTrainingStatus'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['avatarsGetTrainingStatus']
		>(`/v2/photo_avatar/train/status/${input.group_id}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'heygen.avatars.getTrainingStatus',
			{ groupId: input.group_id },
			'completed',
		);
		return result;
	};

// [B] Path inferred as `/v2/photo_avatar/{id}`; see endpoints/types.ts.
export const getPhotoDetails: HeygenEndpoints['avatarsGetPhotoDetails'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['avatarsGetPhotoDetails']
		>(`/v2/photo_avatar/${input.id}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'heygen.avatars.getPhotoDetails',
			{ avatarId: input.id },
			'completed',
		);
		return result;
	};

// [B] Path inferred as `/v2/photo_avatar/avatar_group/{group_id}`; see endpoints/types.ts.
export const deletePhotoGroup: HeygenEndpoints['avatarsDeletePhotoGroup'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['avatarsDeletePhotoGroup']
		>(`/v2/photo_avatar/avatar_group/${input.group_id}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'heygen.avatars.deletePhotoGroup',
			{ groupId: input.group_id },
			'completed',
		);
		return result;
	};

// [B] Path inferred as `/v2/photo_avatar/{id}`; see endpoints/types.ts.
export const deletePhoto: HeygenEndpoints['avatarsDeletePhoto'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsDeletePhoto']
	>(`/v2/photo_avatar/${input.id}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'heygen.avatars.deletePhoto',
		{ avatarId: input.id },
		'completed',
	);
	return result;
};

export const addMotion: HeygenEndpoints['avatarsAddMotion'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsAddMotion']
	>('/v2/photo_avatar/add_motion', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.avatars.addMotion',
		{ avatarId: input.id },
		'completed',
	);
	return result;
};

// [B] Path inferred as `/v2/photo_avatar/upscale`; see endpoints/types.ts.
export const upscale: HeygenEndpoints['avatarsUpscale'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsUpscale']
	>('/v2/photo_avatar/upscale', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.avatars.upscale',
		{ avatarId: input.id },
		'completed',
	);
	return result;
};

export const listTalkingPhotos: HeygenEndpoints['avatarsListTalkingPhotos'] =
	async (ctx) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['avatarsListTalkingPhotos']
		>('/v1/talking_photo.list', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'heygen.avatars.listTalkingPhotos',
			{},
			'completed',
		);
		return result;
	};

export const uploadTalkingPhoto: HeygenEndpoints['avatarsUploadTalkingPhoto'] =
	async (ctx, input) => {
		const result = await makeHeygenUploadRequest<
			HeygenEndpointOutputs['avatarsUploadTalkingPhoto']
		>('/v1/talking_photo', ctx.key, {
			method: 'POST',
			body: base64ToBlob(input.imageBase64, input.contentType),
			contentType: input.contentType,
		});

		await logEventFromContext(
			ctx,
			'heygen.avatars.uploadTalkingPhoto',
			{},
			'completed',
		);
		return result;
	};

export const deleteTalkingPhoto: HeygenEndpoints['avatarsDeleteTalkingPhoto'] =
	async (ctx, input) => {
		const result = await makeHeygenRequest<
			HeygenEndpointOutputs['avatarsDeleteTalkingPhoto']
		>(`/v2/talking_photo/${input.talking_photo_id}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'heygen.avatars.deleteTalkingPhoto',
			{ talkingPhotoId: input.talking_photo_id },
			'completed',
		);
		return result;
	};

// --- v3 additions: avatar groups/looks CRUD, per developers.heygen.com ---------

// Migrated to HeyGen v3 API per developers.heygen.com
export const create: HeygenEndpoints['avatarsCreate'] = async (ctx, input) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsCreate']
	>('/v3/avatars', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'heygen.avatars.create',
		{ type: input.type },
		'completed',
	);
	return result;
};

// Migrated to HeyGen v3 API per developers.heygen.com
export const getGroup: HeygenEndpoints['avatarsGetGroup'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsGetGroup']
	>(`/v3/avatars/${input.group_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'heygen.avatars.getGroup',
		{ groupId: input.group_id },
		'completed',
	);
	return result;
};

// Migrated to HeyGen v3 API per developers.heygen.com
export const deleteGroup: HeygenEndpoints['avatarsDeleteGroup'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsDeleteGroup']
	>(`/v3/avatars/${input.group_id}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'heygen.avatars.deleteGroup',
		{ groupId: input.group_id },
		'completed',
	);
	return result;
};

// Migrated to HeyGen v3 API per developers.heygen.com
export const createConsent: HeygenEndpoints['avatarsCreateConsent'] = async (
	ctx,
	input,
) => {
	const { group_id, ...body } = input;
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsCreateConsent']
	>(`/v3/avatars/${group_id}/consent`, ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'heygen.avatars.createConsent',
		{ groupId: group_id },
		'completed',
	);
	return result;
};

// Migrated to HeyGen v3 API per developers.heygen.com
export const listLooks: HeygenEndpoints['avatarsListLooks'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsListLooks']
	>('/v3/avatars/looks', ctx.key, {
		method: 'GET',
		query: {
			group_id: input.group_id,
			avatar_type: input.avatar_type,
			ownership: input.ownership,
			limit: input.limit,
			token: input.token,
		},
	});

	await logEventFromContext(ctx, 'heygen.avatars.listLooks', {}, 'completed');
	return result;
};

// Migrated to HeyGen v3 API per developers.heygen.com
export const getLook: HeygenEndpoints['avatarsGetLook'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsGetLook']
	>(`/v3/avatars/looks/${input.look_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'heygen.avatars.getLook',
		{ lookId: input.look_id },
		'completed',
	);
	return result;
};

// Migrated to HeyGen v3 API per developers.heygen.com
export const deleteLook: HeygenEndpoints['avatarsDeleteLook'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsDeleteLook']
	>(`/v3/avatars/looks/${input.look_id}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'heygen.avatars.deleteLook',
		{ lookId: input.look_id },
		'completed',
	);
	return result;
};

// Migrated to HeyGen v3 API per developers.heygen.com
export const updateLook: HeygenEndpoints['avatarsUpdateLook'] = async (
	ctx,
	input,
) => {
	const { look_id, ...body } = input;
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['avatarsUpdateLook']
	>(`/v3/avatars/looks/${look_id}`, ctx.key, { method: 'PATCH', body });

	await logEventFromContext(
		ctx,
		'heygen.avatars.updateLook',
		{ lookId: look_id },
		'completed',
	);
	return result;
};
