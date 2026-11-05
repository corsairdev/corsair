'use client';

import { useEffect, useState } from 'react';

// Same idea as lug.dev's field: when it's empty, it types out names a visitor
// might claim, so it reads as an invitation rather than a label.
const NAMES = [
	'acme',
	'northstar',
	'pixel',
	'harbor',
	'studio',
	'relay',
	'atlas',
	'foundry',
] as const;

export function TypewriterPlaceholder() {
	// Before mount (and with reduced motion) it shows the first name, so the
	// server render and the first client render match.
	const [animate, setAnimate] = useState(false);
	const [wordIndex, setWordIndex] = useState(0);
	const [text, setText] = useState('');
	const [deleting, setDeleting] = useState(false);

	// Follows the setting live: turning on reduced motion stops the typing
	// (the effect below clears its timer) and shows the first name.
	useEffect(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => setAnimate(!query.matches);
		update();
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	}, []);

	useEffect(() => {
		if (!animate) return;
		const word = NAMES[wordIndex % NAMES.length];
		const doneTyping = !deleting && text === word;
		const doneDeleting = deleting && text === '';

		let wait = deleting ? 38 : 72;
		if (doneTyping) wait = 2200;
		if (doneDeleting) wait = 420;

		const timer = window.setTimeout(() => {
			if (doneDeleting) {
				setDeleting(false);
				setWordIndex((index) => (index + 1) % NAMES.length);
			} else if (doneTyping) {
				setDeleting(true);
			} else {
				setText(
					deleting
						? word.slice(0, text.length - 1)
						: word.slice(0, text.length + 1),
				);
			}
		}, wait);
		return () => window.clearTimeout(timer);
	}, [animate, deleting, text, wordIndex]);

	return <span className="opacity-35">{animate ? text : NAMES[0]}</span>;
}
