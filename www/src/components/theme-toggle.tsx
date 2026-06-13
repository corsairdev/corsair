'use client';

import { useCallback, useEffect, useState } from 'react';

function SunIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className={className}
		>
			<path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.061-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.061-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.061ZM5.404 6.464a.75.75 0 0 0 1.06-1.06L5.404 4.343a.75.75 0 0 0-1.06 1.06l1.06 1.061Z" />
		</svg>
	);
}

function MoonIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className={className}
		>
			<path
				fillRule="evenodd"
				d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

const STORAGE_KEY = 'corsair-theme';

function getScope() {
	return document.querySelector('[data-theme-scope]');
}

export function ThemeToggle() {
	const [dark, setDark] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setDark(getScope()?.classList.contains('dark') ?? false);
		setMounted(true);
	}, []);

	const toggle = useCallback(() => {
		const scope = getScope();
		if (!scope) return;
		const next = !scope.classList.contains('dark');
		scope.classList.toggle('dark', next);
		setDark(next);
		try {
			localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
		} catch {}
	}, []);

	if (!mounted) {
		return <div className="size-7" />;
	}

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
			className="inline-flex size-7 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
		>
			{dark ? (
				<SunIcon className="size-3.5" />
			) : (
				<MoonIcon className="size-3.5" />
			)}
		</button>
	);
}
