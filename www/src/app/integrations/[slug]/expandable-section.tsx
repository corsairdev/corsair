'use client';

import { CaretDown } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function ExpandableSection({
	title,
	count,
	icon,
	children,
	defaultOpen = false,
}: {
	title: string;
	count: number;
	icon?: ReactNode;
	children: ReactNode;
	defaultOpen?: boolean;
}) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<details
			open={defaultOpen}
			onToggle={(event) => setOpen(event.currentTarget.open)}
			className="mb-4 overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
		>
			<style>{`summary::-webkit-details-marker { display: none; }`}</style>
			<summary
				className={cn(
					'flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold select-none transition-colors',
					'hover:bg-muted/30',
				)}
			>
				<CaretDown
					size={14}
					aria-hidden
					className="shrink-0 transition-transform duration-150"
					style={{
						transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
					}}
				/>
				{icon ? (
					<span className="inline-flex shrink-0 text-muted-foreground">
						{icon}
					</span>
				) : null}
				<span className="flex-1">{title}</span>
				<Badge variant="muted" className="font-mono text-[10px]">
					{count}
				</Badge>
			</summary>
			<div className="border-t border-border/60 px-4 pb-4">{children}</div>
		</details>
	);
}
