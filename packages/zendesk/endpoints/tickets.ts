import { logEventFromContext } from 'corsair/core';
import { makeZendeskRequest } from '../client';
import type { ZendeskEndpoints } from '../index';
import type { ZendeskEndpointOutputs } from './types';

export const create: ZendeskEndpoints['ticketsCreate'] = async (ctx, input) => {
	const subdomain =
		ctx.options.subdomain ?? (await ctx.keys.get_subdomain()) ?? '';
	const response = await makeZendeskRequest<
		ZendeskEndpointOutputs['ticketsCreate']
	>('tickets.json', ctx.key, subdomain, {
		method: 'POST',
		body: {
			ticket: {
				...(input.subject && { subject: input.subject }),
				...(input.description && { description: input.description }),
				...(input.comment && { comment: input.comment }),
				...(input.status && { status: input.status }),
				...(input.priority && { priority: input.priority }),
				...(input.requester_id !== undefined && {
					requester_id: input.requester_id,
				}),
				...(input.assignee_id !== undefined && {
					assignee_id: input.assignee_id,
				}),
				...(input.group_id !== undefined && { group_id: input.group_id }),
				...(input.organization_id !== undefined && {
					organization_id: input.organization_id,
				}),
				...(input.tags && { tags: input.tags }),
			},
		},
	});

	const ticket = response.ticket;
	if (ticket && ctx.db.tickets) {
		try {
			await ctx.db.tickets.upsertByEntityId(String(ticket.id), {
				id: ticket.id,
				subject: ticket.subject ?? null,
				description: ticket.description ?? null,
				status: ticket.status ?? null,
				priority: ticket.priority ?? null,
				requesterId: ticket.requester_id ?? null,
				assigneeId: ticket.assignee_id ?? null,
				organizationId: ticket.organization_id ?? null,
				groupId: ticket.group_id ?? null,
				createdAt: ticket.created_at ? new Date(ticket.created_at) : null,
				updatedAt: ticket.updated_at ? new Date(ticket.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save ticket to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zendesk.tickets.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: ZendeskEndpoints['ticketsGet'] = async (ctx, input) => {
	const subdomain =
		ctx.options.subdomain ?? (await ctx.keys.get_subdomain()) ?? '';
	const response = await makeZendeskRequest<
		ZendeskEndpointOutputs['ticketsGet']
	>(`tickets/${input.id}.json`, ctx.key, subdomain, { method: 'GET' });

	const ticket = response.ticket;
	if (ticket && ctx.db.tickets) {
		try {
			await ctx.db.tickets.upsertByEntityId(String(ticket.id), {
				id: ticket.id,
				subject: ticket.subject ?? null,
				description: ticket.description ?? null,
				status: ticket.status ?? null,
				priority: ticket.priority ?? null,
				requesterId: ticket.requester_id ?? null,
				assigneeId: ticket.assignee_id ?? null,
				organizationId: ticket.organization_id ?? null,
				groupId: ticket.group_id ?? null,
				createdAt: ticket.created_at ? new Date(ticket.created_at) : null,
				updatedAt: ticket.updated_at ? new Date(ticket.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save ticket to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zendesk.tickets.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: ZendeskEndpoints['ticketsUpdate'] = async (ctx, input) => {
	const subdomain =
		ctx.options.subdomain ?? (await ctx.keys.get_subdomain()) ?? '';
	const response = await makeZendeskRequest<
		ZendeskEndpointOutputs['ticketsUpdate']
	>(`tickets/${input.id}.json`, ctx.key, subdomain, {
		method: 'PUT',
		body: {
			ticket: {
				...(input.subject && { subject: input.subject }),
				...(input.status && { status: input.status }),
				...(input.priority && { priority: input.priority }),
				...(input.requester_id !== undefined && {
					requester_id: input.requester_id,
				}),
				...(input.assignee_id !== undefined && {
					assignee_id: input.assignee_id,
				}),
				...(input.comment && { comment: input.comment }),
				...(input.tags && { tags: input.tags }),
			},
		},
	});

	const ticket = response.ticket;
	if (ticket && ctx.db.tickets) {
		try {
			await ctx.db.tickets.upsertByEntityId(String(ticket.id), {
				id: ticket.id,
				subject: ticket.subject ?? null,
				description: ticket.description ?? null,
				status: ticket.status ?? null,
				priority: ticket.priority ?? null,
				requesterId: ticket.requester_id ?? null,
				assigneeId: ticket.assignee_id ?? null,
				organizationId: ticket.organization_id ?? null,
				groupId: ticket.group_id ?? null,
				createdAt: ticket.created_at ? new Date(ticket.created_at) : null,
				updatedAt: ticket.updated_at ? new Date(ticket.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save ticket to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zendesk.tickets.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteTicket: ZendeskEndpoints['ticketsDelete'] = async (
	ctx,
	input,
) => {
	const subdomain =
		ctx.options.subdomain ?? (await ctx.keys.get_subdomain()) ?? '';
	await makeZendeskRequest<unknown>(
		`tickets/${input.id}.json`,
		ctx.key,
		subdomain,
		{ method: 'DELETE' },
	);

	if (ctx.db.tickets) {
		try {
			await ctx.db.tickets.deleteByEntityId(String(input.id));
		} catch (error) {
			console.warn('Failed to delete ticket from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zendesk.tickets.delete',
		{ ...input },
		'completed',
	);
	return { id: input.id };
};

export const list: ZendeskEndpoints['ticketsList'] = async (ctx, input) => {
	const subdomain =
		ctx.options.subdomain ?? (await ctx.keys.get_subdomain()) ?? '';
	const response = await makeZendeskRequest<
		ZendeskEndpointOutputs['ticketsList']
	>('tickets.json', ctx.key, subdomain, {
		method: 'GET',
		query: {
			...(input.page !== undefined && { page: input.page }),
			...(input.per_page !== undefined && { per_page: input.per_page }),
			...(input.sort_by && { sort_by: input.sort_by }),
			...(input.sort_order && { sort_order: input.sort_order }),
		},
	});

	const tickets = response.tickets || [];
	if (ctx.db.tickets) {
		for (const ticket of tickets) {
			try {
				await ctx.db.tickets.upsertByEntityId(String(ticket.id), {
					id: ticket.id,
					subject: ticket.subject ?? null,
					description: ticket.description ?? null,
					status: ticket.status ?? null,
					priority: ticket.priority ?? null,
					requesterId: ticket.requester_id ?? null,
					assigneeId: ticket.assignee_id ?? null,
					organizationId: ticket.organization_id ?? null,
					groupId: ticket.group_id ?? null,
					createdAt: ticket.created_at ? new Date(ticket.created_at) : null,
					updatedAt: ticket.updated_at ? new Date(ticket.updated_at) : null,
				});
			} catch (error) {
				console.warn('Failed to save ticket to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'zendesk.tickets.list',
		{ ...input },
		'completed',
	);
	return response;
};
