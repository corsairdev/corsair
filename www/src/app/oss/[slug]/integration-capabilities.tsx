'use client';

import { CaretDown, KeyIcon, LightningIcon, PlugsIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { FramedPanel } from '../framed-panel';
import { IntegrationAuthSchemeList } from './integration-auth-scheme-list';
import { IntegrationCapabilityList } from './integration-capability-list';

type Operation = {
	id: string;
	name: string;
	slug: string;
	description: string;
	isDeprecated: boolean;
};

type Trigger = {
	id: string;
	name: string;
	slug: string;
	description: string;
	type: string;
};

type AuthScheme = {
	id: string;
	mode: string;
	name: string;
};

function CollapsibleSection({
	title,
	count,
	icon,
	children,
}: {
	title: string;
	count: number;
	icon: ReactNode;
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);

	return (
		<details
			open={open}
			onToggle={(event) => setOpen(event.currentTarget.open)}
			className="group border-b border-[#1c1c1c0d] last:border-b-0"
		>
			<style>{`summary::-webkit-details-marker { display: none; }`}</style>
			<summary
				className={cn(
					'flex cursor-pointer list-none items-center gap-2 bg-[#1c1c1c]/[0.02] px-4 py-2.5 select-none transition-colors sm:px-6',
					'hover:bg-[#1c1c1c]/[0.04]',
				)}
			>
				<CaretDown
					size={12}
					aria-hidden
					className="shrink-0 text-[#1c1c1c66] transition-transform duration-150"
					style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
				/>
				<span className="inline-flex shrink-0 text-[#1c1c1c66]">{icon}</span>
				<span className="text-[13px] font-medium text-[#1c1c1c]">{title}</span>
				<span className="ml-auto font-[family-name:var(--font-landing-mono)] text-[11px] tabular-nums text-[#1c1c1c66]">
					{count}
				</span>
			</summary>
			{children}
		</details>
	);
}

export function IntegrationCapabilities({
	operations,
	triggers,
	authSchemes,
	operationCount,
	triggerCount,
	authSchemeCount,
}: {
	operations: Operation[];
	triggers: Trigger[];
	authSchemes: AuthScheme[];
	operationCount: number;
	triggerCount: number;
	authSchemeCount: number;
}) {
	return (
		<section>
			<h2 className="mb-4 font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
				API surface
			</h2>

			<FramedPanel className="overflow-hidden">
				<CollapsibleSection
					title="Operations"
					count={operationCount}
					icon={<PlugsIcon size={14} aria-hidden />}
				>
					<IntegrationCapabilityList
						items={operations.map((operation) => ({
							id: operation.id,
							name: operation.name,
							slug: operation.slug,
							description: operation.description,
							badge: operation.isDeprecated ? 'deprecated' : undefined,
						}))}
						emptyMessage="No operations."
					/>
				</CollapsibleSection>

				<CollapsibleSection
					title="Webhooks"
					count={triggerCount}
					icon={<LightningIcon size={14} aria-hidden />}
				>
					<IntegrationCapabilityList
						items={triggers.map((trigger) => ({
							id: trigger.id,
							name: trigger.name,
							slug: trigger.slug,
							description: trigger.description,
							badge: trigger.type,
						}))}
						emptyMessage="No webhooks."
					/>
				</CollapsibleSection>

				<CollapsibleSection
					title="Auth types"
					count={authSchemeCount}
					icon={<KeyIcon size={14} aria-hidden />}
				>
					<IntegrationAuthSchemeList
						items={authSchemes}
						emptyMessage="No auth types."
					/>
				</CollapsibleSection>
			</FramedPanel>
		</section>
	);
}
