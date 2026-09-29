'use client';

import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export function IntegrationsTopFade() {
	const [visible, setVisible] = useState(false);

	const handleScroll = useCallback(() => {
		setVisible(window.scrollY > 8);
	}, []);

	useEffect(() => {
		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	return (
		<div
			className={cn(
				'pointer-events-none fixed inset-x-0 top-0 z-40 h-28 bg-gradient-to-b from-[#f4f4f4] from-35% via-[#f4f4f4]/95 via-65% to-transparent transition-opacity duration-300 sm:h-32',
				visible ? 'opacity-100' : 'opacity-0',
			)}
			aria-hidden
		/>
	);
}
