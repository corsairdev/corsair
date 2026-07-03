import { cn } from '@/lib/utils';

import { formatPoints } from './integration-reward';

type IntegrationRewardDisplayProps = {
	points: number;
	variant?: 'compact' | 'emphasis' | 'inline';
	className?: string;
	amountClassName?: string;
	labelClassName?: string;
};

export function IntegrationRewardDisplay({
	points,
	variant = 'compact',
	className,
	amountClassName,
	labelClassName,
}: IntegrationRewardDisplayProps) {
	const amount = formatPoints(points);

	if (variant === 'inline') {
		return (
			<span className={cn('whitespace-nowrap', className)}>
				<span className={cn('font-medium', amountClassName)}>{amount}</span>
				{' points'}
			</span>
		);
	}

	if (variant === 'emphasis') {
		return (
			<span className={cn('inline-flex flex-col items-center', className)}>
				<span
					className={cn(
						'font-[family-name:var(--font-landing-mono)] text-[26px] font-light leading-none tabular-nums text-[#1c1c1c]',
						amountClassName,
					)}
				>
					{amount}
				</span>
				<span
					className={cn(
						'mt-1 font-[family-name:var(--font-landing-mono)] text-[10px] text-[#1c1c1c66]',
						labelClassName,
					)}
				>
					pts
				</span>
			</span>
		);
	}

	return (
		<span className={cn('inline-flex flex-col items-end leading-none', className)}>
			<span
				className={cn(
					'font-[family-name:var(--font-landing-mono)] text-[13px] font-medium tabular-nums',
					amountClassName,
				)}
			>
				{amount}
			</span>
			<span
				className={cn(
					'mt-0.5 font-[family-name:var(--font-landing-mono)] text-[10px] text-[#1c1c1c66]',
					labelClassName,
				)}
			>
				pts
			</span>
		</span>
	);
}
