import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { FiberyContext, FiberyEndpoints } from '..';
import {
	makeFiberyBinaryRequest,
	makeFiberyCommand,
	makeFiberyFileUpload,
	makeFiberyJsonRpc,
	makeFiberyRequest,
} from '../client';
import type { FiberyJson } from './types';
import {
	FiberyEndpointInputSchemas as Inputs,
	FiberyEndpointOutputSchemas as Outputs,
} from './types';

function clientOptions(ctx: FiberyContext) {
	return {
		workspaceUrl: ctx.options.workspaceUrl,
		authType:
			ctx.options.authType === 'oauth_2'
				? ('oauth_2' as const)
				: ('api_key' as const),
	};
}

async function command<I extends z.ZodType, O extends z.ZodType>(
	ctx: FiberyContext,
	// `unknown` because endpoint inputs arrive from external callers and are parsed below.
	input: unknown,
	inputSchema: I,
	outputSchema: O,
	commandName: string,
	makeArgs: (parsed: z.output<I>) => Record<string, FiberyJson>,
): Promise<z.output<O>> {
	const parsedInput = inputSchema.parse(input);
	const response = await makeFiberyCommand(
		commandName,
		makeArgs(parsedInput),
		ctx.key,
		clientOptions(ctx),
	);
	return outputSchema.parse(response);
}

export const schemaQuery: FiberyEndpoints['schemaQuery'] = async (ctx, input) =>
	command(
		ctx,
		input,
		Inputs.schemaQuery,
		Outputs.schemaQuery,
		'fibery.schema/query',
		(parsed) => {
			const args: Record<string, FiberyJson> = {};
			if (parsed.withDescription !== undefined)
				args['with-description?'] = parsed.withDescription;
			return args;
		},
	);

export const databaseCreate: FiberyEndpoints['databaseCreate'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.databaseCreate,
		Outputs.databaseCreate,
		'fibery.schema/batch',
		(parsed) => ({
			commands: [{ command: 'schema.type/create', args: parsed.database }],
		}),
	);

export const databaseRename: FiberyEndpoints['databaseRename'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.databaseRename,
		Outputs.databaseRename,
		'fibery.schema/batch',
		(parsed) => ({
			commands: [
				{
					command: 'schema.type/rename',
					args: { 'from-name': parsed.fromName, 'to-name': parsed.toName },
				},
			],
		}),
	);

export const databaseDelete: FiberyEndpoints['databaseDelete'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.databaseDelete,
		Outputs.databaseDelete,
		'fibery.schema/batch',
		(parsed) => ({
			commands: [
				{
					command: 'schema.type/delete',
					args: {
						name: parsed.name,
						'delete-entities?': parsed.deleteEntities ?? false,
						'delete-related-fields?': parsed.deleteRelatedFields ?? false,
					},
				},
			],
		}),
	);

export const fieldCreate: FiberyEndpoints['fieldCreate'] = async (ctx, input) =>
	command(
		ctx,
		input,
		Inputs.fieldCreate,
		Outputs.fieldCreate,
		'fibery.schema/batch',
		(parsed) => ({
			commands: [
				{
					command: 'schema.field/create',
					args: {
						'fibery/holder-type': parsed.holderType,
						'fibery/name': parsed.name,
						'fibery/type': parsed.type,
						...(parsed.meta ? { 'fibery/meta': parsed.meta } : {}),
					},
				},
			],
		}),
	);

export const enumCreate: FiberyEndpoints['enumCreate'] = async (ctx, input) =>
	command(
		ctx,
		input,
		Inputs.enumCreate,
		Outputs.enumCreate,
		'fibery.schema/batch',
		(parsed) => ({
			commands: [
				{ command: 'schema.enum/create', args: { 'fibery/name': parsed.name } },
			],
		}),
	);

export const fieldRename: FiberyEndpoints['fieldRename'] = async (ctx, input) =>
	command(
		ctx,
		input,
		Inputs.fieldRename,
		Outputs.fieldRename,
		'fibery.schema/batch',
		(parsed) => ({
			commands: [
				{
					command: 'schema.field/rename',
					args: {
						'holder-type': parsed.holderType,
						'from-name': parsed.fromName,
						'to-name': parsed.toName,
					},
				},
			],
		}),
	);

export const fieldDelete: FiberyEndpoints['fieldDelete'] = async (ctx, input) =>
	command(
		ctx,
		input,
		Inputs.fieldDelete,
		Outputs.fieldDelete,
		'fibery.schema/batch',
		(parsed) => ({
			commands: [
				{
					command: 'schema.field/delete',
					args: {
						'holder-type': parsed.holderType,
						name: parsed.name,
						'delete-values?': parsed.deleteValues ?? false,
					},
				},
			],
		}),
	);

