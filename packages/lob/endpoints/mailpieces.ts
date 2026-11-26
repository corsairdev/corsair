import type { LobEndpoints } from '..';
import { segment } from '../client';
import { defineOp, idempotencyHeaders } from './call';
import { listQuery, omit } from './shared';

// Postcards and letters (list, cancel) plus checks, self mailers, snap packs
// and booklets. Sends print and mail real pieces with a live key and are
// billed; a cancel works only before the piece goes to production. The
// idempotency key rides in the Idempotency-Key header, never the body.

export const postcardsList: LobEndpoints['postcardsList'] = defineOp(
	'postcardsList',
	'postcards.list',
	(parsed) => ({ method: 'GET', path: '/postcards', query: listQuery(parsed) }),
);

export const postcardsCancel: LobEndpoints['postcardsCancel'] = defineOp(
	'postcardsCancel',
	'postcards.cancel',
	({ id }) => ({ method: 'DELETE', path: `/postcards/${segment(id)}` }),
);

export const lettersList: LobEndpoints['lettersList'] = defineOp(
	'lettersList',
	'letters.list',
	(parsed) => ({
		method: 'GET',
		path: '/letters',
		query: listQuery(parsed),
	}),
);

export const lettersCancel: LobEndpoints['lettersCancel'] = defineOp(
	'lettersCancel',
	'letters.cancel',
	({ id }) => ({ method: 'DELETE', path: `/letters/${segment(id)}` }),
);

// ── checks ────────────────────────────────────────────────────────────────

export const checksSend: LobEndpoints['checksSend'] = defineOp(
	'checksSend',
	'checks.send',
	(parsed) => ({
		method: 'POST',
		path: '/checks',
		body: omit(parsed, 'idempotency_key'),
		headers: idempotencyHeaders(parsed.idempotency_key),
	}),
);

export const checksGet: LobEndpoints['checksGet'] = defineOp(
	'checksGet',
	'checks.get',
	({ id }) => ({
		method: 'GET',
		path: `/checks/${segment(id)}`,
	}),
);

export const checksList: LobEndpoints['checksList'] = defineOp(
	'checksList',
	'checks.list',
	(parsed) => ({
		method: 'GET',
		path: '/checks',
		query: listQuery(parsed),
	}),
);

export const checksCancel: LobEndpoints['checksCancel'] = defineOp(
	'checksCancel',
	'checks.cancel',
	({ id }) => ({ method: 'DELETE', path: `/checks/${segment(id)}` }),
);

// ── self mailers ──────────────────────────────────────────────────────────

export const selfMailersSend: LobEndpoints['selfMailersSend'] = defineOp(
	'selfMailersSend',
	'selfMailers.send',
	(parsed) => ({
		method: 'POST',
		path: '/self_mailers',
		body: omit(parsed, 'idempotency_key'),
		headers: idempotencyHeaders(parsed.idempotency_key),
	}),
);

export const selfMailersGet: LobEndpoints['selfMailersGet'] = defineOp(
	'selfMailersGet',
	'selfMailers.get',
	({ id }) => ({ method: 'GET', path: `/self_mailers/${segment(id)}` }),
);

export const selfMailersList: LobEndpoints['selfMailersList'] = defineOp(
	'selfMailersList',
	'selfMailers.list',
	(parsed) => ({
		method: 'GET',
		path: '/self_mailers',
		query: listQuery(parsed),
	}),
);

export const selfMailersCancel: LobEndpoints['selfMailersCancel'] = defineOp(
	'selfMailersCancel',
	'selfMailers.cancel',
	({ id }) => ({ method: 'DELETE', path: `/self_mailers/${segment(id)}` }),
);

// ── snap packs ────────────────────────────────────────────────────────────

export const snapPacksSend: LobEndpoints['snapPacksSend'] = defineOp(
	'snapPacksSend',
	'snapPacks.send',
	(parsed) => ({
		method: 'POST',
		path: '/snap_packs',
		body: omit(parsed, 'idempotency_key'),
		headers: idempotencyHeaders(parsed.idempotency_key),
	}),
);

export const snapPacksGet: LobEndpoints['snapPacksGet'] = defineOp(
	'snapPacksGet',
	'snapPacks.get',
	({ id }) => ({ method: 'GET', path: `/snap_packs/${segment(id)}` }),
);

export const snapPacksList: LobEndpoints['snapPacksList'] = defineOp(
	'snapPacksList',
	'snapPacks.list',
	(parsed) => ({
		method: 'GET',
		path: '/snap_packs',
		query: listQuery(parsed),
	}),
);

export const snapPacksCancel: LobEndpoints['snapPacksCancel'] = defineOp(
	'snapPacksCancel',
	'snapPacks.cancel',
	({ id }) => ({ method: 'DELETE', path: `/snap_packs/${segment(id)}` }),
);

// ── booklets ──────────────────────────────────────────────────────────────

export const bookletsSend: LobEndpoints['bookletsSend'] = defineOp(
	'bookletsSend',
	'booklets.send',
	(parsed) => ({
		method: 'POST',
		path: '/booklets',
		body: omit(parsed, 'idempotency_key'),
		headers: idempotencyHeaders(parsed.idempotency_key),
	}),
);

export const bookletsGet: LobEndpoints['bookletsGet'] = defineOp(
	'bookletsGet',
	'booklets.get',
	({ id }) => ({ method: 'GET', path: `/booklets/${segment(id)}` }),
);

export const bookletsList: LobEndpoints['bookletsList'] = defineOp(
	'bookletsList',
	'booklets.list',
	(parsed) => ({ method: 'GET', path: '/booklets', query: listQuery(parsed) }),
);

export const bookletsCancel: LobEndpoints['bookletsCancel'] = defineOp(
	'bookletsCancel',
	'booklets.cancel',
	({ id }) => ({ method: 'DELETE', path: `/booklets/${segment(id)}` }),
);
