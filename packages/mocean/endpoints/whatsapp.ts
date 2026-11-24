import type { BinaryResponse } from 'corsair/http';
import { toFileOutput } from 'corsair/http';
import { segment } from '../client';
import { endpoint } from './call';

/** Sends a WhatsApp message (text, media, template, interactive ...). */
export const send = endpoint('whatsappSend', {
	event: 'whatsapp.send',
	request: (p) => ({
		family: 'whatsapp',
		method: 'POST',
		path: '/rest/2/send-message/whatsapp',
		body: {
			'mocean-from': p.mocean_from,
			'mocean-to': p.mocean_to,
			...(p.mocean_event_url ? { 'mocean-event-url': p.mocean_event_url } : {}),
			'mocean-content': p.mocean_content,
		},
		mediaType: 'application/json',
	}),
	log: (parsed) => ({ type: parsed.mocean_content.type }),
});

/** Downloads media a WhatsApp user sent you, by its media ID. */
export const downloadMedia = endpoint('whatsappDownloadMedia', {
	event: 'whatsapp.downloadMedia',
	request: ({ mocean_from, mocean_media_id }) => ({
		family: 'whatsapp',
		method: 'GET',
		path: '/rest/2/media/whatsapp',
		query: { 'mocean-from': mocean_from, 'mocean-media-id': mocean_media_id },
		responseType: 'binary',
	}),
	shape: (raw) => {
		const { bytes, contentType } = raw as BinaryResponse;
		return toFileOutput(bytes, contentType);
	},
	log: (_, result) => ({ bytes: result.byteLength }),
});

/** Lists WhatsApp message templates, with filters and cursor paging. */
export const listTemplates = endpoint('templatesList', {
	event: 'templates.list',
	request: (p) => ({
		family: 'whatsapp',
		method: 'GET',
		path: '/template/whatsapp/message_templates',
		query: {
			limit: p.limit,
			category: p.category,
			content: p.content,
			language: p.language,
			name: p.name,
			name_or_content: p.name_or_content,
			quality_score: p.quality_score,
			status: p.status,
		},
	}),
	log: (_, result) => ({ templates: result.data?.length ?? 0 }),
});

/** Reads one WhatsApp template by ID. */
export const getTemplate = endpoint('templatesGet', {
	event: 'templates.get',
	request: ({ templateId }) => ({
		family: 'whatsapp',
		method: 'GET',
		path: `/template/whatsapp/${segment(templateId)}`,
	}),
});

/** Creates a WhatsApp template and submits it to Meta for review. */
export const createTemplate = endpoint('templatesCreate', {
	event: 'templates.create',
	request: (template) => ({
		family: 'whatsapp',
		method: 'POST',
		path: '/template/whatsapp/message_templates',
		body: template,
		mediaType: 'application/json',
	}),
});

/** Edits a WhatsApp template; Meta reviews it again. */
export const editTemplate = endpoint('templatesEdit', {
	event: 'templates.edit',
	request: ({ templateId, ...template }) => ({
		family: 'whatsapp',
		method: 'POST',
		path: `/template/whatsapp/${segment(templateId)}`,
		body: template,
		mediaType: 'application/json',
	}),
});

/** Deletes a WhatsApp template (every language, or one by ID). */
export const deleteTemplate = endpoint('templatesDelete', {
	event: 'templates.delete',
	request: ({ name, hsm_id }) => ({
		family: 'whatsapp',
		method: 'DELETE',
		path: '/template/whatsapp/message_templates',
		query: { name, hsm_id },
	}),
});
