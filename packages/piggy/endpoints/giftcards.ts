import type { PiggyEndpoints } from '..';
import { call } from './call';
import {
	PiggyEndpointInputSchemas as Inputs,
	PiggyEndpointOutputSchemas as Outputs,
} from './types';

const CLIENT = '/api/v3/oauth/clients';

export const list: PiggyEndpoints['giftcardsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'giftcards.list',
			input: Inputs.giftcardsList,
			output: Outputs.giftcardsList,
		},
		input,
		({ giftcardProgramUuid, page, limit }) => ({
			method: 'GET',
			path: `${CLIENT}/giftcards`,
			query: {
				giftcard_program_uuid: giftcardProgramUuid,
				page,
				limit,
			},
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const get: PiggyEndpoints['giftcardsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'giftcards.get',
			input: Inputs.giftcardsGet,
			output: Outputs.giftcardsGet,
		},
		input,
		({ giftcardUuid }) => ({
			method: 'GET',
			path: `${CLIENT}/giftcards/${encodeURIComponent(giftcardUuid)}`,
		}),
		{ log: (_, card) => ({ giftcardUuid: card.data.uuid ?? undefined }) },
	);

export const findOneByHash: PiggyEndpoints['giftcardsFindOneByHash'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'giftcards.findOneByHash',
			input: Inputs.giftcardsFindOneByHash,
			output: Outputs.giftcardsFindOneByHash,
		},
		input,
		({ hash }) => ({
			method: 'GET',
			path: `${CLIENT}/giftcards/find-one-by`,
			query: { hash },
		}),
		{ log: (_, card) => ({ giftcardUuid: card.data.uuid ?? undefined }) },
	);

export const create: PiggyEndpoints['giftcardsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'giftcards.create',
			input: Inputs.giftcardsCreate,
			output: Outputs.giftcardsCreate,
		},
		input,
		({ giftcardProgramUuid }) => ({
			method: 'POST',
			path: `${CLIENT}/giftcards`,
			// The public API only creates digital giftcards: type 1 (0 is
			// physical and refused with error 55021).
			body: { type: 1, giftcard_program_uuid: giftcardProgramUuid },
		}),
		{ log: (_, card) => ({ giftcardUuid: card.data.uuid ?? undefined }) },
	);

export const sendByEmail: PiggyEndpoints['giftcardsSendByEmail'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'giftcards.sendByEmail',
			input: Inputs.giftcardsSendByEmail,
			output: Outputs.giftcardsSendByEmail,
		},
		input,
		({ giftcardUuid, contactUuid, emailUuid, mergeTags }) => ({
			method: 'POST',
			path: `${CLIENT}/giftcards/${encodeURIComponent(giftcardUuid)}/send-by-email`,
			body: {
				contact_uuid: contactUuid,
				email_uuid: emailUuid,
				merge_tags: mergeTags,
			},
		}),
		{
			log: ({ giftcardUuid }, sent) => ({
				giftcardUuid,
				result: sent.data.data ?? undefined,
			}),
		},
	);

export const listPrograms: PiggyEndpoints['giftcardsListPrograms'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'giftcards.listPrograms',
			input: Inputs.giftcardsListPrograms,
			output: Outputs.giftcardsListPrograms,
		},
		input,
		() => ({ method: 'GET', path: `${CLIENT}/giftcard-programs` }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);
