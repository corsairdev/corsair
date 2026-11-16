import type { SupportbeeEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf, ticketAction, unwrapList, unwrapObject } from './call';
import {
	SupportbeeEndpointInputSchemas as Inputs,
	SupportbeeEndpointOutputSchemas as Outputs,
} from './types';

export const list: SupportbeeEndpoints['ticketsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.list',
			input: Inputs.ticketsList,
			output: Outputs.ticketsList,
		},
		input,
		({
			per_page,
			page,
			archived,
			spam,
			trash,
			replies,
			max_replies,
			assigned_user,
			assigned_team,
			label,
			since,
			until,
			sort_by,
			requester_emails,
			total_only,
		}) => ({
			method: 'GET',
			path: '/tickets',
			query: queryOf({
				per_page,
				page,
				archived,
				spam,
				trash,
				replies,
				max_replies,
				assigned_user,
				assigned_team,
				label,
				since,
				until,
				sort_by,
				requester_emails,
				total_only,
			}),
		}),
		{
			// total_only answers just `{ total }`, with no tickets array.
			shape: (raw, { total_only }) =>
				total_only
					? unwrapObject(raw, 'ticket count')
					: {
							...unwrapObject(raw, 'ticket list'),
							tickets: unwrapList(raw, 'tickets', 'ticket list'),
						},
			log: (_, result) => ({
				count: result.tickets?.length ?? result.total ?? undefined,
			}),
		},
	);

export const create: SupportbeeEndpoints['ticketsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.create',
			input: Inputs.ticketsCreate,
			output: Outputs.ticketsCreate,
		},
		input,
		({
			subject,
			requester_name,
			requester_email,
			cc,
			bcc,
			notify_requester,
			content,
			forwarding_address_id,
		}) => ({
			method: 'POST',
			path: '/tickets',
			body: {
				ticket: {
					...(subject === undefined ? {} : { subject }),
					...(requester_name === undefined ? {} : { requester_name }),
					...(requester_email === undefined ? {} : { requester_email }),
					...(cc === undefined ? {} : { cc }),
					...(bcc === undefined ? {} : { bcc }),
					...(notify_requester === undefined ? {} : { notify_requester }),
					...(content === undefined ? {} : { content }),
					...(forwarding_address_id === undefined
						? {}
						: { forwarding_address_id }),
				},
			},
		}),
		{
			// The docs show the bare ticket; the live API wraps it as `{ ticket }`,
			// as tickets.get does. Both are accepted and the ticket is returned.
			shape: (raw) =>
				raw && typeof raw === 'object' && 'ticket' in raw ? raw.ticket : raw,
			log: (_, result) => ({ ticketId: result.id }),
		},
	);

export const search: SupportbeeEndpoints['ticketsSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.search',
			input: Inputs.ticketsSearch,
			output: Outputs.ticketsSearch,
		},
		input,
		({ query, per_page, page, spam, trash }) => ({
			method: 'GET',
			path: '/tickets/search',
			query: queryOf({ query, per_page, page, spam, trash }),
		}),
		{
			shape: (raw) => ({
				...unwrapObject(raw, 'ticket search'),
				tickets: unwrapList(raw, 'tickets', 'ticket search'),
			}),
			// The query often holds a customer's email, so only the count is logged.
			log: (_, result) => ({ count: result.tickets.length }),
		},
	);

export const get: SupportbeeEndpoints['ticketsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.get',
			input: Inputs.ticketsGet,
			output: Outputs.ticketsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/tickets/${segment(id)}` }),
		{
			log: (parsed) => ({ ticketId: parsed.id }),
		},
	);

export const remove: SupportbeeEndpoints['ticketsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.delete',
			input: Inputs.ticketsDelete,
			output: Outputs.ticketsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/tickets/${segment(id)}` }),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: (parsed) => ({ ticketId: parsed.id }),
		},
	);

/**
 * The flag routes all post or delete one sub-path and answer 204 with no body,
 * so each reports the ticket id and that it changed. They are written out rather
 * than generated: every one is its own operation, and a shared factory would
 * collapse eight distinct endpoint types into one.
 */
export const archive: SupportbeeEndpoints['ticketsArchive'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.archive',
			input: Inputs.ticketsArchive,
			output: Outputs.ticketsArchive,
		},
		input,
		({ id }) => ({ method: 'POST', path: `/tickets/${segment(id)}/archive` }),
		{
			shape: (_, parsed) => ticketAction(parsed.id),
			log: (parsed) => ({ ticketId: parsed.id }),
		},
	);

export const unarchive: SupportbeeEndpoints['ticketsUnarchive'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tickets.unarchive',
			input: Inputs.ticketsUnarchive,
			output: Outputs.ticketsUnarchive,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/tickets/${segment(id)}/archive` }),
		{
			shape: (_, parsed) => ticketAction(parsed.id),
			log: (parsed) => ({ ticketId: parsed.id }),
		},
	);

export const markAnswered: SupportbeeEndpoints['ticketsMarkAnswered'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tickets.markAnswered',
			input: Inputs.ticketsMarkAnswered,
			output: Outputs.ticketsMarkAnswered,
		},
		input,
		({ id }) => ({ method: 'POST', path: `/tickets/${segment(id)}/answered` }),
		{
			shape: (_, parsed) => ticketAction(parsed.id),
			log: (parsed) => ({ ticketId: parsed.id }),
		},
	);

export const markUnanswered: SupportbeeEndpoints['ticketsMarkUnanswered'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tickets.markUnanswered',
			input: Inputs.ticketsMarkUnanswered,
			output: Outputs.ticketsMarkUnanswered,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/tickets/${segment(id)}/answered`,
		}),
		{
			shape: (_, parsed) => ticketAction(parsed.id),
			log: (parsed) => ({ ticketId: parsed.id }),
		},
	);

