'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * @description if you want the snap animation on a element, add data-cursor="btn" to the element
 */

export function CustomCursor() {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const visualRef = useRef<HTMLDivElement>(null);
	
	const [isEnabled, setIsEnabled] = useState(false);

	const mouseRef = useRef({ x: 0, y: 0 });
	
	const hoveredElRef = useRef<HTMLElement | null>(null);
	const hoveredRadiusRef = useRef(0);

	const animationRef = useRef({
		// Current values
		currentX: 0,
		currentY: 0,
		currentWidth: 32,
		currentHeight: 32,
		currentRadius: 16,
		
		isHovered: false,
		hasMoved: false,
	});

	useEffect(() => {
		const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
		setIsEnabled(mediaQuery.matches);

		const handleMediaChange = (e: MediaQueryListEvent) => {
			setIsEnabled(e.matches);
		};
		mediaQuery.addEventListener('change', handleMediaChange);

		return () => {
			mediaQuery.removeEventListener('change', handleMediaChange);
		};
	}, []);

	useEffect(() => {
		if (!isEnabled) return;

		const padding = 4; // Padding around hovered elements
		const defaultSize = 32;

		const handleMouseMove = (e: MouseEvent) => {
			const anim = animationRef.current;
			
			if (!anim.hasMoved) {
				anim.hasMoved = true;
				anim.currentX = e.clientX - defaultSize / 2;
				anim.currentY = e.clientY - defaultSize / 2;
				if (wrapperRef.current) {
					wrapperRef.current.style.opacity = '1';
				}
			}

			mouseRef.current.x = e.clientX;
			mouseRef.current.y = e.clientY;
		};

		const handleMouseOver = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const clickable = target.closest('[data-cursor="btn"]');
			
			if (clickable && clickable instanceof HTMLElement) {
				hoveredElRef.current = clickable;
				animationRef.current.isHovered = true;

				// Cache the border radius once on hover start
				const computedStyle = window.getComputedStyle(clickable);
				const computedRadius = parseFloat(computedStyle.borderRadius) || 0;
				hoveredRadiusRef.current = computedRadius;
				
				if (visualRef.current) {
					visualRef.current.classList.add('is-hovered');
				}
			}
		};

		const handleMouseOut = (e: MouseEvent) => {
			const relatedTarget = e.relatedTarget as HTMLElement;
			const currentTarget = hoveredElRef.current;

			if (currentTarget && (!relatedTarget || !currentTarget.contains(relatedTarget))) {
				hoveredElRef.current = null;
				animationRef.current.isHovered = false;
				hoveredRadiusRef.current = 0;
				
				if (visualRef.current) {
					visualRef.current.classList.remove('is-hovered');
				}
			}
		};

		const handleMouseLeave = () => {
			if (wrapperRef.current) {
				wrapperRef.current.style.opacity = '0';
			}
		};

		const handleMouseEnter = () => {
			if (wrapperRef.current && animationRef.current.hasMoved) {
				wrapperRef.current.style.opacity = '1';
			}
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseover', handleMouseOver);
		document.addEventListener('mouseout', handleMouseOut);
		document.addEventListener('mouseleave', handleMouseLeave);
		document.addEventListener('mouseenter', handleMouseEnter);

		let rafId: number;

		const updateCursor = () => {
			const anim = animationRef.current;
			const mouse = mouseRef.current;

			if (anim.isHovered && hoveredElRef.current) {
				const rect = hoveredElRef.current.getBoundingClientRect();
				anim.currentWidth = rect.width + padding * 2;
				anim.currentHeight = rect.height + padding * 2;
				anim.currentX = rect.left - padding;
				anim.currentY = rect.top - padding;
				anim.currentRadius = hoveredRadiusRef.current + padding;
			} else {
				anim.currentWidth = defaultSize;
				anim.currentHeight = defaultSize;
				anim.currentX = mouse.x - defaultSize / 2;
				anim.currentY = mouse.y - defaultSize / 2;
				anim.currentRadius = defaultSize / 2;
			}

			if (wrapperRef.current) {
				wrapperRef.current.style.transform = `translate3d(${anim.currentX}px, ${anim.currentY}px, 0)`;
				wrapperRef.current.style.width = `${anim.currentWidth}px`;
				wrapperRef.current.style.height = `${anim.currentHeight}px`;
				wrapperRef.current.style.borderRadius = `${anim.currentRadius}px`;
			}

			rafId = requestAnimationFrame(updateCursor);
		};

		rafId = requestAnimationFrame(updateCursor);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseover', handleMouseOver);
			document.removeEventListener('mouseout', handleMouseOut);
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('mouseenter', handleMouseEnter);
			cancelAnimationFrame(rafId);
		};
	}, [isEnabled]);

	if (!isEnabled) return null;

	return (
		<div 
			ref={wrapperRef} 
			className="custom-cursor-wrapper"
			style={{ opacity: 0, transition: 'opacity 0.25s ease' }}
		>
			<div ref={visualRef} className="custom-cursor-visual">
				<div className="custom-cursor-orbit" />
				
				<svg
					className="custom-cursor-sparkle"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M12 3C12 7.97056 7.97056 12 3 12C7.97056 12 12 16.0294 12 21C12 16.0294 16.0294 12 21 12C16.0294 12 12 7.97056 12 3Z" />
				</svg>
			</div>
		</div>
	);
}
