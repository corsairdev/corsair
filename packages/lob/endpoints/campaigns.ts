import { resolveFileInput } from 'corsair/http';
import type { LobEndpoints } from '..';
import { segment } from '../client';
import { defineOp } from './call';
import { listQuery, omit } from './shared';

// Campaigns (Lob's bulk-mail product): a campaign holds creatives (the
// artwork) and an upload (the audience CSV); sending it mails every row.
// Informed Delivery campaigns attach USPS email previews to a mailing.
// Resource proofs render a mailpiece for review without mailing it.

// Audience files and Informed Delivery images are capped well under Lob's
// limits so a stray URL cannot pull a huge download into memory.
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const campaignsCreate: LobEndpoints['campaignsCreate'] = defineOp(
	'campaignsCreate',
	'campaigns.create',
	(parsed) => ({ method: 'POST', path: '/campaigns', body: parsed }),
);

export const campaignsGet: LobEndpoints['campaignsGet'] = defineOp(
	'campaignsGet',
	'campaigns.get',
	({ id }) => ({ method: 'GET', path: `/campaigns/${segment(id)}` }),
);

export const campaignsList: LobEndpoints['campaignsList'] = defineOp(
	'campaignsList',
	'campaigns.list',
	(parsed) => ({ method: 'GET', path: '/campaigns', query: listQuery(parsed) }),
);

export const campaignsUpdate: LobEndpoints['campaignsUpdate'] = defineOp(
	'campaignsUpdate',
	'campaigns.update',
	(parsed) => ({
		method: 'PATCH',
		path: `/campaigns/${segment(parsed.id)}`,
		body: omit(parsed, 'id'),
	}),
);

export const campaignsDelete: LobEndpoints['campaignsDelete'] = defineOp(
	'campaignsDelete',
	'campaigns.delete',
	({ id }) => ({ method: 'DELETE', path: `/campaigns/${segment(id)}` }),
);

// Mails every piece in the campaign's audience.
export const campaignsSend: LobEndpoints['campaignsSend'] = defineOp(
	'campaignsSend',
	'campaigns.send',
	({ id }) => ({ method: 'POST', path: `/campaigns/${segment(id)}/send` }),
);

// ── creatives ─────────────────────────────────────────────────────────────

export const creativesCreate: LobEndpoints['creativesCreate'] = defineOp(
	'creativesCreate',
	'creatives.create',
	(parsed) => ({ method: 'POST', path: '/creatives', body: parsed }),
);

export const creativesGet: LobEndpoints['creativesGet'] = defineOp(
	'creativesGet',
	'creatives.get',
	({ id }) => ({ method: 'GET', path: `/creatives/${segment(id)}` }),
);

export const creativesUpdate: LobEndpoints['creativesUpdate'] = defineOp(
	'creativesUpdate',
	'creatives.update',
	(parsed) => ({
		method: 'PATCH',
		path: `/creatives/${segment(parsed.id)}`,
		body: omit(parsed, 'id'),
	}),
);

// ── Informed Delivery ─────────────────────────────────────────────────────

// Lob takes these two only as multipart/form-data with the images as file
// parts.
async function informedDeliveryForm(
	parsed: Record<string, unknown>,
): Promise<FormData> {
	const form = new FormData();
	for (const [key, value] of Object.entries(parsed)) {
		if (value === undefined || key === 'id') continue;
		if (key === 'ride_along_image' || key === 'representative_image') {
			const file = await resolveFileInput(
				value as Parameters<typeof resolveFileInput>[0],
				{ maxBytes: MAX_IMAGE_BYTES, fallbackName: `${key}.png` },
			);
			form.append(key, file.file, file.filename);
			continue;
		}
		form.append(key, String(value));
	}
	return form;
}

export const informedDeliveryList: LobEndpoints['informedDeliveryList'] =
	defineOp('informedDeliveryList', 'informedDelivery.list', () => ({
		method: 'GET',
		path: '/informed_delivery_campaigns',
	}));

export const informedDeliveryCreate: LobEndpoints['informedDeliveryCreate'] =
	defineOp(
		'informedDeliveryCreate',
		'informedDelivery.create',
		async (parsed) => ({
			method: 'POST',
			path: '/informed_delivery_campaigns',
			body: await informedDeliveryForm(parsed),
		}),
	);

export const informedDeliveryGet: LobEndpoints['informedDeliveryGet'] =
	defineOp('informedDeliveryGet', 'informedDelivery.get', ({ id }) => ({
		method: 'GET',
		path: `/informed_delivery_campaigns/${segment(id)}`,
	}));

