import { Badge } from '@/components/ui/badge';
import type { UserIntegrationStatus } from '@/db/schema';

export function IntegrationStatusBadge({
	isClaimed,
	status,
}: {
	isClaimed: boolean;
	status: UserIntegrationStatus | null;
}) {
	if (!isClaimed) {
		return <Badge variant="muted">Available</Badge>;
	}

	if (status === 'finished') {
		return <Badge variant="success">Finished</Badge>;
	}

	return <Badge variant="accent">In progress</Badge>;
}