export const fieldSetMeta: FiberyEndpoints['fieldSetMeta'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.fieldSetMeta,
		Outputs.fieldSetMeta,
		'fibery.schema/batch',
		(parsed) => ({
			commands: [
				{
					command: 'schema.field/set-meta',
					args: {
						name: parsed.name,
						'holder-type': parsed.holderType,
						key: parsed.key,
						value: parsed.value,
					},
				},
			],
		}),
	);

export const installMixins: FiberyEndpoints['installMixins'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.installMixins,
		Outputs.installMixins,
		'fibery.app/install-mixins',
		(parsed) => ({
			types: parsed.types,
		}),
	);

export const entityQuery: FiberyEndpoints['entityQuery'] = async (
	ctx,
	input,
) => {
	const parsedInput = Inputs.entityQuery.parse(input);
	const response = await makeFiberyCommand(
		'fibery.entity/query',
		{
			query: parsedInput.query,
			...(parsedInput.params ? { params: parsedInput.params } : {}),
		},
		ctx.key,
		clientOptions(ctx),
	);
	const parsed = Outputs.entityQuery.parse(response);
	await logEventFromContext(
		ctx,
		'fibery.entity.query',
		{ count: Array.isArray(parsed) ? parsed.length : 1 },
		'completed',
	);
	return parsed;
};

export const entityCreate: FiberyEndpoints['entityCreate'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.entityCreate,
		Outputs.entityCreate,
		'fibery.entity/create',
		(parsed) => parsed,
	);

export const entityUpdate: FiberyEndpoints['entityUpdate'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.entityUpdate,
		Outputs.entityUpdate,
		'fibery.entity/update',
		(parsed) => parsed,
	);

export const entityDelete: FiberyEndpoints['entityDelete'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.entityDelete,
		Outputs.entityDelete,
		'fibery.entity/delete',
		(parsed) => ({
			type: parsed.type,
			entity: { 'fibery/id': parsed.id },
		}),
	);

export const entityUpsert: FiberyEndpoints['entityUpsert'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.entityUpsert,
		Outputs.entityUpsert,
		'fibery.entity.batch/create-or-update',
		(parsed) => ({
			type: parsed.type,
			entities: parsed.entities,
			'conflict-field': parsed.conflictField,
			'conflict-action': parsed.conflictAction,
		}),
	);

function collectionArgs(parsed: {
	type: string;
	field: string;
	entityId: string;
	itemIds: string[];
}) {
	return {
		type: parsed.type,
		field: parsed.field,
		entity: { [parsed.entityId]: parsed.itemIds },
	};
}

export const collectionAdd: FiberyEndpoints['collectionAdd'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.collectionAdd,
		Outputs.collectionAdd,
		'fibery.entity/add-collection-items',
		collectionArgs,
	);

export const collectionRemove: FiberyEndpoints['collectionRemove'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.collectionRemove,
		Outputs.collectionRemove,
		'fibery.entity/remove-collection-items',
		collectionArgs,
	);

export const collectionSet: FiberyEndpoints['collectionSet'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.collectionSet,
		Outputs.collectionSet,
		'fibery.entity/set-collection-items',
		collectionArgs,
	);

export const collectionReset: FiberyEndpoints['collectionReset'] = async (
	ctx,
	input,
) =>
	command(
		ctx,
		input,
		Inputs.collectionReset,
		Outputs.collectionReset,
		'fibery.entity/reset-collection-items',
		(parsed) => ({
			type: parsed.type,
			field: parsed.field,
			entity: parsed.entityId,
		}),
	);

export const documentGet: FiberyEndpoints['documentGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = Inputs.documentGet.parse(input);
	const response = await makeFiberyRequest(
		`/api/documents/${parsedInput.secret}`,
		ctx.key,
		{
			...clientOptions(ctx),
			method: 'GET',
			query: { format: parsedInput.format ?? 'md' },
		},
	);
	const parsed = Outputs.documentGet.parse(response);
	await logEventFromContext(ctx, 'fibery.document.get', {}, 'completed');
	return parsed;
};

export const documentGetBatch: FiberyEndpoints['documentGetBatch'] = async (
	ctx,
	input,
) => {
	const parsedInput = Inputs.documentGetBatch.parse(input);
	const response = await makeFiberyRequest('/api/documents/commands', ctx.key, {
		...clientOptions(ctx),
		method: 'POST',
		body: {
			command: 'get-documents',
			args: parsedInput.secrets.map((secret) => ({ secret })),
		},
	});
	const parsed = Outputs.documentGetBatch.parse(response);
	await logEventFromContext(
		ctx,
		'fibery.document.get_batch',
		{ count: parsed.length },
		'completed',
	);
	return parsed;
};

export const documentUpdate: FiberyEndpoints['documentUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = Inputs.documentUpdate.parse(input);
	const response = await makeFiberyRequest(
		`/api/documents/${parsedInput.secret}`,
		ctx.key,
		{
			...clientOptions(ctx),
			method: 'PUT',
			query: { format: parsedInput.format ?? 'md' },
			body: { content: parsedInput.content },
		},
	);
	const parsed = Outputs.documentUpdate.parse(response);
	await logEventFromContext(ctx, 'fibery.document.update', {}, 'completed');
	return parsed;
};

