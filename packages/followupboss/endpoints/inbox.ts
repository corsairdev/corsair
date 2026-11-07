import { asRecord } from 'corsair/core';
import type { FollowUpBossEndpoints } from '..';
import { segment } from '../client';
import { call, envelopeMany, envelopeMeta, envelopeOne } from './call';
import {
	InboxInputSchemas as Inputs,
	InboxOutputSchemas as Outputs,
} from './inbox-types';

// The aggregated schema registry in './registry' reads the family maps from
// this module, so they are re-exported alongside the handlers.
export { InboxInputSchemas, InboxOutputSchemas } from './inbox-types';

// Handlers are structurally typed until the central FollowUpBossEndpoints map
// gains the inbox families; call() owns input parsing and output validation.

// ── inboxApps ──────────────────────────────────────────────────────────────

export const inboxAppsDeactivate: FollowUpBossEndpoints['inboxAppsDeactivate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'inboxApps.deactivate',
				input: Inputs.inboxAppsDeactivate,
				output: Outputs.inboxAppsDeactivate,
			},
			input,
			({ inboxAppId }) => ({
				method: 'DELETE',
				path: `/inboxApps/${segment(inboxAppId)}`,
			}),
			{
				// Deactivation answers 204 with no body.
				shape: (_, { inboxAppId }) => ({ success: true, inboxAppId }),
				log: ({ inboxAppId }) => ({ inboxAppId }),
			},
		);

export const inboxAppsDeleteParticipant: FollowUpBossEndpoints['inboxAppsDeleteParticipant'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'inboxApps.deleteParticipant',
				input: Inputs.inboxAppsDeleteParticipant,
				output: Outputs.inboxAppsDeleteParticipant,
			},
			input,
			({ inboxAppId, extConversationId, participantId }) => ({
				method: 'DELETE',
				path: `/inboxApps/${segment(inboxAppId)}/conversations/${segment(extConversationId)}/participants/${segment(participantId)}`,
			}),
			{
				// Removal answers 204 with no body.
				shape: (_, { participantId }) => ({ success: true, participantId }),
				log: ({ inboxAppId, extConversationId, participantId }) => ({
					inboxAppId,
					extConversationId,
					participantId,
				}),
			},
		);

export const inboxAppsGetParticipants: FollowUpBossEndpoints['inboxAppsGetParticipants'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'inboxApps.getParticipants',
				input: Inputs.inboxAppsGetParticipants,
				output: Outputs.inboxAppsGetParticipants,
			},
			input,
			({ inboxAppId, extConversationId }) => ({
				method: 'GET',
				path: `/inboxApps/${segment(inboxAppId)}/conversations/${segment(extConversationId)}/participants`,
			}),
			{
				// The participants list is a bare array, not an envelope. A missing
				// body stays empty; anything defined passes through so the output
				// schema's z.array rejects malformed replies instead of masking them.
				shape: (raw) => (raw === undefined ? [] : raw),
				log: (_, result) => ({ count: result.length }),
			},
		);

export const inboxAppsCreateParticipant: FollowUpBossEndpoints['inboxAppsCreateParticipant'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'inboxApps.createParticipant',
				input: Inputs.inboxAppsCreateParticipant,
				output: Outputs.inboxAppsCreateParticipant,
			},
			input,
			({ inboxAppId, extConversationId, body }) => ({
				method: 'POST',
				path: `/inboxApps/${segment(inboxAppId)}/conversations/${segment(extConversationId)}/participants`,
				body,
			}),
			{
				// Adding a participant answers 201 with the participant.
				shape: (raw) => envelopeOne(raw, 'participants'),
				log: (_, result) => ({ participantId: result.id ?? undefined }),
			},
		);

export const inboxAppsAddMessage: FollowUpBossEndpoints['inboxAppsAddMessage'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'inboxApps.addMessage',
				input: Inputs.inboxAppsAddMessage,
				output: Outputs.inboxAppsAddMessage,
			},
			input,
			({ inboxAppId, ...body }) => ({
				method: 'POST',
				path: `/inboxApps/${segment(inboxAppId)}/message`,
				body,
			}),
			{
				// Adding a message answers 201 with the message.
				shape: (raw) => envelopeOne(raw, 'messages'),
				log: (_, result) => ({ messageId: result.id ?? undefined }),
			},
		);

export const inboxAppsAddNote: FollowUpBossEndpoints['inboxAppsAddNote'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'inboxApps.addNote',
			input: Inputs.inboxAppsAddNote,
			output: Outputs.inboxAppsAddNote,
		},
		input,
		({ inboxAppId, ...body }) => ({
			method: 'POST',
			path: `/inboxApps/${segment(inboxAppId)}/note`,
			body,
		}),
		{
			// Adding a note answers 201 with the note.
			shape: (raw) => envelopeOne(raw, 'notes'),
			log: (_, result) => ({ noteId: result.id ?? undefined }),
		},
	);

export const inboxAppsAddSystemConfirmationMessage: FollowUpBossEndpoints['inboxAppsAddSystemConfirmationMessage'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'inboxApps.addSystemConfirmationMessage',
				input: Inputs.inboxAppsAddSystemConfirmationMessage,
				output: Outputs.inboxAppsAddSystemConfirmationMessage,
			},
			input,
			({ inboxAppId, ...body }) => ({
				method: 'POST',
				path: `/inboxApps/${segment(inboxAppId)}/systemMessage`,
				body,
			}),
			{
				// Adding a system confirmation message answers 201 with the message.
				shape: (raw) => envelopeOne(raw, 'messages'),
				log: (_, result) => ({ messageId: result.id ?? undefined }),
			},
		);

