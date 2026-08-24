// Publish a package only after the packages it depends on *within this release*.
// `entries` are { name, deps }, deps listing dependency names also being
// published now (deps already on npm need no ordering). Post-order DFS emits
// deps before dependents. A dependency cycle is a malformed release graph —
// throw rather than linearize it, since a linearized cycle would let a member
// publish before a later member fails, defeating the failed-dependency guard.
export function orderForPublish(entries) {
	const byName = new Map(entries.map((e) => [e.name, e]));
	const done = new Set();
	const visiting = new Set();
	const ordered = [];
	const visit = (entry) => {
		if (done.has(entry.name)) return;
		if (visiting.has(entry.name)) {
			throw new Error(`Dependency cycle includes ${entry.name}`);
		}
		visiting.add(entry.name);
		for (const dep of entry.deps) {
			const d = byName.get(dep);
			if (d) visit(d);
		}
		visiting.delete(entry.name);
		done.add(entry.name);
		ordered.push(entry);
	};
	for (const entry of entries) visit(entry);
	return ordered;
}
