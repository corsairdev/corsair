import type { IntegrationPhase } from '@/db/schema';

export const WIP_PHASES = [
	'awaiting_issue',
	'awaiting_pr',
	'building',
] as const satisfies readonly IntegrationPhase[];

export function phaseLabel(phase: IntegrationPhase) {
	switch (phase) {
		case 'awaiting_issue':
			return 'Claimed';
		case 'awaiting_pr':
			return 'Issue linked';
		case 'building':
			return 'PR linked';
		case 'ready_to_review':
			return 'Ready to review';
		case 'finished':
			return 'Finished';
		case 'released':
			return 'Released';
	}
}

export function isIntegrationAvailable(
	phase: IntegrationPhase | null | undefined,
) {
	return phase == null || phase === 'released';
}

export function isIntegrationActivelyClaimed(
	phase: IntegrationPhase | null | undefined,
) {
	return phase != null && phase !== 'released';
}

export function isWipPhase(phase: IntegrationPhase) {
	return (WIP_PHASES as readonly IntegrationPhase[]).includes(phase);
}

/**
 * Whether a claim occupies one of the contributor's claim slots.
 *
 * Only work the contributor can still act on counts. Once a claim reaches
 * `ready_to_review` the next move belongs to a maintainer, and `finished` is
 * done for good, so neither should hold a slot the contributor cannot free.
 */
export function holdsClaimSlot(phase: IntegrationPhase | null | undefined) {
	return phase != null && isWipPhase(phase);
}

export function legacyStatusFromPhase(
	phase: IntegrationPhase | null,
): 'in_progress' | 'finished' | null {
	if (!phase || phase === 'released') return null;
	if (phase === 'finished') return 'finished';
	return 'in_progress';
}
