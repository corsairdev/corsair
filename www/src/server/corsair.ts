import 'dotenv/config';

import { discord } from '@corsair-dev/discord';
import { github } from '@corsair-dev/github';
import { slack } from '@corsair-dev/slack';
import { createCorsair } from 'corsair';

import { db, pool } from '@/db';
import type { PullRequestClosedEvent } from '@/server/oss-shipped/handle-merged-pr';
import { handleMergedPullRequest } from '@/server/oss-shipped/handle-merged-pr';

export const corsair = createCorsair({
	plugins: [
		github({
			...(process.env.GITHUB_WEBHOOK_SECRET
				? { webhookSecret: process.env.GITHUB_WEBHOOK_SECRET }
				: {}),
			webhookHooks: {
				pullRequest: {
					closed: {
						after: async (_ctx, response) => {
							await postToShipped(response.data as PullRequestClosedEvent);
						},
					},
				},
			},
		}),
		slack(),
		discord({ key: process.env.DISCORD_BOT_TOKEN ?? '' }),
	],
	database: pool,
	kek: process.env.CORSAIR_KEK!,
	multiTenancy: false,
});

/** #shipped on the Corsair Discord: finish the claim a merged PR belongs to and post the card. */
async function postToShipped(event: PullRequestClosedEvent | undefined) {
	const channelId = process.env.OSS_SHIPPED_DISCORD_CHANNEL_ID;
	if (!event || !channelId || !process.env.DISCORD_BOT_TOKEN) return;
	try {
		const result = await handleMergedPullRequest(db, event, async (message) => {
			const sent = await corsair.discord.api.messages.send({
				channel_id: channelId,
				...message,
			});
			return { id: sent.id };
		});
		console.info('[oss-shipped]', event.pull_request.number, result.outcome);
	} catch (error) {
		// Never fail GitHub's webhook delivery over a Discord or DB problem.
		console.error(
			'[oss-shipped] failed for PR',
			event.pull_request?.number,
			error,
		);
	}
}
