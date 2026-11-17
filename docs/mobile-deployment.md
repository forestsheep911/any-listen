# Mobile web build and deployment

This fork builds the phone interface from `webserver-v0.12.0`. The server and its native modules remain the exact official ARM64 image used by the existing trial. `Dockerfile.mobile` overlays the compiled frontend and retains the official IPC preload. No database migration, login change or backend patch is needed.

The original custom AGPL-based license and noncommercial restriction remain in `LICENSE`. The mobile interface links to this fork's source. Modifications are available on the `mobile-web` branch.

## Build

Use Node compatible with the root package's engine range and the pinned pnpm version. Run from the repository root:

```sh
pnpm install --frozen-lockfile --ignore-scripts
node scripts/build-mobile.mjs any-listen-mobile:local
```

The script compiles the web frontend, adds a Git revision marker to the page, and builds an ARM64 runtime image on the `colima-music-trial` Docker context. Set `DOCKER_CONTEXT` to use another context with an ARM64 engine. The image is local unless separately pushed. `Dockerfile.mobile.dockerignore` limits the build context to compiled public assets and excludes credentials, local state and dependencies.

This frontend-only build intentionally reuses the official server's compiled preload and native SQLite library. For backend changes use the upstream full `Dockerfile` workflow instead. Frontend dependencies are pinned by `pnpm-lock.yaml`.

## Storage

The source checkout and active frontend build use the Mac internal APFS disk for low latency and Unix filesystem behavior. Before dependency installation 184 GiB was available. Colima stores runtime images and named application volumes locally. No music/media/archive data is downloaded as part of this build. Do not move the running database or VM onto OneDrive or ExFAT.

## Deployment contract

Validate the candidate on a separate loopback port and independent application volume first. Before replacement stop the current container, snapshot its named data volume to a protected local backup, then restart using the mobile image with the same volume, port, DNS, timezone and runtime Key Vault password. Never place that password in Compose files, image labels, source or terminal output. Keep the original pinned image available for rollback.

On this host `/Users/darkwise/dev/music-playback-research/web-trial` owns Compose, secrets lookup, health checks and the separately expiring UPnP entrance. Deployment does not extend the public mapping lease. Restore the official image using the same Compose service and retained data volume if rollback is required.
