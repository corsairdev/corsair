import { logEventFromContext } from 'corsair/core';
import { makeParseurRequest } from '../client';
import type { ParseurEndpoints } from '../index';
import {
	CreateExportConfigInputSchema,
	CreateExportConfigOutputSchema,
	DeleteExportConfigInputSchema,
	DeleteExportConfigOutputSchema,
	ListExportConfigsInputSchema,
	ListExportConfigsOutputSchema,
	UpdateExportConfigInputSchema,
	UpdateExportConfigOutputSchema,
} from './types';

export const listExportConfigs: ParseurEndpoints['listExportConfigs'] = async (
	ctx,
	input,
) => {
	const parsed = ListExportConfigsInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>(
		`/parser/${parsed.id}/export_config`,
		{
			apiKey: ctx.key,
			method: 'GET',
			query: {
				page: parsed.page,
				page_size: parsed.page_size,
			},
		},
	);

	const output = ListExportConfigsOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.exportConfigs.listExportConfigs',
		{ mailboxId: parsed.id },
		'completed',
	);

	return output;
};

export const createExportConfig: ParseurEndpoints['createExportConfig'] =
	async (ctx, input) => {
		const parsed = CreateExportConfigInputSchema.parse(input);
		const { id, ...body } = parsed;
		const response = await makeParseurRequest<unknown>(
			`/parser/${id}/export_config`,
			{
				apiKey: ctx.key,
				method: 'POST',
				body: {
					name: body.name,
					type: body.type ?? 'PARSER',
					items: body.items,
					parser_field_id: body.parser_field_id,
				},
			},
		);

		const output = CreateExportConfigOutputSchema.parse(response);

		await logEventFromContext(
			ctx,
			'parseur.exportConfigs.createExportConfig',
			{ mailboxId: id, name: parsed.name },
			'completed',
		);

		return output;
	};

export const updateExportConfig: ParseurEndpoints['updateExportConfig'] =
	async (ctx, input) => {
		const parsed = UpdateExportConfigInputSchema.parse(input);
		const { mailbox_id, id, ...body } = parsed;
		const response = await makeParseurRequest<unknown>(
			`/parser/${mailbox_id}/export_config/${id}`,
			{
				apiKey: ctx.key,
				method: 'PATCH',
				body,
			},
		);

		const output = UpdateExportConfigOutputSchema.parse(response);

		await logEventFromContext(
			ctx,
			'parseur.exportConfigs.updateExportConfig',
			{ mailboxId: mailbox_id, id },
			'completed',
		);

		return output;
	};

export const deleteExportConfig: ParseurEndpoints['deleteExportConfig'] =
	async (ctx, input) => {
		const parsed = DeleteExportConfigInputSchema.parse(input);
		await makeParseurRequest<unknown>(
			`/parser/${parsed.mailbox_id}/export_config/${parsed.id}`,
			{
				apiKey: ctx.key,
				method: 'DELETE',
			},
		);

		await logEventFromContext(
			ctx,
			'parseur.exportConfigs.deleteExportConfig',
			{ mailboxId: parsed.mailbox_id, id: parsed.id },
			'completed',
		);

		return DeleteExportConfigOutputSchema.parse({ success: true });
	};
