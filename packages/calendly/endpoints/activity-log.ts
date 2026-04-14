import { logEventFromContext } from 'corsair/core';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const listEntries: CalendlyEndpoints['activityLogList'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['activityLogList']
	>('activity_log_entries', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (result.collection && ctx.db.activityLogEntries) {
		try {
			for (const entry of result.collection) {
				if (!entry.uri) continue;
				const uriParts = entry.uri.split('/');
				const id = uriParts[uriParts.length - 1]!;
				await ctx.db.activityLogEntries.upsertByEntityId(id, {
					id,
					...entry,
					actor: entry.actor ?? undefined,
					details: entry.details ?? undefined,
					occurred_at: entry.occurred_at
						? new Date(entry.occurred_at).toISOString()
						: undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save activity log entries to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.activityLog.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const listOutgoingCommunications: CalendlyEndpoints['activityLogListOutgoingCommunications'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['activityLogListOutgoingCommunications']
		>('scheduled_event_notifications', ctx.key, {
			method: 'GET',
			query: input,
		});

		if (result.collection && ctx.db.outgoingCommunications) {
			try {
				for (const comm of result.collection) {
					if (!comm.uri) continue;
					const uriParts = comm.uri.split('/');
					const id = uriParts[uriParts.length - 1]!;
					await ctx.db.outgoingCommunications.upsertByEntityId(id, {
						id,
						...comm,
						sent_at: comm.sent_at
							? new Date(comm.sent_at).toISOString()
							: undefined,
					});
				}
			} catch (error) {
				console.warn(
					'Failed to save outgoing communications to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.activityLog.listOutgoingCommunications',
			{ ...input },
			'completed',
		);
		return result;
	};
