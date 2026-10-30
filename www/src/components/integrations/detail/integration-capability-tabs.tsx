'use client';

import { useState } from 'react';

import { IntegrationRiskChip } from '@/components/integrations/detail/integration-risk-chip';
import type { IntegrationCapabilityGroup } from '@/lib/integration-page.types';
import { cn } from '@/lib/utils';

const TAB_CLASS =
	'rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors font-[family-name:var(--landing-font-sans)]';

function CapabilityActionList({
	group,
	showPopular,
}: {
	group: IntegrationCapabilityGroup;
	showPopular: boolean;
}) {
	return (
		<ul className="space-y-3">
			{group.actions.map((action) => (
				<li
					key={action.id}
					className="border-b border-[#1c1c1c]/8 pb-3 last:border-b-0 last:pb-0"
				>
					<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
						<span className="text-sm font-medium text-[#1c1c1c]">
							{action.label}
						</span>
						{action.riskLevel ? (
							<IntegrationRiskChip riskLevel={action.riskLevel} />
						) : null}
						{showPopular && action.popular ? (
							<span className="rounded-full border border-[#4a38f5]/25 bg-[#4a38f5]/8 px-2 py-0.5 font-[family-name:var(--landing-font-mono)] text-[10px] font-medium uppercase tracking-[0.04em] text-[#4a38f5]">
								Popular
							</span>
						) : null}
					</div>
					{action.description ? (
						<p className="mt-1 text-[13px] leading-relaxed text-[#1c1c1c66]">
							{action.description}
						</p>
					) : null}
				</li>
			))}
		</ul>
	);
}

export function IntegrationCapabilityTabs({
	groups,
	showPopular,
}: {
	groups: IntegrationCapabilityGroup[];
	showPopular: boolean;
}) {
	const [activeResource, setActiveResource] = useState(
		groups[0]?.resource ?? '',
	);

	if (groups.length === 0) {
		return (
			<div className="mt-5 rounded-sm border border-dashed border-[#1c1c1c]/15 bg-white px-6 py-10 text-center text-sm text-[#1c1c1c66]">
				No items listed yet.
			</div>
		);
	}

	const activeGroup =
		groups.find((group) => group.resource === activeResource) ?? groups[0];

	return (
		<div className="mt-5">
			<div
				className="flex flex-wrap gap-2"
				role="tablist"
				aria-label="Capability domains"
			>
				{groups.map((group) => (
					<button
						key={group.resource}
						type="button"
						role="tab"
						id={`capability-tab-${group.resource}`}
						aria-selected={activeGroup.resource === group.resource}
						aria-controls={`capability-panel-${group.resource}`}
						onClick={() => setActiveResource(group.resource)}
						className={cn(
							TAB_CLASS,
							activeGroup.resource === group.resource
								? 'border-[#1c1c1c] bg-[#1c1c1c] text-white'
								: 'border-[#1c1c1c]/10 bg-white text-[#1c1c1c99] hover:border-[#1c1c1c]/20 hover:text-[#1c1c1c]',
						)}
					>
						{group.resourceLabel}
					</button>
				))}
			</div>

			<div
				role="tabpanel"
				id={`capability-panel-${activeGroup.resource}`}
				aria-labelledby={`capability-tab-${activeGroup.resource}`}
				className="mt-4 rounded-sm border border-[#1c1c1c]/10 bg-white px-4 py-4 sm:px-5 sm:py-5"
			>
				<CapabilityActionList group={activeGroup} showPopular={showPopular} />
			</div>
		</div>
	);
}
