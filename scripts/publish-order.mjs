// Publish a package only after the packages it depends on *within this release*.
// `entries` are { name, deps }, deps listing dependency names also being
// published now (deps already on npm need no ordering). Post-order DFS emits
// deps before dependents; an already-emitted node is skipped, and a dependency
// cycle — which the workspace shouldn't have — falls back to input order for the
// stuck nodes rather than hanging.
export function orderForPublish(entries) {
	const byName = new Map(entries.map((e) => [e.name, e]));
	const done = new Set();
	const ordered = [];
	const visit = (entry, seen) => {
		if (done.has(entry.name) || seen.has(entry.name)) return;
		seen.add(entry.name);
		for (const dep of entry.deps) {
			const d = byName.get(dep);
			if (d) visit(d, seen);
		}
		done.add(entry.name);
		ordered.push(entry);
	};
	for (const entry of entries) visit(entry, new Set());
	return ordered;
}
