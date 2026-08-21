const CORSAIR = [
	' ██████╗ ██████╗ ██████╗ ███████╗ █████╗ ██╗██████╗',
	'██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██║██╔══██╗',
	'██║     ██║   ██║██████╔╝███████╗███████║██║██████╔╝',
	'██║     ██║   ██║██╔══██╗╚════██║██╔══██║██║██╔══██╗',
	'╚██████╗╚██████╔╝██║  ██║███████║██║  ██║██║██║  ██║',
	' ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝',
];

/** The CORSAIR wordmark + the dev's live tunnel URL, shown by `corsair http`. */
export function corsairBanner(url: string): string {
	return [
		'',
		...CORSAIR,
		'',
		'  🎉  Your dev tunnel is live!',
		'',
		`  🔗  ${url}`,
		'',
		'  The Hub now delivers straight to your local app.',
		'',
	].join('\n');
}
