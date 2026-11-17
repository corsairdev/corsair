import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** POST /v2/cards (CreateCard). */
export const create: SquareEndpoints['cardsCreate'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.cardsCreate.parse(rawInput);
	return callSquare(ctx, '/v2/cards', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.cardsCreate,
		event: 'cards.create',
	});
};

/** GET /v2/cards (ListCards). */
export const list: SquareEndpoints['cardsList'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.cardsList.parse(rawInput ?? {});
	return callSquare(ctx, '/v2/cards', {
		query: input,
		output: SquareEndpointOutputSchemas.cardsList,
		event: 'cards.list',
	});
};

/** GET /v2/cards/{card_id} (RetrieveCard). */
export const get: SquareEndpoints['cardsGet'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.cardsGet.parse(rawInput);
	return callSquare(ctx, '/v2/cards/{card_id}', {
		path: { card_id: input.card_id },
		output: SquareEndpointOutputSchemas.cardsGet,
		event: 'cards.get',
		logged: { card_id: input.card_id },
	});
};

/** POST /v2/cards/{card_id}/disable (DisableCard). */
export const disable: SquareEndpoints['cardsDisable'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.cardsDisable.parse(rawInput);
	return callSquare(ctx, '/v2/cards/{card_id}/disable', {
		method: 'POST',
		path: { card_id: input.card_id },
		output: SquareEndpointOutputSchemas.cardsDisable,
		event: 'cards.disable',
		logged: { card_id: input.card_id },
	});
};
