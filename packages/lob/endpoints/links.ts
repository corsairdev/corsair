import type { LobEndpoints } from '..';
import { segment } from '../client';
import { defineOp } from './call';
import { listQuery, omit } from './shared';

// Lob's URL shortener (custom domains and short links for printed pieces)
// and QR code scan analytics.

export const domainsCreate: LobEndpoints['domainsCreate'] = defineOp(
	'domainsCreate',
	'domains.create',
	(parsed) => ({ method: 'POST', path: '/domains', body: parsed }),
);

export const domainsGet: LobEndpoints['domainsGet'] = defineOp(
	'domainsGet',
	'domains.get',
	({ id }) => ({ method: 'GET', path: `/domains/${segment(id)}` }),
);

export const domainsList: LobEndpoints['domainsList'] = defineOp(
	'domainsList',
	'domains.list',
	(parsed) => ({ method: 'GET', path: '/domains', query: listQuery(parsed) }),
);

export const domainsDelete: LobEndpoints['domainsDelete'] = defineOp(
	'domainsDelete',
	'domains.delete',
	({ id }) => ({ method: 'DELETE', path: `/domains/${segment(id)}` }),
);

// ── links ─────────────────────────────────────────────────────────────────

export const linksCreate: LobEndpoints['linksCreate'] = defineOp(
	'linksCreate',
	'links.create',
	(parsed) => ({ method: 'POST', path: '/links', body: parsed }),
);

export const linksGet: LobEndpoints['linksGet'] = defineOp(
	'linksGet',
	'links.get',
	({ id }) => ({
		method: 'GET',
		path: `/links/${segment(id)}`,
	}),
);

export const linksList: LobEndpoints['linksList'] = defineOp(
	'linksList',
	'links.list',
	(parsed) => ({
		method: 'GET',
		path: '/links',
		query: listQuery(parsed),
	}),
);

export const linksUpdate: LobEndpoints['linksUpdate'] = defineOp(
	'linksUpdate',
	'links.update',
	(parsed) => ({
		method: 'PATCH',
		path: `/links/${segment(parsed.id)}`,
		body: omit(parsed, 'id'),
	}),
);

export const linksDelete: LobEndpoints['linksDelete'] = defineOp(
	'linksDelete',
	'links.delete',
	({ id }) => ({ method: 'DELETE', path: `/links/${segment(id)}` }),
);

// ── QR code analytics ─────────────────────────────────────────────────────

export const qrCodesList: LobEndpoints['qrCodesList'] = defineOp(
	'qrCodesList',
	'qrCodes.list',
	(parsed) => ({
		method: 'GET',
		path: '/qr_code_analytics',
		query: listQuery(parsed),
	}),
);
