const pointsFormatter = new Intl.NumberFormat('en-US');

export function formatPoints(points: number): string {
	return pointsFormatter.format(points);
}

export function formatPointsDelta(points: number): string {
	const formatted = formatPoints(points);
	return points >= 0 ? `+${formatted}` : formatted;
}
