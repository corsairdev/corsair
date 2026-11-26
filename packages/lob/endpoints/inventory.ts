import type { LobEndpoints } from '..';
import { segment } from '../client';
import { defineOp } from './call';
import { listQuery, omit } from './shared';

// Buckslips and cards: inserts Lob prints ahead of time and keeps in stock
// for letters. Creating one stores the artwork; an order prints (and bills)
// a batch of thousands.

export const buckslipsCreate: LobEndpoints['buckslipsCreate'] = defineOp(
	'buckslipsCreate',
	'buckslips.create',
	(parsed) => ({ method: 'POST', path: '/buckslips', body: parsed }),
);

export const buckslipsGet: LobEndpoints['buckslipsGet'] = defineOp(
	'buckslipsGet',
	'buckslips.get',
	({ id }) => ({ method: 'GET', path: `/buckslips/${segment(id)}` }),
);

export const buckslipsList: LobEndpoints['buckslipsList'] = defineOp(
	'buckslipsList',
	'buckslips.list',
	(parsed) => ({ method: 'GET', path: '/buckslips', query: listQuery(parsed) }),
);

export const buckslipsUpdate: LobEndpoints['buckslipsUpdate'] = defineOp(
	'buckslipsUpdate',
	'buckslips.update',
	(parsed) => ({
		method: 'PATCH',
		path: `/buckslips/${segment(parsed.id)}`,
		body: omit(parsed, 'id'),
	}),
);

export const buckslipsDelete: LobEndpoints['buckslipsDelete'] = defineOp(
	'buckslipsDelete',
	'buckslips.delete',
	({ id }) => ({ method: 'DELETE', path: `/buckslips/${segment(id)}` }),
);

export const buckslipsListOrders: LobEndpoints['buckslipsListOrders'] =
	defineOp(
		'buckslipsListOrders',
		'buckslips.listOrders',
		({ id, ...query }) => ({
			method: 'GET',
			path: `/buckslips/${segment(id)}/orders`,
			query: listQuery(query),
		}),
	);

export const buckslipsCreateOrder: LobEndpoints['buckslipsCreateOrder'] =
	defineOp(
		'buckslipsCreateOrder',
		'buckslips.createOrder',
		({ id, quantity }) => ({
			method: 'POST',
			path: `/buckslips/${segment(id)}/orders`,
			body: { quantity },
		}),
	);

// ── cards ─────────────────────────────────────────────────────────────────

export const cardsCreate: LobEndpoints['cardsCreate'] = defineOp(
	'cardsCreate',
	'cards.create',
	(parsed) => ({ method: 'POST', path: '/cards', body: parsed }),
);

export const cardsGet: LobEndpoints['cardsGet'] = defineOp(
	'cardsGet',
	'cards.get',
	({ id }) => ({
		method: 'GET',
		path: `/cards/${segment(id)}`,
	}),
);

export const cardsList: LobEndpoints['cardsList'] = defineOp(
	'cardsList',
	'cards.list',
	(parsed) => ({
		method: 'GET',
		path: '/cards',
		query: listQuery(parsed),
	}),
);

// Lob updates cards with POST, not PATCH.
export const cardsUpdate: LobEndpoints['cardsUpdate'] = defineOp(
	'cardsUpdate',
	'cards.update',
	(parsed) => ({
		method: 'POST',
		path: `/cards/${segment(parsed.id)}`,
		body: omit(parsed, 'id'),
	}),
);

export const cardsDelete: LobEndpoints['cardsDelete'] = defineOp(
	'cardsDelete',
	'cards.delete',
	({ id }) => ({ method: 'DELETE', path: `/cards/${segment(id)}` }),
);

export const cardsListOrders: LobEndpoints['cardsListOrders'] = defineOp(
	'cardsListOrders',
	'cards.listOrders',
	({ id, ...query }) => ({
		method: 'GET',
		path: `/cards/${segment(id)}/orders`,
		query: listQuery(query),
	}),
);

export const cardsCreateOrder: LobEndpoints['cardsCreateOrder'] = defineOp(
	'cardsCreateOrder',
	'cards.createOrder',
	({ id, quantity }) => ({
		method: 'POST',
		path: `/cards/${segment(id)}/orders`,
		body: { quantity },
	}),
);
