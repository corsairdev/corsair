You are fixing specific code-review findings on an open-source PR.

The findings are in /tmp/findings.json (file, line, severity, title, detail).
The repo rules are in /tmp/PLUGIN_PR_RULES.md.

Fix ONLY the listed findings. Do not refactor, do not touch files outside the
plugin package the findings point at (plus packages/corsair/core/constants.ts
if a finding names it). Never use eval or new Function. Never hardcode
secrets or tokens.

After fixing, run:

    pnpm lint && pnpm typecheck

and fix any errors your changes introduced. Do not commit.
