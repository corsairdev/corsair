export const TABLE = {
	font: 'var(--twenty-font-sans), Inter, system-ui, sans-serif',
	cellPadding: 8,
	rowHeight: 32,
	colors: {
		bg: '#ffffff',
		bgSecondary: '#f9f9f9',
		borderLight: '#ebebeb',
		borderStrong: '#d1d1d1',
		text: '#1c1c1c',
		textSecondary: '#666666',
		textTertiary: '#999999',
		accent: '#4a38f5',
		accentSoft: 'rgba(74, 56, 245, 0.08)',
		accentBorder: '#4a38f5',
	},
} as const;

export const AVATAR_TONES: Record<
	string,
	{ background: string; color: string }
> = {
	amber: { background: '#f6e6d7', color: '#7a4f2a' },
	blue: { background: '#dbeafe', color: '#1d4ed8' },
	gray: { background: '#e5e7eb', color: '#4b5563' },
	green: { background: '#dcfce7', color: '#15803d' },
	orange: { background: '#ffdcc3', color: '#ed5f00' },
	pink: { background: '#ffe4e6', color: '#be123c' },
	purple: { background: '#ede9fe', color: '#6d28d9' },
	red: { background: '#fee2e2', color: '#b91c1c' },
	teal: { background: '#ccfbf1', color: '#0f766e' },
};