export const inboxAppsInstall: FollowUpBossEndpoints['inboxAppsInstall'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'inboxApps.install',
			input: Inputs.inboxAppsInstall,
			output: Outputs.inboxAppsInstall,
		},
		input,
		(body) => ({ method: 'POST', path: '/inboxApps/install', body }),
		{
			// Installing answers 201 with the installed app.
			shape: (raw) => envelopeOne(raw, 'inboxApps'),
			log: (_, result) => ({ inboxAppId: result.id ?? undefined }),
		},
	);

export const inboxAppsUpdateConversation: FollowUpBossEndpoints['inboxAppsUpdateConversation'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'inboxApps.updateConversation',
				input: Inputs.inboxAppsUpdateConversation,
				output: Outputs.inboxAppsUpdateConversation,
			},
			input,
			({ inboxAppId, extConversationId, ...body }) => ({
				method: 'PUT',
				path: `/inboxApps/${segment(inboxAppId)}/conversations/${segment(extConversationId)}`,
				body,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'conversations'),
				log: ({ inboxAppId, extConversationId }) => ({
					inboxAppId,
					extConversationId,
				}),
			},
		);

export const inboxAppsUpdateMessage: FollowUpBossEndpoints['inboxAppsUpdateMessage'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'inboxApps.updateMessage',
				input: Inputs.inboxAppsUpdateMessage,
				output: Outputs.inboxAppsUpdateMessage,
			},
			input,
			({ inboxAppId, ...body }) => ({
				method: 'PUT',
				path: `/inboxApps/${segment(inboxAppId)}/message`,
				body,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'messages'),
				log: ({ inboxAppId }) => ({ inboxAppId }),
			},
		);

export const inboxAppsInstalledApp: FollowUpBossEndpoints['inboxAppsInstalledApp'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'inboxApps.installedApp',
				input: Inputs.inboxAppsInstalledApp,
				output: Outputs.inboxAppsInstalledApp,
			},
			input,
			({ publishedInboxAppId }) => ({
				method: 'GET',
				path: `/inboxApps/installedApps/${segment(publishedInboxAppId)}`,
			}),
			{
				shape: (raw) => ({ inboxApps: envelopeMany(raw, 'inboxApps') }),
				log: (_, result) => ({ count: result.inboxApps.length }),
			},
		);

// ── teamInboxes ────────────────────────────────────────────────────────────

export const teamInboxesList: FollowUpBossEndpoints['teamInboxesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'teamInboxes.list',
			input: Inputs.teamInboxesList,
			output: Outputs.teamInboxesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/teamInboxes', query }),
		{
			shape: (raw) => ({
				teamInboxes: envelopeMany(raw, 'teamInboxes'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.teamInboxes.length }),
		},
	);

// ── reactions ──────────────────────────────────────────────────────────────

export const reactionsCreate: FollowUpBossEndpoints['reactionsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reactions.create',
			input: Inputs.reactionsCreate,
			output: Outputs.reactionsCreate,
		},
		input,
		({ refType, refId, body }) => ({
			method: 'POST',
			path: `/reactions/${segment(refType)}/${segment(refId)}`,
			body: body === undefined ? undefined : { body },
		}),
		{
			// Reacting answers 201 with the entity's reaction list, documented as
			// an array; a bare reaction object is accepted as a one-element list.
			// A bodyless reply is an empty list and a bare reaction a list of one;
			// anything else (a string, null) goes to output validation and fails.
			shape: (raw) =>
				raw === undefined
					? []
					: Array.isArray(raw)
						? raw
						: asRecord(raw)
							? [raw]
							: raw,
			log: ({ refType, refId }) => ({ refType, refId }),
		},
	);

export const reactionsDelete: FollowUpBossEndpoints['reactionsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reactions.delete',
			input: Inputs.reactionsDelete,
			output: Outputs.reactionsDelete,
		},
		input,
		({ refType, refId, emoji, body }) => ({
			method: 'DELETE',
			path: `/reactions/${segment(refType)}/${segment(refId)}`,
			query: { emoji },
			// This DELETE carries a body in the published contract (the emoji,
			// mirroring the POST shape), so it is forwarded when given.
			body: body === undefined ? undefined : { body },
		}),
		{
			// Deletion answers 204 with no body.
			shape: (_, { refType, refId }) => ({ success: true, refType, refId }),
			log: ({ refType, refId }) => ({ refType, refId }),
		},
	);

export const reactionsGet: FollowUpBossEndpoints['reactionsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reactions.get',
			input: Inputs.reactionsGet,
			output: Outputs.reactionsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/reactions/${segment(id)}` }),
		{
			// A single fetch arrives as `{ reactions: [reaction] }` or bare.
			shape: (raw) => envelopeOne(raw, 'reactions'),
			log: ({ id }) => ({ reactionId: id }),
		},
	);

// ── threaded replies ───────────────────────────────────────────────────────

export const threadedRepliesGet: FollowUpBossEndpoints['threadedRepliesGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'threadedReplies.get',
			input: Inputs.threadedRepliesGet,
			output: Outputs.threadedRepliesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/threadedReplies/${segment(id)}` }),
		{
			// A single fetch arrives as `{ threadedReplies: [reply] }` or bare.
			shape: (raw) => envelopeOne(raw, 'threadedReplies'),
			log: ({ id }) => ({ threadedReplyId: id }),
		},
	);
