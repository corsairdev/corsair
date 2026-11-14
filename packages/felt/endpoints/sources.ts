import { logEventFromContext } from 'corsair/core';
import { makeFeltRequest } from '../client';
import type { FeltEndpoints } from '../index';
import type { Source, SourceCredential, SourceReference } from './types';
import { FeltEndpointInputSchemas, FeltEndpointOutputSchemas } from './types';

export const Sources = {
	list: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.sourcesList.parse(rawInput);
		const response = await makeFeltRequest<SourceReference[]>(
			'/sources',
			ctx.key,
			{
				method: 'GET',
				query: input.workspace_id
					? { workspace_id: input.workspace_id }
					: undefined,
			},
		);
		const parsed = FeltEndpointOutputSchemas.sourcesList.parse(response);
		await logEventFromContext(
			ctx,
			'felt.sources.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['sourcesList'],

	create: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.sourcesCreate.parse(rawInput);
		const response = await makeFeltRequest<SourceReference>(
			'/sources',
			ctx.key,
			{
				method: 'POST',
				body: input,
			},
		);
		const parsed = FeltEndpointOutputSchemas.sourcesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'felt.sources.create',
			{ id: parsed.id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['sourcesCreate'],

	get: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.sourcesGet.parse(rawInput);
		const response = await makeFeltRequest<Source>(
			`/sources/${encodeURIComponent(input.source_id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = FeltEndpointOutputSchemas.sourcesGet.parse(response);
		await logEventFromContext(
			ctx,
			'felt.sources.get',
			{ id: input.source_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['sourcesGet'],

	update: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.sourcesUpdate.parse(rawInput);
		const { source_id, ...body } = input;
		const response = await makeFeltRequest<SourceReference>(
			`/sources/${encodeURIComponent(source_id)}/update`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed = FeltEndpointOutputSchemas.sourcesUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'felt.sources.update',
			{ id: source_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['sourcesUpdate'],

	delete: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.sourcesDelete.parse(rawInput);
		await makeFeltRequest<void>(
			`/sources/${encodeURIComponent(input.source_id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = FeltEndpointOutputSchemas.sourcesDelete.parse({
			success: true,
			id: input.source_id,
		});
		await logEventFromContext(
			ctx,
			'felt.sources.delete',
			{ id: input.source_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['sourcesDelete'],

	sync: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.sourcesSync.parse(rawInput);
		const response = await makeFeltRequest<SourceReference>(
			`/sources/${encodeURIComponent(input.source_id)}/sync`,
			ctx.key,
			{
				method: 'POST',
			},
		);
		const parsed = FeltEndpointOutputSchemas.sourcesSync.parse(response);
		await logEventFromContext(
			ctx,
			'felt.sources.sync',
			{ id: input.source_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['sourcesSync'],

	createCredential: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.sourcesCreateCredential.parse(rawInput);
		const { source_id, ...body } = input;
		const response = await makeFeltRequest<SourceCredential>(
			`/sources/${encodeURIComponent(source_id)}/credentials`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.sourcesCreateCredential.parse(response);
		await logEventFromContext(
			ctx,
			'felt.sources.createCredential',
			{ source_id, credential_id: parsed.id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['sourcesCreateCredential'],

	updateCredential: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.sourcesUpdateCredential.parse(rawInput);
		const { source_id, credential_id, ...body } = input;
		const response = await makeFeltRequest<SourceCredential>(
			`/sources/${encodeURIComponent(source_id)}/credentials/${encodeURIComponent(credential_id)}/update`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.sourcesUpdateCredential.parse(response);
		await logEventFromContext(
			ctx,
			'felt.sources.updateCredential',
			{ source_id, credential_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['sourcesUpdateCredential'],

	deleteCredential: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.sourcesDeleteCredential.parse(rawInput);
		await makeFeltRequest<void>(
			`/sources/${encodeURIComponent(input.source_id)}/credentials/${encodeURIComponent(input.credential_id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = FeltEndpointOutputSchemas.sourcesDeleteCredential.parse({
			success: true,
			id: input.credential_id,
		});
		await logEventFromContext(
			ctx,
			'felt.sources.deleteCredential',
			{ source_id: input.source_id, credential_id: input.credential_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['sourcesDeleteCredential'],
};
