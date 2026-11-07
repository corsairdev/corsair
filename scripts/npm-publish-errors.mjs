// npm/pnpm reject re-publishing an existing version with E403. npm's registry
// read replica lags its write side, so a version published seconds earlier can
// still look absent to `npm view`, get re-queued, and hit this on publish —
// which means it's already up, not a failure. Everything else (auth, network,
// real permission denials, a bare 409 rate-limit) must surface so the deploy
// fails loudly — so match only the duplicate-specific messages, not a bare
// 409. npm also answers a just-published version with a 409 whose message says
// "Cannot publish over previously staged version" (two deploy runs racing on
// back-to-back merges, 11-07): that message names the duplicate, so it counts.
export function isAlreadyPublished(output) {
	return /cannot publish over (the )?previously (published|staged) versions?|EPUBLISHCONFLICT/i.test(
		output ?? '',
	);
}
