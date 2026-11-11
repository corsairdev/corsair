import type { HappyScribeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	HappyScribeEndpointInputSchemas as Inputs,
	HappyScribeEndpointOutputSchemas as Outputs,
} from './types';

export const create: HappyScribeEndpoints['ordersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.create',
			input: Inputs.ordersCreate,
			output: Outputs.ordersCreate,
		},
		input,
		({
			url,
			language,
			service,
			confirm,
			organizationId,
			folderId,
			folder,
			name,
			tags,
			boost,
			isSubtitle,
			webhookUrl,
			glossaryIds,
			styleGuideId,
		}) => ({
			method: 'POST',
			path: '/orders',
			body: {
				order: {
					url,
					language,
					service,
					confirm,
					organization_id: organizationId,
					...(folderId !== undefined ? { folder_id: folderId } : {}),
					...(folder !== undefined ? { folder } : {}),
					...(name !== undefined ? { name } : {}),
					...(tags !== undefined ? { tags } : {}),
					...(boost !== undefined ? { boost } : {}),
					...(isSubtitle !== undefined ? { is_subtitle: isSubtitle } : {}),
					...(webhookUrl !== undefined ? { webhook_url: webhookUrl } : {}),
					...(glossaryIds !== undefined ? { glossary_ids: glossaryIds } : {}),
					...(styleGuideId !== undefined
						? { style_guide_id: styleGuideId }
						: {}),
				},
			},
		}),
		{
			log: (parsed, result) => ({
				orderId: result.id,
				state: result.state ?? undefined,
				confirmed: parsed.confirm ?? false,
			}),
		},
	);

export const createTranslation: HappyScribeEndpoints['ordersCreateTranslation'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'orders.createTranslation',
				input: Inputs.ordersCreateTranslation,
				output: Outputs.ordersCreateTranslation,
			},
			input,
			({
				sourceTranscriptionId,
				targetLanguages,
				service,
				confirm,
				organizationId,
				glossaryIds,
			}) => ({
				method: 'POST',
				path: '/orders/translation',
				body: {
					order: {
						source_transcription_id: sourceTranscriptionId,
						target_languages: targetLanguages,
						...(service !== undefined ? { service } : {}),
						confirm,
						organization_id: organizationId,
						...(glossaryIds !== undefined ? { glossary_ids: glossaryIds } : {}),
					},
				},
			}),
			{
				log: (_parsed, result) => ({
					orderId: result.id,
					state: result.state ?? undefined,
				}),
			},
		);

export const get: HappyScribeEndpoints['ordersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.get',
			input: Inputs.ordersGet,
			output: Outputs.ordersGet,
		},
		input,
		({ orderId }) => ({
			method: 'GET',
			path: `/orders/${segment(orderId)}`,
			replaySafe: true,
		}),
	);

export const confirm: HappyScribeEndpoints['ordersConfirm'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.confirm',
			input: Inputs.ordersConfirm,
			output: Outputs.ordersConfirm,
		},
		input,
		({ orderId }) => ({
			method: 'POST',
			path: `/orders/${segment(orderId)}/confirm`,
		}),
		{
			log: (parsed, result) => ({
				orderId: parsed.orderId,
				state: result.state ?? undefined,
			}),
		},
	);
