import pkg from "../package.json" with { type: "json" };

// Replaced with string literals by `bun build --define` in scripts/build.mts.
// Running from source they're never declared, hence the typeof guards.
declare const BUILD_DATE: string;
declare const BUILD_COMMIT: string;

export const version = pkg.version;
export const buildDate = typeof BUILD_DATE === "undefined" ? undefined : BUILD_DATE;
export const commit = (typeof BUILD_COMMIT === "undefined" ? undefined : BUILD_COMMIT) || undefined;

// "tt 0.1.0 · built 2026-10-01 14:03 UTC · a1b2c3d", or "tt 0.1.0 (dev)"
export const buildLabel = buildDate
	? [`tt ${version}`, `built ${buildDate}`, commit].filter(Boolean).join(" · ")
	: `tt ${version} (dev)`;
