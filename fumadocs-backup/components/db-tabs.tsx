'use client';

import type { ReactNode } from 'react';
import { Children, useState } from 'react';
import { setState } from '@/lib/quick-start-store';

interface DbTabsProps {
	children: ReactNode;
}

export function DbTabs({ children }: DbTabsProps) {
	const panels = Children.toArray(children).filter(
		(c): c is React.ReactElement =>
			typeof c === 'object' &&
			c !== null &&
			'props' in c &&
			'value' in (c as any).props,
	);

	const [active, setActive] = useState(
		(panels[0] as any)?.props?.value ?? 'SQLite',
	);

	function handleSelect(value: string) {
		setActive(value);
		setState({ db: value });
	}

	return (
		<div className="my-4">
			<div className="flex border-b border-fd-border mb-4">
				{panels.map((panel) => {
					const value = (panel as any).props.value as string;
					const isActive = active === value;
					return (
						<button
							key={value}
							onClick={() => handleSelect(value)}
							className={[
								'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer',
								isActive
									? 'border-fd-primary text-fd-foreground'
									: 'border-transparent text-fd-muted-foreground hover:text-fd-foreground',
							].join(' ')}
						>
							{value}
						</button>
					);
				})}
			</div>
			{panels.map((panel) => {
				const value = (panel as any).props.value as string;
				if (value !== active) return null;
				return <div key={value}>{(panel as any).props.children}</div>;
			})}
		</div>
	);
}

interface DbPanelProps {
	value: string;
	children: ReactNode;
}

// DbPanel is a marker component — DbTabs reads its children directly
export function DbPanel({ children }: DbPanelProps) {
	return <>{children}</>;
}
