import type { LobEndpoints } from '..';
import { segment } from '../client';
import { defineOp } from './call';
import { listQuery, omit } from './shared';

// Saved HTML templates (tmpl_) and their versions (vrsn_). A mailpiece can
// name a tmpl_ ID as its artwork; Lob renders the published version.

export const templatesCreate: LobEndpoints['templatesCreate'] = defineOp(
	'templatesCreate',
	'templates.create',
	(parsed) => ({ method: 'POST', path: '/templates', body: parsed }),
);

export const templatesGet: LobEndpoints['templatesGet'] = defineOp(
	'templatesGet',
	'templates.get',
	({ id }) => ({ method: 'GET', path: `/templates/${segment(id)}` }),
);

export const templatesList: LobEndpoints['templatesList'] = defineOp(
	'templatesList',
	'templates.list',
	(parsed) => ({ method: 'GET', path: '/templates', query: listQuery(parsed) }),
);

// Lob updates templates with POST, not PATCH.
export const templatesUpdate: LobEndpoints['templatesUpdate'] = defineOp(
	'templatesUpdate',
	'templates.update',
	(parsed) => ({
		method: 'POST',
		path: `/templates/${segment(parsed.id)}`,
		body: omit(parsed, 'id'),
	}),
);

export const templatesDelete: LobEndpoints['templatesDelete'] = defineOp(
	'templatesDelete',
	'templates.delete',
	({ id }) => ({ method: 'DELETE', path: `/templates/${segment(id)}` }),
);

// ── template versions ─────────────────────────────────────────────────────

export const templateVersionsCreate: LobEndpoints['templateVersionsCreate'] =
	defineOp('templateVersionsCreate', 'templateVersions.create', (parsed) => ({
		method: 'POST',
		path: `/templates/${segment(parsed.template_id)}/versions`,
		body: omit(parsed, 'template_id'),
	}));

export const templateVersionsGet: LobEndpoints['templateVersionsGet'] =
	defineOp(
		'templateVersionsGet',
		'templateVersions.get',
		({ template_id, id }) => ({
			method: 'GET',
			path: `/templates/${segment(template_id)}/versions/${segment(id)}`,
		}),
	);

export const templateVersionsList: LobEndpoints['templateVersionsList'] =
	defineOp(
		'templateVersionsList',
		'templateVersions.list',
		({ template_id, ...query }) => ({
			method: 'GET',
			path: `/templates/${segment(template_id)}/versions`,
			query: listQuery(query),
		}),
	);

// Lob updates template versions with POST, not PATCH.
export const templateVersionsUpdate: LobEndpoints['templateVersionsUpdate'] =
	defineOp('templateVersionsUpdate', 'templateVersions.update', (parsed) => ({
		method: 'POST',
		path: `/templates/${segment(parsed.template_id)}/versions/${segment(parsed.id)}`,
		body: omit(parsed, 'template_id', 'id'),
	}));

export const templateVersionsDelete: LobEndpoints['templateVersionsDelete'] =
	defineOp(
		'templateVersionsDelete',
		'templateVersions.delete',
		({ template_id, id }) => ({
			method: 'DELETE',
			path: `/templates/${segment(template_id)}/versions/${segment(id)}`,
		}),
	);
