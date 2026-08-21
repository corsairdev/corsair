# @corsair-dev/frpc-win32-arm64

The prebuilt `frpc` binary ([fatedier/frp](https://github.com/fatedier/frp), win32/arm64) that the [`corsair`](https://www.npmjs.com/package/corsair) dev tunnel spawns.

Don't install this directly — `corsair` lists every platform's binary as an `optionalDependency` and your package manager installs only the one matching your OS/CPU (the esbuild/Turbopack model). The binary is materialized at publish time by `scripts/prepare-frpc-packages.mjs`.

frp is redistributed here under Apache-2.0 — see `LICENSE.frp` and `NOTICE`.
