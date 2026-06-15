export function getTagTextColor(backgroundColor: string): string {
	const hex = backgroundColor.replace('#', '');
	if (hex.length !== 6) return '#1a1a1a';

	const red = Number.parseInt(hex.slice(0, 2), 16);
	const green = Number.parseInt(hex.slice(2, 4), 16);
	const blue = Number.parseInt(hex.slice(4, 6), 16);
	const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

	return luminance > 0.62 ? '#1a1a1a' : '#fafafa';
}

export function getTagBorderColor(
	backgroundColor: string,
	alpha = 0.35,
): string {
	const hex = backgroundColor.replace('#', '');
	if (hex.length !== 6) return 'rgba(0, 0, 0, 0.12)';

	const red = Number.parseInt(hex.slice(0, 2), 16);
	const green = Number.parseInt(hex.slice(2, 4), 16);
	const blue = Number.parseInt(hex.slice(4, 6), 16);

	return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
