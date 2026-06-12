import Link from 'next/link';

import type { IntegrationTagSummary } from '@/db/integration-tag-definitions';
import { getTagBorderColor, getTagTextColor } from '@/lib/tag-colors';
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
	const textColor = getTagTextColor(tag.color);
	const isFilterChip = onClick !== undefined;
	const showRemoveIcon = isFilterChip && selected;

	const style = {
		backgroundColor: tag.color,
		color: textColor,
		borderColor: showRemoveIcon
			? 'transparent'
			: getTagBorderColor(tag.color, 0.45),
	};

	const content = (
		<>
			<span>{tag.name}</span>
			{showRemoveIcon ? (
				<span aria-hidden className="text-[11px] leading-none opacity-80">
					×
				</span>
			) : count !== undefined ? (
				<span className="font-mono text-[10px] opacity-70">{count}</span>
			) : null}
		</>
	);

	const sharedClassName = cn(
		'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all',
		showRemoveIcon && 'border-transparent',
		className,
	);

	if (asLink) {
		return (
			<Link
				href={buildOssHref({ tags: [tag.slug] })}
				className={cn(sharedClassName, 'hover:opacity-90')}
				style={style}
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
				style={style}
			>
				{content}
			</button>
		);
	}

	return (
		<span className={sharedClassName} style={style}>
			{content}
		</span>
	);
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
