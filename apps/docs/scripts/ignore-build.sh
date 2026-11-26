#!/usr/bin/env bash
# Vercel's "Ignored Build Step" for the docs project: exit 0 skips the build,
# exit 1 builds. Runs from apps/docs.
#
# main builds whenever anything the site reads changes. A PR builds only when
# the app or the written pages change: plugin PRs (one plugin's generated
# pages plus its docs.json entry) skip, so they don't queue behind each other
# on the team's build slots.
set -u
if [ "${VERCEL_GIT_COMMIT_REF:-}" = "main" ]; then
	git diff --quiet HEAD^ HEAD -- . ../../docs ../../explorer/data/plugins
	exit $?
fi
git diff --quiet HEAD^ HEAD -- . ../../docs ':(exclude)../../docs/plugins' ':(exclude)../../docs/docs.json'
