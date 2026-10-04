import type { ReactNode } from 'react';

/**
 * ponytail: `mermaid` is not a dependency, so this renders the diagram source
 * instead of a diagram. Swap the body for a client-side `mermaid.render` call
 * once the package is installed.
 */
export function Mermaid({ chart, children }: { chart?: string; children?: ReactNode }) {
	const source = chart ?? (typeof children === 'string' ? children : '');

	return (
		<figure className="not-prose my-4 overflow-x-auto rounded-lg border bg-fd-card p-4">
			<figcaption className="mb-2 text-fd-muted-foreground text-xs uppercase tracking-wide">
				Diagram (mermaid source)
			</figcaption>
			<pre className="text-sm leading-relaxed">{source.trim()}</pre>
		</figure>
	);
}

export default Mermaid;