export const informedDeliveryUpdate: LobEndpoints['informedDeliveryUpdate'] =
	defineOp(
		'informedDeliveryUpdate',
		'informedDelivery.update',
		async (parsed) => ({
			method: 'PATCH',
			path: `/informed_delivery_campaigns/${segment(parsed.id)}`,
			body: await informedDeliveryForm(parsed),
		}),
	);

// ── uploads (campaign audience files) ─────────────────────────────────────

export const uploadsCreate: LobEndpoints['uploadsCreate'] = defineOp(
	'uploadsCreate',
	'uploads.create',
	(parsed) => ({ method: 'POST', path: '/uploads', body: parsed }),
);

export const uploadsGet: LobEndpoints['uploadsGet'] = defineOp(
	'uploadsGet',
	'uploads.get',
	({ id }) => ({
		method: 'GET',
		path: `/uploads/${segment(id)}`,
	}),
);

// Lob answers a bare array here, not the list envelope.
export const uploadsList: LobEndpoints['uploadsList'] = defineOp(
	'uploadsList',
	'uploads.list',
	(parsed) => ({ method: 'GET', path: '/uploads', query: listQuery(parsed) }),
);

export const uploadsUpdate: LobEndpoints['uploadsUpdate'] = defineOp(
	'uploadsUpdate',
	'uploads.update',
	(parsed) => ({
		method: 'PATCH',
		path: `/uploads/${segment(parsed.id)}`,
		body: omit(parsed, 'id'),
	}),
);

// Lob answers 204 with no body, so the result is built from the request.
export const uploadsDelete: LobEndpoints['uploadsDelete'] = defineOp(
	'uploadsDelete',
	'uploads.delete',
	({ id }) => ({ method: 'DELETE', path: `/uploads/${segment(id)}` }),
	{
		shape: (raw, { id }) =>
			raw === undefined || raw === null || raw === ''
				? { id, deleted: true }
				: raw,
	},
);

// Sends the audience CSV as a multipart file part; Lob validates it
// asynchronously (read uploads.get or uploads.getReport for the outcome).
export const uploadsUploadFile: LobEndpoints['uploadsUploadFile'] = defineOp(
	'uploadsUploadFile',
	'uploads.uploadFile',
	async ({ id, file }) => {
		const resolved = await resolveFileInput(file, {
			maxBytes: MAX_UPLOAD_BYTES,
			fallbackName: 'audience.csv',
		});
		const form = new FormData();
		form.append('file', resolved.file, resolved.filename);
		return {
			method: 'POST',
			path: `/uploads/${segment(id)}/file`,
			body: form,
		};
	},
);

export const uploadsCreateExport: LobEndpoints['uploadsCreateExport'] =
	defineOp('uploadsCreateExport', 'uploads.createExport', ({ id, type }) => ({
		method: 'POST',
		path: `/uploads/${segment(id)}/exports`,
		body: { type },
	}));

export const uploadsGetExport: LobEndpoints['uploadsGetExport'] = defineOp(
	'uploadsGetExport',
	'uploads.getExport',
	({ id, export_id }) => ({
		method: 'GET',
		path: `/uploads/${segment(id)}/exports/${segment(export_id)}`,
	}),
);

export const uploadsGetReport: LobEndpoints['uploadsGetReport'] = defineOp(
	'uploadsGetReport',
	'uploads.getReport',
	({ id, ...query }) => ({
		method: 'GET',
		path: `/uploads/${segment(id)}/report`,
		query: listQuery(query),
	}),
);

// ── resource proofs ───────────────────────────────────────────────────────

export const resourceProofsCreate: LobEndpoints['resourceProofsCreate'] =
	defineOp('resourceProofsCreate', 'resourceProofs.create', (parsed) => ({
		method: 'POST',
		path: '/resource_proofs',
		body: parsed,
	}));

export const resourceProofsGet: LobEndpoints['resourceProofsGet'] = defineOp(
	'resourceProofsGet',
	'resourceProofs.get',
	({ id }) => ({ method: 'GET', path: `/resource_proofs/${segment(id)}` }),
);

export const resourceProofsUpdate: LobEndpoints['resourceProofsUpdate'] =
	defineOp(
		'resourceProofsUpdate',
		'resourceProofs.update',
		({ id, template_id }) => ({
			method: 'PATCH',
			path: `/resource_proofs/${segment(id)}`,
			body: { template_id },
		}),
	);
