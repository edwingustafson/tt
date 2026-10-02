#!/usr/bin/env bun
import { parseArgs } from "node:util";
import { render } from "ink";
import { App } from "./App.tsx";
import { buildLabel } from "./build.ts";

const usage = `${buildLabel}
A world clock for the terminal: local time and UTC, side by side.

Usage: tt [options]

Options:
  -z, --zone <zone>  Add a third clock for an IANA time zone, such as
                     Asia/Tokyo or America/New_York (case-insensitive)
      --now          Print the clocks once and exit, instead of ticking
      --clear        Clear the screen and scrollback before starting
  -h, --help         Show this help and exit

While running, press q or Esc to quit.
`;

const { values } = (() => {
	try {
		return parseArgs({
			options: {
				clear: { type: "boolean", default: false },
				zone: { type: "string", short: "z" },
				now: { type: "boolean", default: false },
				help: { type: "boolean", short: "h", default: false },
			},
		});
	} catch (error) {
		console.error(`tt: ${(error as Error).message}\nTry 'tt --help' for more information.`);
		process.exit(2);
	}
})();

if (values.help) {
	process.stdout.write(usage);
	process.exit(0);
}

// Intl throws a RangeError for unknown zones and canonicalizes known ones,
// so "america/new_york" displays as "America/New_York".
const zone = (() => {
	if (values.zone === undefined) return undefined;
	try {
		return new Intl.DateTimeFormat("en-US", { timeZone: values.zone }).resolvedOptions().timeZone;
	} catch {
		console.error(`tt: unknown time zone '${values.zone}'`);
		process.exit(2);
	}
})();

// Erase the screen and scrollback, then home the cursor, so the clock
// starts at the top of an empty terminal.
if (values.clear) process.stdout.write("\x1b[2J\x1b[3J\x1b[H");

render(<App zone={zone} once={values.now} />);
