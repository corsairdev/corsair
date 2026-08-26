// npm/pnpm reject re-publishing an existing version with E403. npm's registry
// read replica lags its write side, so a version published seconds earlier can
// still look absent to `npm view`, get re-queued, and hit this on publish —
// which means it's already up, not a failure. Everything else (auth, network,
// real permission denials, a bare 409 rate-limit) must surface so the deploy
// fails loudly — so match only the two duplicate-specific signals, not 409.
export function isAlreadyPublished(output) {
	return /cannot publish over the previously published versions|EPUBLISHCONFLICT/i.test(
		output ?? '',
	);
}