export const documentUpdateBatch: FiberyEndpoints['documentUpdateBatch'] =
	async (ctx, input) => {
		const parsedInput = Inputs.documentUpdateBatch.parse(input);
		const response = await makeFiberyRequest(
			'/api/documents/commands',
			ctx.key,
			{
				...clientOptions(ctx),
				method: 'POST',
				query: { format: parsedInput.format ?? 'md' },
				body: {
					command: 'create-or-update-documents',
					args: parsedInput.documents,
				},
			},
		);
		const parsed = Outputs.documentUpdateBatch.parse(response);
		await logEventFromContext(
			ctx,
			'fibery.document.update_batch',
			{ count: parsedInput.documents.length },
			'completed',
		);
		return parsed;
	};

export const fileUpload: FiberyEndpoints['fileUpload'] = async (ctx, input) => {
	const parsedInput = Inputs.fileUpload.parse(input);
	const bytes = Uint8Array.from(atob(parsedInput.base64), (char) =>
		char.charCodeAt(0),
	);
	const form = new FormData();
	form.append(
		'file',
		new Blob([bytes], { type: parsedInput.contentType }),
		parsedInput.name,
	);
	const payload = await makeFiberyFileUpload(form, ctx.key, clientOptions(ctx));
	const parsed = Outputs.fileUpload.parse(payload);
	await logEventFromContext(
		ctx,
		'fibery.file.upload',
		{ bytes: parsed['fibery/content-length'] },
		'completed',
	);
	return parsed;
};

export const fileDownload: FiberyEndpoints['fileDownload'] = async (
	ctx,
	input,
) => {
	const parsedInput = Inputs.fileDownload.parse(input);
	const response = await makeFiberyBinaryRequest(
		`/api/files/${parsedInput.secret}`,
		ctx.key,
		{
			...clientOptions(ctx),
			method: 'GET',
		},
	);
	const parsed = Outputs.fileDownload.parse({ kind: 'binary', ...response });
	await logEventFromContext(ctx, 'fibery.file.download', {}, 'completed');
	return parsed;
};

export const fileSignUrls: FiberyEndpoints['fileSignUrls'] = async (
	ctx,
	input,
) => {
	const parsedInput = Inputs.fileSignUrls.parse(input);
	const response = await makeFiberyRequest('/api/files/sign-urls', ctx.key, {
		...clientOptions(ctx),
		method: 'POST',
		body: { secrets: parsedInput.secrets },
	});
	const parsed = Outputs.fileSignUrls.parse(response);
	await logEventFromContext(
		ctx,
		'fibery.file.sign_urls',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const viewsQuery: FiberyEndpoints['viewsQuery'] = async (ctx, input) => {
	const parsedInput = Inputs.viewsQuery.parse(input);
	const response = await makeFiberyJsonRpc(
		'query-views',
		{ filter: parsedInput },
		ctx.key,
		clientOptions(ctx),
	);
	const parsed = Outputs.viewsQuery.parse(response);
	await logEventFromContext(
		ctx,
		'fibery.views.query',
		{ count: parsed.length },
		'completed',
	);
	return parsed;
};

export const viewsCreate: FiberyEndpoints['viewsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = Inputs.viewsCreate.parse(input);
	const response = await makeFiberyJsonRpc(
		'create-views',
		{ views: parsedInput.views },
		ctx.key,
		clientOptions(ctx),
	);
	const parsed = Outputs.viewsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'fibery.views.create',
		{ count: parsedInput.views.length },
		'completed',
	);
	return parsed;
};

export const viewsUpdate: FiberyEndpoints['viewsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = Inputs.viewsUpdate.parse(input);
	const response = await makeFiberyJsonRpc(
		'update-views',
		{ updates: parsedInput.updates },
		ctx.key,
		clientOptions(ctx),
	);
	const parsed = Outputs.viewsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'fibery.views.update',
		{ count: parsedInput.updates.length },
		'completed',
	);
	return parsed;
};

export const viewsDelete: FiberyEndpoints['viewsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput = Inputs.viewsDelete.parse(input);
	const response = await makeFiberyJsonRpc(
		'delete-views',
		{ ids: parsedInput.ids },
		ctx.key,
		clientOptions(ctx),
	);
	const parsed = Outputs.viewsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'fibery.views.delete',
		{ count: parsedInput.ids.length },
		'completed',
	);
	return parsed;
};

export const historySearch: FiberyEndpoints['historySearch'] = async (
	ctx,
	input,
) => {
	const parsedInput = Inputs.historySearch.parse(input);
	const response = await makeFiberyRequest('/api/history/v2/search', ctx.key, {
		...clientOptions(ctx),
		method: 'POST',
		body: parsedInput,
	});
	const parsed = Outputs.historySearch.parse(response);
	await logEventFromContext(
		ctx,
		'fibery.history.search',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};
