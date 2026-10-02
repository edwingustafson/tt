# tt

A world clock for the terminal. `tt` shows your local time and UTC side by side, plus an optional third time zone, updating every second.

```
╭────────────────────────────────╮ ╭────────────────────────────────╮ ╭────────────────────────────────╮
│  Local                         │ │  UTC                           │ │  Tokyo                         │
│  America/Chicago               │ │  UTC                           │ │  Asia/Tokyo                    │
│                                │ │                                │ │                                │
│  18:29:35                      │ │  23:29:35                      │ │  08:29:35                      │
│                                │ │                                │ │                                │
│  Wed, Sep 30, 2026             │ │  Wed, Sep 30, 2026             │ │  Thu, Oct 1, 2026              │
│  Central Daylight Time         │ │  Coordinated Universal Time    │ │  Japan Standard Time           │
│  GMT-5                         │ │  GMT+0                         │ │  GMT+9                         │
╰────────────────────────────────╯ ╰────────────────────────────────╯ ╰────────────────────────────────╯
q to quit · tt 0.1.0 · built 2026-10-01 13:46 UTC · a1b2c3d
```

Each clock shows the zone ID, the 24-hour time, the date in that zone, the zone's full name (including daylight saving time), and its UTC offset.

## Usage

```sh
tt                       # local time and UTC
tt --zone Asia/Tokyo     # add a third clock
tt -z america/new_york   # zone names are case-insensitive
tt --now                 # print once and exit, e.g. in scripts or pipes
tt --clear               # start on a clean screen
```

| Option | Description |
| --- | --- |
| `-z`, `--zone <zone>` | Add a third clock for an [IANA time zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), such as `Asia/Tokyo` or `America/New_York` |
| `--now` | Print the clocks once and exit, instead of ticking |
| `--clear` | Clear the screen and scrollback before starting |
| `-h`, `--help` | Show help and exit |

While running, press `q` or `Esc` to quit.

The local zone comes from the system, or from the `TZ` environment variable if set, so `TZ=Europe/Paris tt` shows Paris as local time.

With three clocks the display is about 104 columns wide, so use a terminal at least that wide.

## Building

`tt` is written in TypeScript with [Ink](https://github.com/vadimdemedes/ink) (React for the terminal) and uses [Bun](https://bun.sh) to run and build it.

```sh
bun install
bun run dev              # run from source; pass options after --, e.g. bun run dev -- -z Asia/Tokyo
bun run typecheck        # type-check with tsc
bun run build            # compile standalone executables into dist/
```

`bun run build` cross-compiles a self-contained executable for each platform from any host, so it doesn't need Bun or Node installed to run:

| File | Platform |
| --- | --- |
| `dist/tt-darwin-arm64` | macOS, Apple silicon |
| `dist/tt-darwin-x64` | macOS, Intel |
| `dist/tt-linux-arm64` | Linux, ARM64 |
| `dist/tt-linux-x64` | Linux, x86-64 |
| `dist/tt-windows-x64.exe` | Windows, x86-64 |

### Version information

The footer and `--help` show a build label:

- **Version** comes from `"version"` in `package.json`.
- **Build date** (UTC) and **commit hash** are stamped into the compiled executables by `scripts/build.mts`. The hash is left out when building outside a git checkout.
- Running from source shows `(dev)` instead, e.g. `tt 0.1.0 (dev)`.

## Dev container

The repository includes a [dev container](https://containers.dev) configuration (`.devcontainer/`) for VS Code:

- **Time zone:** before the container starts, `initializeCommand.sh` reads the host's time zone and passes it in as `TZ`, so local time in the container matches the host.
- **Git:** VS Code forwards the host's Git credentials (HTTPS) and ssh-agent into the container.
- **Claude Code:** `~/.claude` and `~/.claude.json` are mounted from the host, and `postCreateCommand.sh` installs Claude Code and Bun.

## Project layout

```
src/cli.tsx              command-line options and entry point
src/App.tsx              the clock display
src/build.ts             version and build label
scripts/build.mts        cross-platform build
.devcontainer/           dev container configuration
```
