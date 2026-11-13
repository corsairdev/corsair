import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const create: GristEndpoints['docs.create'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['docs.create'].parse(input);
	const response = await makeGristRequest<unknown>('/docs', ctx.key, {
		method: 'POST',
		body: {
			...(parsedInput.workspaceId !== undefined
				? { workspaceId: parsedInput.workspaceId }
				: {}),
			...(parsedInput.documentName !== undefined
				? { documentName: parsedInput.documentName }
				: {}),
			...(parsedInput.sourceDocumentId !== undefined
				? { sourceDocumentId: parsedInput.sourceDocumentId }
				: {}),
			...(parsedInput.asTemplate !== undefined
				? { asTemplate: parsedInput.asTemplate }
				: {}),
			...(parsedInput.timezone !== undefined
				? { timezone: parsedInput.timezone }
				: {}),
		},
		baseUrl: ctx.options?.baseUrl,
	});
	const parsed = GristEndpointOutputSchemas['docs.create'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.create',
		{ docId: parsed },
		'completed',
	);
	return parsed;
};

export const createInWorkspace: GristEndpoints['docs.createInWorkspace'] =
	async (ctx, input) => {
		const parsedInput =
			GristEndpointInputSchemas['docs.createInWorkspace'].parse(input);
		const wsIdStr = encodeURIComponent(String(parsedInput.workspaceId));
		const response = await makeGristRequest<unknown>(
			`/workspaces/${wsIdStr}/docs`,
			ctx.key,
			{
				method: 'POST',
				body: {
					...(parsedInput.name !== undefined ? { name: parsedInput.name } : {}),
					...(parsedInput.isPinned !== undefined
						? { isPinned: parsedInput.isPinned }
						: {}),
				},
				baseUrl: ctx.options?.baseUrl,
			},
		);
		const parsed =
			GristEndpointOutputSchemas['docs.createInWorkspace'].parse(response);
		await logEventFromContext(
			ctx,
			'grist.docs.createInWorkspace',
			{ workspaceId: parsedInput.workspaceId, docId: parsed },
			'completed',
		);
		return parsed;
	};

export const get: GristEndpoints['docs.get'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['docs.get'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['docs.get'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.get',
		{ docId: parsedInput.docId },
		'completed',
	);
	return parsed;
};

export const update: GristEndpoints['docs.update'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['docs.update'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				...(parsedInput.name !== undefined ? { name: parsedInput.name } : {}),
				...(parsedInput.isPinned !== undefined
					? { isPinned: parsedInput.isPinned }
					: {}),
			},
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['docs.update'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.update',
		{ docId: parsedInput.docId },
		'completed',
	);
	return parsed;
};

export const deleteDoc: GristEndpoints['docs.delete'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['docs.delete'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}`,
		ctx.key,
		{
			method: 'DELETE',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['docs.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.delete',
		{ docId: parsedInput.docId },
		'completed',
	);
	return parsed;
};

export const remove: GristEndpoints['docs.remove'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['docs.remove'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/remove`,
		ctx.key,
		{
			method: 'POST',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['docs.remove'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.remove',
		{ docId: parsedInput.docId },
		'completed',
	);
	return parsed;
};

export const unremove: GristEndpoints['docs.unremove'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['docs.unremove'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/unremove`,
		ctx.key,
		{
			method: 'POST',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['docs.unremove'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.unremove',
		{ docId: parsedInput.docId },
		'completed',
	);
	return parsed;
};

export const move: GristEndpoints['docs.move'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['docs.move'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/move`,
		ctx.key,
		{
			method: 'PATCH',
			body: { workspace: parsedInput.workspace },
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['docs.move'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.move',
		{ docId: parsedInput.docId, workspace: parsedInput.workspace },
		'completed',
	);
	return parsed;
};

export const pin: GristEndpoints['docs.pin'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['docs.pin'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/pin`,
		ctx.key,
		{
			method: 'PATCH',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['docs.pin'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.pin',
		{ docId: parsedInput.docId },
		'completed',
	);
	return parsed;
};

export const unpin: GristEndpoints['docs.unpin'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['docs.unpin'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/unpin`,
		ctx.key,
		{
			method: 'PATCH',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['docs.unpin'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.unpin',
		{ docId: parsedInput.docId },
		'completed',
	);
	return parsed;
};

export const copy: GristEndpoints['docs.copy'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['docs.copy'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/copy`,
		ctx.key,
		{
			method: 'POST',
			body: {
				...(parsedInput.workspaceId !== undefined
					? { workspaceId: parsedInput.workspaceId }
					: {}),
				...(parsedInput.documentName !== undefined
					? { documentName: parsedInput.documentName }
					: {}),
				...(parsedInput.asTemplate !== undefined
					? { asTemplate: parsedInput.asTemplate }
					: {}),
			},
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['docs.copy'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.copy',
		{ sourceDocId: parsedInput.docId, newDocId: parsed },
		'completed',
	);
	return parsed;
};

export const fork: GristEndpoints['docs.fork'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['docs.fork'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/fork`,
		ctx.key,
		{
			method: 'POST',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['docs.fork'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.fork',
		{ sourceDocId: parsedInput.docId, forkedDocId: parsed },
		'completed',
	);
	return parsed;
};

export const listAccess: GristEndpoints['docs.listAccess'] = async (
	ctx,
	input,
) => {
	const parsedInput = GristEndpointInputSchemas['docs.listAccess'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/access`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['docs.listAccess'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.listAccess',
		{ docId: parsedInput.docId },
		'completed',
	);
	return parsed;
};

export const modifyAccess: GristEndpoints['docs.modifyAccess'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['docs.modifyAccess'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/access`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				...(parsedInput.maxInheritedRole
					? { maxInheritedRole: parsedInput.maxInheritedRole }
					: {}),
				users: parsedInput.users,
			},
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['docs.modifyAccess'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.modifyAccess',
		{ docId: parsedInput.docId },
		'completed',
	);
	return parsed;
};

export const listSnapshots: GristEndpoints['docs.listSnapshots'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['docs.listSnapshots'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/snapshots`,
		ctx.key,
		{
			method: 'GET',
			query:
				parsedInput.raw !== undefined ? { raw: parsedInput.raw } : undefined,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['docs.listSnapshots'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.listSnapshots',
		{ docId: parsedInput.docId, count: parsed.snapshots.length },
		'completed',
	);
	return parsed;
};

export const removeSnapshots: GristEndpoints['docs.removeSnapshots'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['docs.removeSnapshots'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/snapshots/remove`,
		ctx.key,
		{
			method: 'POST',
			body: { snapshotIds: parsedInput.snapshotIds },
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['docs.removeSnapshots'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.docs.removeSnapshots',
		{ docId: parsedInput.docId, count: parsedInput.snapshotIds.length },
		'completed',
	);
	return parsed;
};
