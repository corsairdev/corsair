import { db } from '@/db';
import {
	getLatestStatusForIntegration,
	releaseIntegrationClaim,
} from '@/db/integration-status';

import { inngest } from './client';

const ONE_HOUR = '1 hour';
const THREE_HOURS = '3 hours';

async function releaseIfPhaseMatches(
	integrationId: string,
	userId: string,
	expectedPhase: 'awaiting_issue' | 'awaiting_pr',
	reason: 'issue_timeout' | 'pr_timeout',
) {
	const latest = await getLatestStatusForIntegration(db, integrationId);

	if (!latest || latest.userId !== userId || latest.phase !== expectedPhase) {
		return { released: false };
	}

	await releaseIntegrationClaim(db, {
		integrationId,
		userId,
		reason,
	});

	return { released: true };
}

export const issueDeadlineFunction = inngest.createFunction(
	{
		id: 'integration-issue-deadline',
		cancelOn: [
			{
				event: 'integration/issue.linked',
				match: 'data.integrationId',
			},
			{
				event: 'integration/pr.linked',
				match: 'data.integrationId',
			},
		],
	},
	{ event: 'integration/claim.created' },
	async ({ event, step }) => {
		await step.sleep('wait-for-issue-deadline', ONE_HOUR);

		return step.run('release-if-issue-missing', async () => {
			const result = await releaseIfPhaseMatches(
				event.data.integrationId,
				event.data.userId,
				'awaiting_issue',
				'issue_timeout',
			);

			if (result.released) {
				const { clearContributorIntegrationUrls } = await import(
					'@/db/integration-urls'
				);
				await clearContributorIntegrationUrls(db, event.data.integrationId);
			}

			return result;
		});
	},
);

export const prDeadlineFunction = inngest.createFunction(
	{
		id: 'integration-pr-deadline',
		cancelOn: [
			{
				event: 'integration/pr.linked',
				match: 'data.integrationId',
			},
		],
	},
	{ event: 'integration/issue.linked' },
	async ({ event, step }) => {
		await step.sleep('wait-for-pr-deadline', THREE_HOURS);

		return step.run('release-if-pr-missing', async () => {
			const result = await releaseIfPhaseMatches(
				event.data.integrationId,
				event.data.userId,
				'awaiting_pr',
				'pr_timeout',
			);

			if (result.released) {
				const { clearContributorIntegrationUrls } = await import(
					'@/db/integration-urls'
				);
				await clearContributorIntegrationUrls(db, event.data.integrationId);
			}

			return result;
		});
	},
);

export const expiredClaimsCronFunction = inngest.createFunction(
	{ id: 'integration-expired-claims-cron' },
	{ cron: '*/30 * * * *' },
	async ({ step }) => {
		return step.run('release-expired-claims', async () => {
			const { getExpiredDeadlineClaims } = await import(
				'@/db/integration-status'
			);
			const { clearContributorIntegrationUrls } = await import(
				'@/db/integration-urls'
			);

			const expired = await getExpiredDeadlineClaims(db);
			let released = 0;

			for (const claim of expired) {
				const reason =
					claim.phase === 'awaiting_issue' ? 'issue_timeout' : 'pr_timeout';
				const result = await releaseIntegrationClaim(db, {
					integrationId: claim.integrationId,
					userId: claim.userId,
					reason,
				});

				if (result) {
					await clearContributorIntegrationUrls(db, claim.integrationId);
					released += 1;
				}
			}

			return { released };
		});
	},
);

export const functions = [
	issueDeadlineFunction,
	prDeadlineFunction,
	expiredClaimsCronFunction,
];
