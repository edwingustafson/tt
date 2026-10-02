import { useEffect, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { buildLabel } from "./build.ts";

// Re-renders on each wall-clock second, aligned to the boundary so the
// display never lags the system clock by most of a second.
const useNow = () => {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const timer = setTimeout(() => setNow(new Date()), 1000 - (Date.now() % 1000));
		return () => clearTimeout(timer);
	}, [now]);

	return now;
};

const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

type ZoneCardProps = {
	readonly title: string;
	readonly timeZone: string;
	readonly now: Date;
	readonly color: string;
};

const ZoneCard = ({ title, timeZone, now, color }: ZoneCardProps) => {
	const format = (options: Intl.DateTimeFormatOptions) =>
		new Intl.DateTimeFormat("en-US", { timeZone, ...options }).format(now);

	const zoneName = (style: Intl.DateTimeFormatOptions["timeZoneName"]) =>
		new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: style })
			.formatToParts(now)
			.find((part) => part.type === "timeZoneName")?.value ?? "";

	const time = format({ hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
	const date = format({ weekday: "short", year: "numeric", month: "short", day: "numeric" });

	return (
		<Box flexDirection="column" borderStyle="round" borderColor={color} paddingX={2} width={34}>
			<Text bold color={color}>{title}</Text>
			<Text dimColor>{timeZone}</Text>
			<Box marginY={1}>
				<Text bold>{time}</Text>
			</Box>
			<Text>{date}</Text>
			<Text dimColor>{zoneName("long")}</Text>
			<Text dimColor>{zoneName("shortOffset")}</Text>
		</Box>
	);
};

// "America/Argentina/Buenos_Aires" → "Buenos Aires"
const cityName = (timeZone: string) => timeZone.split("/").at(-1)!.replaceAll("_", " ");

type AppProps = {
	readonly zone?: string;
	// Render a single frame and exit, without reading the keyboard.
	readonly once?: boolean;
};

export const App = ({ zone, once = false }: AppProps) => {
	const { exit } = useApp();
	const now = useNow();

	// Inactive input leaves stdin alone, so `tt --now` also works when piped.
	useInput((input, key) => {
		if (input === "q" || key.escape) exit();
	}, { isActive: !once });

	useEffect(() => {
		if (once) exit();
	}, [once, exit]);

	return (
		<Box flexDirection="column">
			<Box gap={1}>
				<ZoneCard title="Local" timeZone={localZone} now={now} color="green" />
				<ZoneCard title="UTC" timeZone="UTC" now={now} color="cyan" />
				{zone && <ZoneCard title={cityName(zone)} timeZone={zone} now={now} color="magenta" />}
			</Box>
			<Text dimColor>{once ? buildLabel : `q to quit · ${buildLabel}`}</Text>
		</Box>
	);
};
