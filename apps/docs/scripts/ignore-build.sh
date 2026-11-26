#!/usr/bin/env bash
# Vercel's "Ignored Build Step" for the docs project: exit 0 skips the build,
# exit 1 builds. Runs from apps/docs.
#
# Compares against the last commit this project deployed on the branch
# (VERCEL_GIT_PREVIOUS_SHA), not HEAD^: Vercel can drop a queued build when a
# newer commit arrives, and HEAD^ would then miss the dropped commit's changes.
# No previous deployment, or a base this clone doesn't have, means build.
#
# main builds whenever anything the site reads changes. A PR builds only when
# the app or the written pages change: plugin PRs (one plugin's generated
# pages plus its docs.json entry) skip, so they don't queue behind each other
# on the team's build slots.
set -u
base="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$base" ] || ! git cat-file -e "$base^{commit}" 2>/dev/null; then
	exit 1
fi
if [ "${VERCEL_GIT_COMMIT_REF:-}" = "main" ]; then
	git diff --quiet "$base" HEAD -- . ../../docs ../../explorer/data/plugins
	exit $?
fi
git diff --quiet "$base" HEAD -- . ../../docs ':(exclude)../../docs/plugins' ':(exclude)../../docs/docs.json'
