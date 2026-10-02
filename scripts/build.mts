// Cross-compiles standalone executables. Bun downloads each target's runtime
// on first use, so every target builds from any host, including the container.
import { $ } from "bun";

const targets = [
	"bun-linux-x64",
	"bun-linux-arm64",
	"bun-darwin-x64",
	"bun-darwin-arm64",
	"bun-windows-x64",
] as const;

const outfile = (target: string) =>
	`dist/tt-${target.replace(/^bun-/, "")}${target.includes("windows") ? ".exe" : ""}`;

// Stamped into the binaries; src/build.ts reads them. The commit is empty
// outside a git checkout, and the footer leaves it out.
const buildDate = `${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`;
const commit = (await $`git rev-parse --short HEAD`.nothrow().quiet().text()).trim();
const defines = [
	`--define=BUILD_DATE=${JSON.stringify(buildDate)}`,
	`--define=BUILD_COMMIT=${JSON.stringify(commit)}`,
];

await $`rm -rf dist`;
await Promise.all(
	targets.map((target) =>
		$`bun build src/cli.tsx --compile --minify ${defines} --target=${target} --outfile=${outfile(target)}`,
	),
);
console.log(targets.map(outfile).join("\n"));
