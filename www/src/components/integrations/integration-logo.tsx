'use client';

import Image from 'next/image';
import { useState } from 'react';

import { integrationIconUrl } from '@/lib/integrations-catalog';
import { cn } from '@/lib/utils';

const OFFICIAL_ICONS: Record<string, { src: string; fit: 'glyph' | 'tile' }> =
	{
		slack: { src: '/brand/slack.svg', fit: 'glyph' },
		linear: { src: '/brand/linear.svg', fit: 'tile' },
	};

function hashColor(id: string): string {
	let hash = 0;
	for (let i = 0; i < id.length; i += 1) {
		hash = id.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = Math.abs(hash) % 360;
	return `hsl(${hue} 42% 42%)`;
}

function InitialFallback({
	displayName,
	id,
	size,
	className,
}: {
	displayName: string;
	id: string;
	size: number;
	className?: string;
}) {
	const initial = displayName.trim().charAt(0).toUpperCase() || '?';

	return (
		<span
			className={cn(
				'inline-flex shrink-0 items-center justify-center rounded-sm font-[family-name:var(--landing-font-sans)] font-semibold text-white',
				className,
			)}
			style={{
				width: size,
				height: size,
				backgroundColor: hashColor(id),
				fontSize: Math.max(11, Math.round(size * 0.42)),
			}}
			aria-hidden
		>
			{initial}
		</span>
	);
}

function insetFor(size: number, fit?: 'glyph' | 'tile') {
	if (fit === 'tile') return 0;
	if (fit === 'glyph') {
		if (size <= 20) return 3;
		if (size <= 36) return 6;
		return Math.round(size * 0.14);
	}
	if (size <= 20) return 1;
	if (size <= 36) return 2;
	return 4;
}

export function IntegrationLogo({
	id,
	displayName,
	size = 40,
	className,
}: {
	id: string;
	displayName: string;
	size?: number;
	className?: string;
}) {
	const [failed, setFailed] = useState(false);
	const official = OFFICIAL_ICONS[id];
	const inset = insetFor(size, official?.fit);

	if (failed) {
		return (
			<InitialFallback
				id={id}
				displayName={displayName}
				size={size}
				className={className}
			/>
		);
	}

	return (
		<span
			className={cn(
				'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-sm border border-[#1c1c1c]/8 bg-white',
				className,
			)}
			style={{ width: size, height: size, padding: inset }}
		>
			{official ? (
				<img
					src={official.src}
					alt=""
					width={size}
					height={size}
					className="h-full w-full object-contain"
					draggable={false}
				/>
			) : (
				<Image
					src={integrationIconUrl(id)}
					alt=""
					width={size * 2}
					height={size * 2}
					className="h-full w-full object-contain"
					onError={() => setFailed(true)}
					unoptimized
				/>
			)}
		</span>
	);
}
