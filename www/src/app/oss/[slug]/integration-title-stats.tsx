'use client';

import { KeyIcon, LightningIcon, PlugsIcon } from '@phosphor-icons/react';

export function IntegrationTitleStats({
	operationCount,
	triggerCount,
	authSchemeCount,
}: {
	operationCount: number;
	triggerCount: number;
	authSchemeCount: number;
}) {
	return (
		<span className="inline-flex flex-wrap items-center gap-x-3 font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
			<span className="inline-flex items-center gap-1">
				<PlugsIcon size={12} aria-hidden />
				{operationCount} ops
			</span>
			<span className="inline-flex items-center gap-1">
				<LightningIcon size={12} aria-hidden />
				{triggerCount} trig
			</span>
			<span className="inline-flex items-center gap-1">
				<KeyIcon size={12} aria-hidden />
				{authSchemeCount} auth
			</span>
		</span>
	);
}
