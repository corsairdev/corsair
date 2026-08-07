# Changesets

This folder holds [changesets](https://github.com/changesets/changesets). Each
release-worthy change carries a changeset describing which packages to bump and
by how much.

When a PR changes a published package, add one:

```bash
pnpm changeset
```

Pick the affected packages, the bump type (patch/minor/major), and write a short
summary — it becomes the changelog entry. Commit the generated file with your PR.

On merge to `main`, the release workflow opens a "Version Packages" PR that applies
the bumps and updates changelogs. Merging that PR builds and publishes to npm.
