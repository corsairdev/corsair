import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { corsair } from './corsair';

export const submitEnterpriseContactSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	email: z.email('Enter a valid email address'),
	company: z.string().trim().optional(),
	notes: z.string().trim().optional(),
});

export type SubmitEnterpriseContactInput = z.infer<
	typeof submitEnterpriseContactSchema
>;

function formatEnterpriseContactMessage(input: SubmitEnterpriseContactInput) {
	const lines = [
		'New enterprise inquiry',
		'',
		`Name: ${input.name}`,
		`Email: ${input.email}`,
		`Company: ${input.company ?? '—'}`,
		`Notes: ${input.notes ?? '—'}`,
	];

	return lines.join('\n');
}

export async function sendEnterpriseContactNotification(
	input: SubmitEnterpriseContactInput,
) {
	const text = formatEnterpriseContactMessage(input);

	try {
		const result = await corsair.slack.api.messages.post({
			channel: 'general',
			text,
		});

		if (!result.ok) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Failed to send your message. Please try again.',
			});
		}

		return { ok: true as const };
	} catch (error) {
		if (error instanceof TRPCError) {
			throw error;
		}

		console.error('[enterprise-contact] Failed to post Slack message:', error);

		throw new TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'Failed to send your message. Please try again.',
		});
	}
}
