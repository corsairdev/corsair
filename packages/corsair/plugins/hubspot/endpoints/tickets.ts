import { logEventFromContext } from '../../utils/events';
import type { HubSpotEndpoints } from '..';
import { makeHubSpotRequest } from '../client';
import type {
	CreateTicketResponse,
	GetManyTicketsResponse,
	GetTicketResponse,
	UpdateTicketResponse,
} from './types';

export const get: HubSpotEndpoints['ticketsGet'] = async (ctx, input) => {
	const { ticketId, ...queryParams } = input;
	const endpoint = `/crm/v3/objects/tickets/${ticketId}`;
	const result = await makeHubSpotRequest<GetTicketResponse>(
		endpoint,
		ctx.options.token,
		{
			query: {
				...queryParams,
				properties: queryParams.properties?.join(','),
				propertiesWithHistory: queryParams.propertiesWithHistory?.join(','),
				associations: queryParams.associations?.join(','),
			} as any,
		},
	);

	if (result && ctx.db.tickets) {
		try {
			await ctx.db.tickets.upsert(result.id, {
				id: result.id,
				properties: result.properties,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
				archived: result.archived,
			});
		} catch (error) {
			console.warn('Failed to save ticket to database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.tickets.get', { ...input }, 'completed');
	return result;
};

export const getMany: HubSpotEndpoints['ticketsGetMany'] = async (ctx, input) => {
	const { ...queryParams } = input || {};
	const endpoint = '/crm/v3/objects/tickets';
	const result = await makeHubSpotRequest<GetManyTicketsResponse>(
		endpoint,
		ctx.options.token,
		{
			query: {
				...queryParams,
				properties: queryParams.properties?.join(','),
				propertiesWithHistory: queryParams.propertiesWithHistory?.join(','),
				associations: queryParams.associations?.join(','),
			} as any,
		},
	);

	if (result.results && ctx.db.tickets) {
		try {
			for (const ticket of result.results) {
				await ctx.db.tickets.upsert(ticket.id, {
					id: ticket.id,
					properties: ticket.properties,
					createdAt: new Date(ticket.createdAt),
					updatedAt: new Date(ticket.updatedAt),
					archived: ticket.archived,
				});
			}
		} catch (error) {
			console.warn('Failed to save tickets to database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.tickets.getMany', { ...input }, 'completed');
	return result;
};

export const create: HubSpotEndpoints['ticketsCreate'] = async (ctx, input) => {
	const { ...body } = input;
	const endpoint = '/crm/v3/objects/tickets';
	const result = await makeHubSpotRequest<CreateTicketResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'POST', body },
	);

	if (result && ctx.db.tickets) {
		try {
			await ctx.db.tickets.upsert(result.id, {
				id: result.id,
				properties: result.properties,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
				archived: result.archived,
			});
		} catch (error) {
			console.warn('Failed to save ticket to database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.tickets.create', { ...input }, 'completed');
	return result;
};

export const update: HubSpotEndpoints['ticketsUpdate'] = async (ctx, input) => {
	const { ticketId, ...body } = input;
	const endpoint = `/crm/v3/objects/tickets/${ticketId}`;
	const result = await makeHubSpotRequest<UpdateTicketResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'PATCH', body },
	);

	if (result && ctx.db.tickets) {
		try {
			await ctx.db.tickets.upsert(result.id, {
				id: result.id,
				properties: result.properties,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
				archived: result.archived,
			});
		} catch (error) {
			console.warn('Failed to update ticket in database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.tickets.update', { ...input }, 'completed');
	return result;
};

export const deleteTicket: HubSpotEndpoints['ticketsDelete'] = async (ctx, input) => {
	const { ticketId } = input;
	const endpoint = `/crm/v3/objects/tickets/${ticketId}`;
	await makeHubSpotRequest<void>(
		endpoint,
		ctx.options.token,
		{ method: 'DELETE' },
	);

	if (ctx.db.tickets) {
		try {
			await ctx.db.tickets.deleteByEntityId(ticketId);
		} catch (error) {
			console.warn('Failed to delete ticket from database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.tickets.delete', { ...input }, 'completed');
};
