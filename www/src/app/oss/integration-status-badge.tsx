import { Badge } from '@/components/ui/badge';
import type { IntegrationPhase } from '@/db/schema';

export function IntegrationStatusBadge({
	isClaimed,
	phase,
	status,
}: {
	isClaimed: boolean;
	phase?: IntegrationPhase | null;
	status?: 'in_progress' | 'finished' | null;
}) {
	if (!isClaimed) {
		return <Badge variant="muted">Available</Badge>;
	}

	const resolvedPhase = phase ?? (status === 'finished' ? 'finished' : 'building');

	switch (resolvedPhase) {
		case 'awaiting_issue':
			return <Badge variant="warning">Awaiting issue</Badge>;
		case 'awaiting_pr':
			return <Badge variant="warning">Awaiting PR</Badge>;
		case 'building':
			return <Badge variant="accent">In progress</Badge>;
		case 'ready_to_review':
			return <Badge variant="accent">Ready to review</Badge>;
		case 'finished':
			return <Badge variant="success">Finished</Badge>;
		default:
			return <Badge variant="accent">In progress</Badge>;
	}
}
