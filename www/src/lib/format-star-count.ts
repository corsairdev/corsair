/** "1.2k" for 1,234 stars, "980" for 980. */
export function formatStarCount(count: number): string {
	if (count >= 1000) {
		const k = count / 1000;
		return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
	}
	return count.toString();
}
