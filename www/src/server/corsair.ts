import 'dotenv/config';

import { discord } from '@corsair-dev/discord';
import { github } from '@corsair-dev/github';
import { slack } from '@corsair-dev/slack';
import { createCorsair } from 'corsair';
import { revalidatePath, revalidateTag } from 'next/cache';

import { db, pool } from '@/db';
import { integrationCacheTag } from '@/server/integration-cache';
import { revalidateOssWriteSurface } from '@/server/oss-public-cache';
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

/** What adminMarkIntegrationMerged refreshes, so the OSS pages show the finish right away. */
function refreshOssPages(slug: string) {
	try {
		revalidatePath('/oss');
		revalidatePath('/oss/admin');
		revalidatePath(`/oss/${slug}`);
		revalidateOssWriteSurface();
		revalidateTag(integrationCacheTag(slug));
	} catch (error) {
		console.error('[oss-shipped] cache refresh failed for', slug, error);
	}
}

/** #shipped on the Corsair Discord: finish the claim a merged PR belongs to and post the card. */
async function postToShipped(event: PullRequestClosedEvent | undefined) {
	const channelId = process.env.OSS_SHIPPED_DISCORD_CHANNEL_ID;
	if (!event || !channelId || !process.env.DISCORD_BOT_TOKEN) return;
	try {
		const result = await handleMergedPullRequest(db, event, async (message) => {
			// A redelivered webhook, or two overlapping ones, would post the card again.
			// Reuse a recent card for the same PR instead.
			const recent = await corsair.discord.api.messages.list({
				channel_id: channelId,
				limit: 50,
			});
			const existing = recent.find((m) =>
				m.embeds.some((embed) => embed.url === message.embeds[0]?.url),
			);
			if (existing) return { id: existing.id };
			const sent = await corsair.discord.api.messages.send({
				channel_id: channelId,
				...message,
			});
			return { id: sent.id };
		});
		console.info('[oss-shipped]', event.pull_request.number, result.outcome);
		if (result.integrationSlug) refreshOssPages(result.integrationSlug);
	} catch (error) {
		// Never fail GitHub's webhook delivery over a Discord or DB problem.
		console.error(
			'[oss-shipped] failed for PR',
			event.pull_request?.number,
			error,
		);
	}
}
