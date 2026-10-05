'use client';

import { useEffect, useId, useState } from 'react';

// mermaid pulls in its own parser and d3; importing it at module scope would
// put all of it in the server bundle for the seven pages that use it.
async function render(id: string, source: string, dark: boolean) {
	const { default: mermaid } = await import('mermaid');
	mermaid.initialize({
		startOnLoad: false,
		securityLevel: 'strict',
		theme: dark ? 'dark' : 'default',
		fontFamily: 'var(--font-sans)',
	});
	const { svg } = await mermaid.render(id, source);
	return svg;
}

function prefersDark() {
	if (typeof document === 'undefined') return false;
	const explicit = document.documentElement.getAttribute('data-theme');
	if (explicit) return explicit === 'dark';
	return document.documentElement.classList.contains('dark');
}

export function Mermaid({ chart }: { chart: string }) {
	// useId gives a stable, collision-free element id — mermaid writes a
	// temporary node under it, and two diagrams on one page must not share one.
	const id = `mermaid-${useId().replace(/:/g, '')}`;
	const [svg, setSvg] = useState<string | null>(null);
	const [failed, setFailed] = useState(false);
	const [dark, setDark] = useState(prefersDark);

	useEffect(() => {
		const root = document.documentElement;
		const sync = () => setDark(prefersDark());
		const observer = new MutationObserver(sync);
		observer.observe(root, {
			attributes: true,
			attributeFilter: ['class', 'data-theme'],
		});
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		let active = true;
		render(id, chart, dark)
			.then((out) => {
				if (active) setSvg(out);
			})
			.catch(() => {
				if (active) setFailed(true);
			});
		return () => {
			active = false;
		};
	}, [chart, dark, id]);

	// Source is still readable, so show it rather than nothing — both when the
	// diagram won't parse and on the server, where mermaid never runs.
	if (failed || (svg === null && typeof window === 'undefined')) {
		return (
			<pre className="my-4 overflow-x-auto rounded-lg border bg-fd-card p-4 text-sm">
				{chart.trim()}
			</pre>
		);
	}

	// Either the rendered SVG or the placeholder — React rejects an element
	// carrying both dangerouslySetInnerHTML and children.
	if (svg === null) {
		return (
			<figure className="not-prose my-6">
				<div className="h-32 w-full animate-pulse rounded-lg bg-fd-muted" />
			</figure>
		);
	}

	return (
		<figure
			className="not-prose my-6 flex justify-center overflow-x-auto"
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
}

export default Mermaid;
