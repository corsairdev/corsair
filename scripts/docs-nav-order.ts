// Placement of a new plugin in docs/docs.json. Split out of
// generate-plugin-docs.ts so it can be tested.

/**
 * Where a new plugin goes in a list that is mostly, not strictly, alphabetical.
 * main has entries out of place (2Captcha filed under T as twocaptcha, a group
 * renamed in place), so "before the first larger key" or "after the last
 * smaller key" both follow a stray entry to the wrong letter. This picks the
 * gap with the fewest entries on the wrong side of it: larger keys before
 * it plus smaller keys after it. Ties go to the earliest gap.
 */
export function navInsertIndex(keys: string[], key: string): number {
	const compare = (other: string) =>
		other.localeCompare(key, undefined, { sensitivity: 'base', numeric: true });
	let misplaced = keys.filter((other) => compare(other) < 0).length;
	let best = 0;
	let bestMisplaced = misplaced;
	keys.forEach((other, index) => {
		const order = compare(other);
		if (order > 0) misplaced += 1;
		if (order < 0) misplaced -= 1;
		if (misplaced < bestMisplaced) {
			bestMisplaced = misplaced;
			best = index + 1;
		}
	});
	return best;
}
