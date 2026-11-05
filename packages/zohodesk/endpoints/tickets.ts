import type { ZohoDeskContext, ZohoDeskEndpoints } from '..';
import { csv, syncBestEffort, zohoDeskCall } from './call';
import type { ZohoDeskEndpointOutputs } from './types';
import {
	ZohoDeskEndpointInputSchemas,
	ZohoDeskEndpointOutputSchemas,
} from './types';

const CONVERSATIONS_DEFAULT_LIMIT = 100;

type Ticket = ZohoDeskEndpointOutputs['ticketsGet'];

function idText(value: Ticket['id']) {
	return value === null || value === undefined ? value : String(value);
}

async function syncTickets(ctx: ZohoDeskContext, tickets: readonly Ticket[]) {
	if (!ctx.db.tickets) return;
	await syncBestEffort('tickets', async () => {
		for (const ticket of tickets) {
			const id = idText(ticket.id);
			if (!id) continue;
			await ctx.db.tickets.upsertByEntityId(id, {
				id,
				ticketNumber: idText(ticket.ticketNumber),
				subject: ticket.subject,
				status: ticket.status,
				statusType: ticket.statusType,
				priority: ticket.priority,
				channel: ticket.channel,
				category: ticket.category,
				departmentId: idText(ticket.departmentId),
				contactId: idText(ticket.contactId),
				accountId: idText(ticket.accountId),
				assigneeId: idText(ticket.assigneeId),
				teamId: idText(ticket.teamId),
				email: ticket.email,
				dueDate: ticket.dueDate,
				closedTime: ticket.closedTime,
				createdTime: ticket.createdTime,
				webUrl: ticket.webUrl,
			});
		}
	});
}

export const list: ZohoDeskEndpoints['ticketsList'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.tickets.list',
		input: ZohoDeskEndpointInputSchemas.ticketsList,
		output: ZohoDeskEndpointOutputSchemas.ticketsList,
		empty: { data: [] },
		toRequest: (parsed) => ({
			path: '/tickets',
			query: {
				from: parsed.from,
				limit: parsed.limit,
				departmentIds: csv(parsed.departmentIds),
				viewId: parsed.viewId,
				assignee: csv(parsed.assignee),
				teamIds: csv(parsed.teamIds),
				channel: csv(parsed.channel),
				status: csv(parsed.status),
				priority: csv(parsed.priority),
				sortBy: parsed.sortBy,
				receivedInDays: parsed.receivedInDays,
				include: csv(parsed.include),
				fields: csv(parsed.fields),
			},
		}),
		// A `fields` selection returns partial rows, and upserts replace the
		// stored row, so saving those would blank out the columns left out.
		sync: (result, parsed) =>
			parsed.fields ? Promise.resolve() : syncTickets(ctx, result.data),
	});

export const get: ZohoDeskEndpoints['ticketsGet'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.tickets.get',
		input: ZohoDeskEndpointInputSchemas.ticketsGet,
		output: ZohoDeskEndpointOutputSchemas.ticketsGet,
		toRequest: ({ ticketId, include }) => ({
			path: `/tickets/${ticketId}`,
			query: { include: csv(include) },
		}),
		sync: (result) => syncTickets(ctx, [result]),
	});

export const getResolution: ZohoDeskEndpoints['ticketsGetResolution'] = (
	ctx,
	input,
) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.tickets.getResolution',
		input: ZohoDeskEndpointInputSchemas.ticketsGetResolution,
		output: ZohoDeskEndpointOutputSchemas.ticketsGetResolution,
		empty: null,
		toRequest: ({ ticketId }) => ({ path: `/tickets/${ticketId}/resolution` }),
	});

export const getLatestThread: ZohoDeskEndpoints['ticketsGetLatestThread'] = (
	ctx,
	input,
) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.tickets.getLatestThread',
		input: ZohoDeskEndpointInputSchemas.ticketsGetLatestThread,
		output: ZohoDeskEndpointOutputSchemas.ticketsGetLatestThread,
		empty: null,
		toRequest: ({
			ticketId,
			needPublic,
			needIncomingThread,
			include,
			threadStatus,
		}) => ({
			path: `/tickets/${ticketId}/latestThread`,
			query: {
				needPublic,
				needIncomingThread,
				include: csv(include),
				threadStatus,
			},
		}),
	});

export const getThread: ZohoDeskEndpoints['ticketsGetThread'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.tickets.getThread',
		input: ZohoDeskEndpointInputSchemas.ticketsGetThread,
		output: ZohoDeskEndpointOutputSchemas.ticketsGetThread,
		toRequest: ({ ticketId, threadId, include }) => ({
			path: `/tickets/${ticketId}/threads/${threadId}`,
			query: { include: csv(include) },
		}),
	});

export const listConversations: ZohoDeskEndpoints['ticketsListConversations'] =
	(ctx, input) =>
		zohoDeskCall(ctx, input, {
			event: 'zohodesk.tickets.listConversations',
			input: ZohoDeskEndpointInputSchemas.ticketsListConversations,
			output: ZohoDeskEndpointOutputSchemas.ticketsListConversations,
			empty: { data: [] },
			toRequest: ({ ticketId, from, limit }) => ({
				path: `/tickets/${ticketId}/conversations`,
				// The reference marks limit required, with a default of 100.
				query: { from, limit: limit ?? CONVERSATIONS_DEFAULT_LIMIT },
			}),
		});
