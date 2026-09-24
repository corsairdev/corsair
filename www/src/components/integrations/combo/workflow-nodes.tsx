import { IntegrationLogo } from '@/components/integrations/integration-logo';
import type { ComboAction, ComboTrigger } from '@/lib/combo-types';
import { cn } from '@/lib/utils';

const ACCENT: Record<string, string> = {
	slack: '#4A154B',
	linear: '#5E6AD2',
};

function Handle({
	kind,
	placement,
}: {
	kind: 'trigger' | 'action';
	placement: 'side' | 'end';
}) {
	const side =
		kind === 'trigger'
			? placement === 'side'
				? 'absolute top-1/2 right-0 hidden h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 sm:block'
				: 'absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 sm:hidden'
			: placement === 'side'
				? 'absolute top-1/2 left-0 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 sm:block'
				: 'absolute top-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 sm:hidden';

	return (
		<span
			aria-hidden
			className={`${side} rounded-full border-2 border-white bg-[#4a38f5] shadow-[0_0_0_1px_#4a38f533]`}
		/>
	);
}

function FlowNode({
	appId,
	displayName,
	role,
	label,
	kind,
	compact,
}: {
	appId: string;
	displayName: string;
	role: string;
	label: string;
	kind: 'trigger' | 'action';
	compact: boolean;
}) {
	const accent = ACCENT[appId] ?? '#4a38f5';
	return (
		<div
			className={cn(
				'relative flex min-w-0 flex-1 items-stretch rounded-md border border-[#1c1c1c]/12 bg-white shadow-[0_1px_2px_rgba(28,28,28,0.04),0_8px_24px_rgba(28,28,28,0.06)]',
				compact ? 'w-full' : 'w-full max-w-[240px]',
			)}
			style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
		>
			<Handle kind={kind} placement="end" />
			<div
				className={cn(
					'flex min-w-0 flex-1 items-center',
					compact ? 'gap-2 px-2 py-2' : 'gap-2.5 px-2.5 py-2.5',
				)}
			>
				<IntegrationLogo
					id={appId}
					displayName={displayName}
					size={compact ? 28 : 36}
					className="rounded-md"
				/>
				<span className="min-w-0 text-left">
					<span className="block font-[family-name:var(--landing-font-mono)] text-[10px] uppercase tracking-[0.06em] text-[#1c1c1c66]">
						{role}
					</span>
					<span className="block truncate text-[13px] font-semibold leading-tight text-[#1c1c1c]">
						{label}
					</span>
					{compact ? null : (
						<span className="mt-0.5 block truncate text-[11px] text-[#1c1c1c66]">
							{displayName}
						</span>
					)}
				</span>
			</div>
			<Handle kind={kind} placement="side" />
		</div>
	);
}

export function WorkflowNodePair({
	trigger,
	action,
	compact = false,
}: {
	trigger: ComboTrigger;
	action: ComboAction;
	compact?: boolean;
}) {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center sm:flex-row',
				compact ? 'px-3 py-5 sm:px-4' : 'px-4 py-7 sm:px-6',
			)}
			style={{
				backgroundImage:
					'radial-gradient(circle, #1c1c1c22 1px, transparent 1px)',
				backgroundSize: '18px 18px',
			}}
			role="img"
			aria-label={`Workflow diagram: ${trigger.appLabel} ${trigger.label} triggers ${action.appLabel} ${action.label}`}
		>
			<FlowNode
				appId={trigger.app}
				displayName={trigger.appLabel}
				role="Trigger"
				label={trigger.label}
				kind="trigger"
				compact={compact}
			/>
			<div
				aria-hidden
				className={cn(
					'flex shrink-0 items-center justify-center',
					compact
						? 'h-5 w-px flex-col sm:h-auto sm:w-6 sm:flex-row'
						: 'h-6 w-px flex-col sm:mx-0.5 sm:h-auto sm:w-10 sm:flex-row md:w-12',
				)}
			>
				<span className="h-full w-px bg-[#4a38f5]/40 sm:h-px sm:w-auto sm:flex-1" />
				<span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-[#4a38f5] sm:block" />
				<span className="hidden h-px flex-1 bg-[#4a38f5]/40 sm:block" />
			</div>
			<FlowNode
				appId={action.app}
				displayName={action.appLabel}
				role="Action"
				label={action.label}
				kind="action"
				compact={compact}
			/>
		</div>
	);
}
