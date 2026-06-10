'use client';

import { LightningIcon, PlugsIcon } from '@phosphor-icons/react';

import { Badge } from '@/components/ui/badge';

export function IntegrationTitleStats({
	operationCount,
	triggerCount,
}: {
	operationCount: number;
	triggerCount: number;
}) {
	return (
		<span className="inline-flex items-center gap-1.5">
			<Badge variant="outline" className="gap-1 font-mono">
				<PlugsIcon size={12} aria-hidden />
				{operationCount}
			</Badge>
			<Badge variant="outline" className="gap-1 font-mono">
				<LightningIcon size={12} aria-hidden />
				{triggerCount}
			</Badge>
		</span>
	);
}
