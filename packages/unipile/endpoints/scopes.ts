import { defineOperation } from './call';

// List Scopes (GET /v2/scopes/)
export const list = defineOperation('scopesList', 'scopes.list', {
	method: 'GET',
	path: '/v2/scopes/',
	query: ['offset', 'limit', 'status', 'search'],
});

// Create a Scope (POST /v2/scopes/)
export const create = defineOperation('scopesCreate', 'scopes.create', {
	method: 'POST',
	path: '/v2/scopes/',
	body: ['name', 'reference'],
});

// Get a Scope (GET /v2/scopes/{scope_id})
export const get = defineOperation('scopesGet', 'scopes.get', {
	method: 'GET',
	path: '/v2/scopes/{scope_id}',
});

// Update a Scope (PATCH /v2/scopes/{scope_id})
export const update = defineOperation('scopesUpdate', 'scopes.update', {
	method: 'PATCH',
	path: '/v2/scopes/{scope_id}',
	body: ['name', 'reference', 'status'],
});

// Delete a Scope (DELETE /v2/scopes/{scope_id})
export const remove = defineOperation('scopesDelete', 'scopes.delete', {
	method: 'DELETE',
	path: '/v2/scopes/{scope_id}',
});
