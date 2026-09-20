'use client';

import Image from 'next/image';
import { useState } from 'react';

import { integrationIconUrl } from '@/lib/integrations-catalog';
import { cn } from '@/lib/utils';

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
			style={{ width: size, height: size }}
		>
			<Image
				src={integrationIconUrl(id)}
				alt=""
				width={size}
				height={size}
				className="h-full w-full object-contain p-1.5"
				onError={() => setFailed(true)}
				unoptimized
			/>
		</span>
	);
}
