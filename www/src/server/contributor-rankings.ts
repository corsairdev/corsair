import { eq, inArray } from 'drizzle-orm';

import type { DB } from '@/db';
import { user } from '@/db/auth-schema';
import {
	getLatestStatusesForIntegrations,
	isIntegrationActivelyClaimed,
} from '@/db/integration-status';
import type { IntegrationPhase } from '@/db/schema';
import { integrations } from '@/db/schema';

export type ContributorIntegration = {
	id: string;
	name: string;
	slug: string;
	points: number;
	phase: IntegrationPhase;
};

export type ContributorRankingEntry = {
	userId: string;
	githubUsername: string | null;
	totalPoints: number;
	completedPoints: number;
	pendingPoints: number;
	integrations: ContributorIntegration[];
};

function summarizeIntegrations(integrationsList: ContributorIntegration[]) {
	const completedPoints = integrationsList
		.filter((integration) => integration.phase === 'finished')
		.reduce((sum, integration) => sum + integration.points, 0);
	const pendingPoints = integrationsList
		.filter((integration) => integration.phase !== 'finished')
		.reduce((sum, integration) => sum + integration.points, 0);

	return {
		completedPoints,
		pendingPoints,
		totalPoints: completedPoints + pendingPoints,
	};
}

export async function buildContributorRankings(
	db: DB,
): Promise<ContributorRankingEntry[]> {
	const visibleRows = await db
		.select({
			id: integrations.id,
			name: integrations.name,
			slug: integrations.slug,
			points: integrations.points,
		})
		.from(integrations)
		.where(eq(integrations.show, true));

	const latestStatuses = await getLatestStatusesForIntegrations(
		db,
		visibleRows.map((row) => row.id),
	);

	const integrationsById = new Map(visibleRows.map((row) => [row.id, row]));

	const userClaims = new Map<string, ContributorIntegration[]>();

	for (const status of latestStatuses.values()) {
		if (!isIntegrationActivelyClaimed(status.phase)) continue;

		const integration = integrationsById.get(status.integrationId);
		if (!integration) continue;

		const existing = userClaims.get(status.userId) ?? [];
		existing.push({
			id: integration.id,
			name: integration.name,
			slug: integration.slug,
			points: integration.points,
			phase: status.phase,
		});
		userClaims.set(status.userId, existing);
	}

	const userIds = [...userClaims.keys()];
	const users =
		userIds.length > 0
			? await db
					.select({
						id: user.id,
						githubUsername: user.githubUsername,
					})
					.from(user)
					.where(inArray(user.id, userIds))
			: [];

	return users
		.map((row) => {
			const contributorIntegrations = (
				userClaims.get(row.id) ?? []
			).sort((left, right) => left.name.localeCompare(right.name));
			const totals = summarizeIntegrations(contributorIntegrations);

			return {
				userId: row.id,
				githubUsername: row.githubUsername ?? null,
				integrations: contributorIntegrations,
				...totals,
			};
		})
		.sort((left, right) => right.totalPoints - left.totalPoints);
}

export function getContributorRank(
	rankings: ContributorRankingEntry[],
	userId: string,
): number | null {
	const index = rankings.findIndex((entry) => entry.userId === userId);
	return index === -1 ? null : index + 1;
}
