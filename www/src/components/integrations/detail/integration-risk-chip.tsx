import type { IntegrationRiskLevel } from '@/lib/integration-page.types';
import { cn } from '@/lib/utils';

const RISK_CHIP_CLASS =
	'rounded-full border px-2 py-0.5 font-[family-name:var(--landing-font-mono)] text-[10px] font-medium uppercase tracking-[0.04em]';

const RISK_STYLES: Record<
	IntegrationRiskLevel,
	{ label: string; className: string }
> = {
	read: {
		label: 'Read-only',
		className: 'border-[#1c1c1c]/12 bg-[#1c1c1c]/5 text-[#1c1c1c66]',
	},
	write: {
		label: 'Write',
		className: 'border-amber-200/80 bg-amber-50 text-amber-900',
	},
	destructive: {
		label: 'Destructive',
		className: 'border-red-200/80 bg-red-50 text-red-800',
	},
};

export function IntegrationRiskChip({
	riskLevel,
}: {
	riskLevel: IntegrationRiskLevel;
}) {
	const style = RISK_STYLES[riskLevel];

	return (
		<span className={cn(RISK_CHIP_CLASS, style.className)}>{style.label}</span>
	);
}
