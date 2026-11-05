import { logEventFromContext } from 'corsair/core';
import { makeDropboxSignRequest } from '../client';
import type { DropboxSignEndpoints } from '../index';
import type { DropboxSignEndpointOutputs } from './types';

export const getTemplate: DropboxSignEndpoints['getTemplate'] = async (
	ctx,
	input,
) => {
	const { template_id } = input;
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['getTemplate']
	>(`template/${encodeURIComponent(template_id)}`, ctx, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.template.get',
		{ template_id },
		'completed',
	);
	return result;
};

export const listTemplates: DropboxSignEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['listTemplates']
	>('template/list', ctx, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.template.list',
		input ?? {},
		'completed',
	);
	return result;
};

export const createTemplate: DropboxSignEndpoints['createTemplate'] = async (
	ctx,
	input,
) => {
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['createTemplate']
	>('template/create', ctx, {
		method: 'POST',
		body: input,
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.template.create',
		{ title: input.title },
		'completed',
	);
	return result;
};

export const createEmbeddedTemplateDraft: DropboxSignEndpoints['createEmbeddedTemplateDraft'] =
	async (ctx, input) => {
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['createEmbeddedTemplateDraft']
		>('template/create_embedded_draft', ctx, {
			method: 'POST',
			body: input,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.template.createEmbeddedDraft',
			{ client_id: input.client_id },
			'completed',
		);
		return result;
	};

export const deleteTemplate: DropboxSignEndpoints['deleteTemplate'] = async (
	ctx,
	input,
) => {
	const { template_id } = input;
	const result = await makeDropboxSignRequest<
		DropboxSignEndpointOutputs['deleteTemplate']
	>(`template/delete/${encodeURIComponent(template_id)}`, ctx, {
		method: 'POST',
	});
	await logEventFromContext(
		ctx,
		'dropboxsign.template.delete',
		{ template_id },
		'completed',
	);
	return result;
};

export const addUserToTemplate: DropboxSignEndpoints['addUserToTemplate'] =
	async (ctx, input) => {
		const { template_id, ...body } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['addUserToTemplate']
		>(`template/add_user/${encodeURIComponent(template_id)}`, ctx, {
			method: 'POST',
			body,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.template.addUser',
			{ template_id },
			'completed',
		);
		return result;
	};

export const removeUserFromTemplate: DropboxSignEndpoints['removeUserFromTemplate'] =
	async (ctx, input) => {
		const { template_id, ...body } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['removeUserFromTemplate']
		>(`template/remove_user/${encodeURIComponent(template_id)}`, ctx, {
			method: 'POST',
			body,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.template.removeUser',
			{ template_id },
			'completed',
		);
		return result;
	};

export const getTemplateFiles: DropboxSignEndpoints['getTemplateFiles'] =
	async (ctx, input) => {
		const { template_id, ...query } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['getTemplateFiles']
		>(`template/files/${encodeURIComponent(template_id)}`, ctx, {
			method: 'GET',
			query,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.template.getFiles',
			{ template_id },
			'completed',
		);
		return result;
	};

export const getTemplateFilesAsFileUrl: DropboxSignEndpoints['getTemplateFilesAsFileUrl'] =
	async (ctx, input) => {
		const { template_id } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['getTemplateFilesAsFileUrl']
		>(`template/files_as_file_url/${encodeURIComponent(template_id)}`, ctx, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.template.getFilesAsFileUrl',
			{ template_id },
			'completed',
		);
		return result;
	};

export const getTemplateFilesAsDataUri: DropboxSignEndpoints['getTemplateFilesAsDataUri'] =
	async (ctx, input) => {
		const { template_id } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['getTemplateFilesAsDataUri']
		>(`template/files_as_data_uri/${encodeURIComponent(template_id)}`, ctx, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.template.getFilesAsDataUri',
			{ template_id },
			'completed',
		);
		return result;
	};

export const updateTemplateFiles: DropboxSignEndpoints['updateTemplateFiles'] =
	async (ctx, input) => {
		const { template_id, ...body } = input;
		const result = await makeDropboxSignRequest<
			DropboxSignEndpointOutputs['updateTemplateFiles']
		>(`template/update_files/${encodeURIComponent(template_id)}`, ctx, {
			method: 'POST',
			body,
		});
		await logEventFromContext(
			ctx,
			'dropboxsign.template.updateFiles',
			{ template_id },
			'completed',
		);
		return result;
	};
