'use client';

import { useState } from 'react';

import { integrationIconUrl } from '@/lib/integrations-catalog';
import { APP_URL } from '@/lib/site-links';

/** An app's mark from /plugin-icons; its first letter when the icon fails. */
export function AppIcon({
	id,
	name,
	size = 24,
}: {
	id: string;
	name: string;
	size?: number;
}) {
	const [broken, setBroken] = useState(false);
	if (broken) {
		return (
			<span
				aria-hidden
				className="grid shrink-0 place-items-center rounded-md bg-[#1c1c1c0d] text-[11px] font-medium text-[#1c1c1c99]"
				style={{ width: size, height: size }}
			>
				{name.slice(0, 1)}
			</span>
		);
	}
	return (
		<img
			src={integrationIconUrl(id)}
			alt=""
			width={size}
			height={size}
			decoding="async"
			// The steps render only after hydration, so onError is attached before the image loads.
			onError={() => setBroken(true)}
			className="shrink-0 rounded-md object-contain"
			style={{ width: size, height: size }}
		/>
	);
}

/** An agent's mark, from Hub's icon route (as on /connect). */
export function ClientIcon({
	domain,
	size = 16,
}: {
	domain: string;
	size?: number;
}) {
	return (
		<img
			src={`${APP_URL}/icon/${domain}`}
			alt=""
			width={size}
			height={size}
			className="shrink-0 rounded-[4px]"
		/>
	);
}
