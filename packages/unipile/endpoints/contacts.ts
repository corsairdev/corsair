import { defineOperation } from './call';

// List contacts (GET /v2/{account_id}/contacts)
export const list = defineOperation('contactsList', 'contacts.list', {
	method: 'GET',
	path: '/v2/{account_id}/contacts',
	query: ['offset', 'cursor', 'limit'],
});
