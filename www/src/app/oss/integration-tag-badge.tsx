import Link from 'next/link';

import type { IntegrationTagSummary } from '@/db/integration-tag-definitions';
import { getTagBorderColor } from '@/lib/tag-colors';
import { cn } from '@/lib/utils';

import { buildOssHref } from './oss-url';

type IntegrationTagBadgeProps = {
	tag: IntegrationTagSummary;
	selected?: boolean;
	count?: number;
	className?: string;
	asLink?: boolean;
	disabled?: boolean;
	onClick?: () => void;
};

export function IntegrationTagBadge({
	tag,
	selected = false,
	count,
	className,
	asLink = false,
	disabled = false,
	onClick,
}: IntegrationTagBadgeProps) {
	const isFilterChip = onClick !== undefined;
	const showRemoveIcon = isFilterChip && selected;

	const content = (
		<>
			<span
				aria-hidden
				className="size-1.5 shrink-0 rounded-full"
				style={{
					backgroundColor: selected
						? '#ffffff'
						: getTagBorderColor(tag.color, 1),
				}}
			/>
			<span>{tag.name}</span>
			{showRemoveIcon ? (
				<span aria-hidden className="text-[11px] leading-none opacity-70">
					×
				</span>
			) : count !== undefined ? (
				<span
					className={cn(
						'font-[family-name:var(--font-landing-mono)] text-[10px]',
						selected ? 'text-white/60' : 'text-[#1c1c1c66]',
					)}
				>
					{count}
				</span>
			) : null}
		</>
	);

	const sharedClassName = cn(
		'inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-200',
		selected
			? 'border-[#1c1c1c] bg-[#1c1c1c] text-white'
			: 'border-[#1c1c1c1a] bg-white text-[#1c1c1c] hover:border-[#1c1c1c66]',
		className,
	);

	if (asLink) {
		return (
			<Link
				href={buildOssHref({ tags: [tag.slug] })}
				className={cn(sharedClassName, 'hover:opacity-90')}
			>
				{content}
			</Link>
		);
	}

	if (onClick) {
		return (
			<button
				type="button"
				onClick={onClick}
				disabled={disabled}
				aria-pressed={selected}
				className={cn(
					sharedClassName,
					'cursor-pointer hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
				)}
			>
				{content}
			</button>
		);
	}

	return <span className={sharedClassName}>{content}</span>;
}

type IntegrationTagListProps = {
	tags: IntegrationTagSummary[];
	className?: string;
	asLinks?: boolean;
};

export function IntegrationTagList({
	tags,
	className,
	asLinks = true,
}: IntegrationTagListProps) {
	if (tags.length === 0) return null;

	return (
		<div className={cn('flex flex-wrap gap-1.5', className)}>
			{tags.map((tag) => (
				<IntegrationTagBadge key={tag.slug} tag={tag} asLink={asLinks} />
			))}
		</div>
	);
}
