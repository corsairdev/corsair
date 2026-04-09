import { logEventFromContext } from 'corsair/core';
import type { TrelloWebhooks } from '..';
import { createTrelloActionMatch, verifyTrelloWebhookSignature } from './types';

export const memberAddedToCard: TrelloWebhooks['memberAddedToCard'] = {
	match: createTrelloActionMatch('addMemberToCard'),

	handler: async (ctx, request) => {
		const verification = verifyTrelloWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const payload = request.payload;
		const action = payload.action;
		const card = action.data?.card;
		const member = action.data?.member;
		let corsairEntityId = '';

		if (card?.id && ctx.db.cards) {
			try {
				const existing = await ctx.db.cards.findByEntityId(card.id);
				const currentMembers = existing?.data?.idMembers ?? [];
				const memberId = action.data?.idMember ?? member?.id;

				const updatedMembers =
					memberId && !currentMembers.includes(memberId)
						? [...currentMembers, memberId]
						: currentMembers;

				const entity = await ctx.db.cards.upsertByEntityId(card.id, {
					...(existing?.data ?? {}),
					...card,
					idMembers: updatedMembers,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn(
					'Failed to update card members in database from webhook:',
					error,
				);
			}
		}

		if (member?.id && ctx.db.members) {
			try {
				await ctx.db.members.upsertByEntityId(member.id, {
					...member,
				});
			} catch (error) {
				console.warn('Failed to save member to database from webhook:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'trello.webhook.member.addedToCard',
			{ cardId: card?.id, memberId: member?.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: payload,
		};
	},
};
