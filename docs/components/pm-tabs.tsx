'use client';

import { useEffect, useState } from 'react';
import { getState, setState, subscribe } from '@/lib/quick-start-store';

const PM_STORAGE_KEY = 'corsair-docs-pm';
const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const;
type PM = (typeof PMS)[number];

function getCommand(pm: PM, props: PmTabsProps): string {
	if (props.install !== undefined) {
		const pkgs = props.install;
		if (props.dev) {
			if (pm === 'yarn') return `yarn add --dev ${pkgs}`;
			if (pm === 'bun') return `bun add --dev ${pkgs}`;
			return `${pm} install --save-dev ${pkgs}`;
		}
		if (pm === 'yarn') return `yarn add ${pkgs}`;
		if (pm === 'bun') return `bun add ${pkgs}`;
		return `${pm} install ${pkgs}`;
	}
	if (props.run !== undefined) {
		if (pm === 'npm') return `npx ${props.run}`;
		if (pm === 'pnpm') return `pnpm ${props.run}`;
		if (pm === 'yarn') return `yarn ${props.run}`;
		if (pm === 'bun') return `bunx ${props.run}`;
	}
	if (props.create !== undefined) {
		const spaceIdx = props.create.indexOf(' ');
		const pkg =
			spaceIdx === -1 ? props.create : props.create.slice(0, spaceIdx);
		const args = spaceIdx === -1 ? '' : props.create.slice(spaceIdx + 1);
		// if (pm === 'npm') return args ? `npm create ${pkg} -- ${args}` : `npm create ${pkg}`;
		return args ? `${pm} create ${pkg} ${args}` : `${pm} create ${pkg}`;
	}
	return '';
}

interface PmTabsProps {
	install?: string;
	dev?: boolean;
	run?: string;
	create?: string;
}

export function PmTabs(props: PmTabsProps) {
	const [pm, setPm] = useState<PM>(() => getState().pm as PM);
	const [copied, setCopied] = useState(false);

	// Sync with localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(PM_STORAGE_KEY) as PM | null;
		if (stored && (PMS as readonly string[]).includes(stored)) {
			setState({ pm: stored });
		}
	}, []);

	// Subscribe to store changes (other PmTabs instances updating)
	useEffect(() => {
		return subscribe(() => {
			const next = getState().pm as PM;
			setPm(next);
		});
	}, []);

	function handleSelect(value: PM) {
		localStorage.setItem(PM_STORAGE_KEY, value);
		setState({ pm: value });
	}

	const command = getCommand(pm, props);

	function handleCopy() {
		navigator.clipboard.writeText(command);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className="my-4 text-sm not-prose rounded-lg border border-fd-border overflow-hidden">
			{/* Tab row */}
			<div className="flex gap-3 px-4 pt-2 border-b border-fd-border bg-fd-card">
				{PMS.map((p) => (
					<button
						key={p}
						onClick={() => handleSelect(p)}
						className={[
							'pb-2 text-xs font-medium border-b-2 -mb-px transition-colors cursor-pointer',
							pm === p
								? 'border-fd-primary text-fd-foreground'
								: 'border-transparent text-fd-muted-foreground hover:text-fd-foreground',
						].join(' ')}
					>
						{p}
					</button>
				))}
			</div>
			{/* Code + copy row */}
			<div className="flex items-center justify-between px-4 py-3 bg-fd-card">
				<code className="font-mono text-sm text-fd-foreground">{command}</code>
				<button
					onClick={handleCopy}
					aria-label="Copy command"
					className="ml-4 shrink-0 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
				>
					{copied ? (
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
					) : (
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
							<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
						</svg>
					)}
				</button>
			</div>
		</div>
	);
}