export const markSpam: SupportbeeEndpoints['ticketsMarkSpam'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.markSpam',
			input: Inputs.ticketsMarkSpam,
			output: Outputs.ticketsMarkSpam,
		},
		input,
		({ id }) => ({ method: 'POST', path: `/tickets/${segment(id)}/spam` }),
		{
			shape: (_, parsed) => ticketAction(parsed.id),
			log: (parsed) => ({ ticketId: parsed.id }),
		},
	);

export const unmarkSpam: SupportbeeEndpoints['ticketsUnmarkSpam'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tickets.unmarkSpam',
			input: Inputs.ticketsUnmarkSpam,
			output: Outputs.ticketsUnmarkSpam,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/tickets/${segment(id)}/spam` }),
		{
			shape: (_, parsed) => ticketAction(parsed.id),
			log: (parsed) => ({ ticketId: parsed.id }),
		},
	);

export const trash: SupportbeeEndpoints['ticketsTrash'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.trash',
			input: Inputs.ticketsTrash,
			output: Outputs.ticketsTrash,
		},
		input,
		({ id }) => ({ method: 'POST', path: `/tickets/${segment(id)}/trash` }),
		{
			shape: (_, parsed) => ticketAction(parsed.id),
			log: (parsed) => ({ ticketId: parsed.id }),
		},
	);

export const untrash: SupportbeeEndpoints['ticketsUntrash'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.untrash',
			input: Inputs.ticketsUntrash,
			output: Outputs.ticketsUntrash,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/tickets/${segment(id)}/trash` }),
		{
			shape: (_, parsed) => ticketAction(parsed.id),
			log: (parsed) => ({ ticketId: parsed.id }),
		},
	);

export const assignUser: SupportbeeEndpoints['ticketsAssignUser'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tickets.assignUser',
			input: Inputs.ticketsAssignUser,
			output: Outputs.ticketsAssignUser,
		},
		input,
		({ id, user_id }) => ({
			method: 'POST',
			path: `/tickets/${segment(id)}/user_assignment`,
			body: { user_assignment: { user_id } },
		}),
		{
			log: (parsed) => ({ ticketId: parsed.id, userId: parsed.user_id }),
		},
	);

export const unassignUser: SupportbeeEndpoints['ticketsUnassignUser'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tickets.unassignUser',
			input: Inputs.ticketsUnassignUser,
			output: Outputs.ticketsUnassignUser,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/tickets/${segment(id)}/user_assignment`,
		}),
		{
			shape: (_, parsed) => ticketAction(parsed.id),
			log: (parsed) => ({ ticketId: parsed.id }),
		},
	);

export const assignTeam: SupportbeeEndpoints['ticketsAssignTeam'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tickets.assignTeam',
			input: Inputs.ticketsAssignTeam,
			output: Outputs.ticketsAssignTeam,
		},
		input,
		({ id, team_id }) => ({
			method: 'POST',
			path: `/tickets/${segment(id)}/team_assignment`,
			body: { team_assignment: { team_id } },
		}),
		{
			log: (parsed) => ({ ticketId: parsed.id, teamId: parsed.team_id }),
		},
	);

export const unassignTeam: SupportbeeEndpoints['ticketsUnassignTeam'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tickets.unassignTeam',
			input: Inputs.ticketsUnassignTeam,
			output: Outputs.ticketsUnassignTeam,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/tickets/${segment(id)}/team_assignment`,
		}),
		{
			shape: (_, parsed) => ticketAction(parsed.id),
			log: (parsed) => ({ ticketId: parsed.id }),
		},
	);

export const audit: SupportbeeEndpoints['ticketsAudit'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.audit',
			input: Inputs.ticketsAudit,
			output: Outputs.ticketsAudit,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/tickets/${segment(id)}/audit` }),
		{
			log: (parsed, result) => ({
				ticketId: parsed.id,
				count: result.audit.length,
			}),
		},
	);

export const addLabel: SupportbeeEndpoints['ticketsAddLabel'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickets.addLabel',
			input: Inputs.ticketsAddLabel,
			output: Outputs.ticketsAddLabel,
		},
		input,
		({ ticket_id, label_name }) => ({
			method: 'POST',
			path: `/tickets/${segment(ticket_id)}/labels/${segment(label_name)}`,
		}),
		{
			log: (parsed) => ({
				ticketId: parsed.ticket_id,
				label: parsed.label_name,
			}),
		},
	);

export const removeLabel: SupportbeeEndpoints['ticketsRemoveLabel'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tickets.removeLabel',
			input: Inputs.ticketsRemoveLabel,
			output: Outputs.ticketsRemoveLabel,
		},
		input,
		({ ticket_id, label_name }) => ({
			method: 'DELETE',
			path: `/tickets/${segment(ticket_id)}/labels/${segment(label_name)}`,
		}),
		{
			shape: (_, parsed) => ({
				ticket_id: parsed.ticket_id,
				label_name: parsed.label_name,
				removed: true,
			}),
			log: (parsed) => ({
				ticketId: parsed.ticket_id,
				label: parsed.label_name,
			}),
		},
	);
