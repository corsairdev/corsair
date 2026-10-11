import { logEventFromContext } from 'corsair/core';
import { makeChatworkRequest, pathSegment } from '../client';
import type { ChatworkEndpoints } from '../index';
import type { ChatworkEndpointOutputs } from './types';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './types';

export const list: ChatworkEndpoints['filesList'] = async (ctx, input) => {
	const { room_id, ...query } =
		ChatworkEndpointInputSchemas.filesList.parse(input);
	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['filesList']
	>(`rooms/${pathSegment(room_id)}/files`, ctx.key, {
		method: 'GET',
		query,
		authType: ctx.options?.authType,
		defaultEmptyArray: true,
	});
	const validatedResult = ChatworkEndpointOutputSchemas.filesList.parse(result);

	if (ctx.db.files) {
		try {
			for (const file of validatedResult) {
				await ctx.db.files.upsertByEntityId(String(file.file_id), {
					...file,
					room_id,
				});
			}
		} catch (error) {
			console.warn('Failed to save Chatwork files to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.files.list',
		{ room_id, ...query },
		'completed',
	);

	return validatedResult;
};

export const get: ChatworkEndpoints['filesGet'] = async (ctx, input) => {
	const { room_id, file_id, create_download_url } =
		ChatworkEndpointInputSchemas.filesGet.parse(input);
	const result = await makeChatworkRequest<ChatworkEndpointOutputs['filesGet']>(
		`rooms/${pathSegment(room_id)}/files/${pathSegment(file_id)}`,
		ctx.key,
		{
			method: 'GET',
			query: { create_download_url },
			authType: ctx.options?.authType,
		},
	);
	const validatedResult = ChatworkEndpointOutputSchemas.filesGet.parse(result);

	if (ctx.db.files) {
		try {
			const { download_url: _downloadUrl, ...file } = validatedResult;
			await ctx.db.files.upsertByEntityId(String(file.file_id), {
				...file,
				room_id,
			});
		} catch (error) {
			console.warn('Failed to save Chatwork file to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'chatwork.files.get',
		{ room_id, file_id, create_download_url },
		'completed',
	);

	return validatedResult;
};

export const upload: ChatworkEndpoints['filesUpload'] = async (ctx, input) => {
	const { room_id, file_base64, file_name, content_type, message } =
		ChatworkEndpointInputSchemas.filesUpload.parse(input);

	const multipart = new FormData();
	multipart.append(
		'file',
		new Blob([Buffer.from(file_base64, 'base64')], {
			type: content_type ?? 'application/octet-stream',
		}),
		file_name,
	);
	if (message !== undefined) {
		multipart.append('message', message);
	}

	const result = await makeChatworkRequest<
		ChatworkEndpointOutputs['filesUpload']
	>(`rooms/${pathSegment(room_id)}/files`, ctx.key, {
		method: 'POST',
		multipart,
		authType: ctx.options?.authType,
	});
	const validatedResult =
		ChatworkEndpointOutputSchemas.filesUpload.parse(result);

	await logEventFromContext(
		ctx,
		'chatwork.files.upload',
		{ room_id, file_name, content_type },
		'completed',
	);

	return validatedResult;
};
