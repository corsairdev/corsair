export function shouldSyncSearchValue({
	defaultValue,
	lastApplied,
	isFocused,
}: {
	defaultValue: string;
	lastApplied: string;
	isFocused: boolean;
}): boolean {
	if (defaultValue !== lastApplied) return true;
	return !isFocused;
}

export function shouldApplySearch(
	trimmed: string,
	lastApplied: string,
): boolean {
	return trimmed !== lastApplied;
}
