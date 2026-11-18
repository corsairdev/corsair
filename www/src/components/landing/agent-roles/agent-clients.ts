// The chat apps the roles card can be shown in. Each look is a sketch of the
// app, close enough to recognise, not a copy of its interface.

export type AgentClientId = 'claude' | 'cursor' | 'chatgpt' | 'grok';

export type AgentClientSkin = {
	id: AgentClientId;
	name: string;
	/** Single-colour mark in /public/clients, drawn as a mask in currentColor. */
	logo: string;
	/** The mark's own colour on the active tab, when it has one. */
	brand?: string;
	dark: boolean;
	/** Window body, title bar, and the active tab (which matches the body). */
	body: string;
	bar: string;
	text: string;
	muted: string;
	/** The user's message bubble. */
	bubble: string;
	border: string;
	/** How the app labels a call to an MCP server. */
	toolLabel: string;
	placeholder: string;
	/** Claude answers in a serif face. */
	serifAnswer?: boolean;
};

// Light and dark alternate, so auto-rotation never shows two dark windows in
// a row.
export const AGENT_CLIENTS: AgentClientSkin[] = [
	{
		id: 'claude',
		name: 'Claude',
		logo: '/clients/claude.svg',
		brand: '#D97757',
		dark: false,
		body: '#FAF9F5',
		bar: '#F0EEE6',
		text: '#1F1E1D',
		muted: '#8A877F',
		bubble: '#F0EEE6',
		border: '#E5E2D9',
		toolLabel: 'Used Corsair',
		placeholder: 'Reply to Claude…',
		serifAnswer: true,
	},
	{
		id: 'cursor',
		name: 'Cursor',
		logo: '/clients/cursor-light.svg',
		dark: true,
		body: '#181818',
		bar: '#111111',
		text: 'rgba(255,255,255,0.88)',
		muted: 'rgba(255,255,255,0.5)',
		bubble: 'rgba(255,255,255,0.05)',
		border: 'rgba(255,255,255,0.1)',
		toolLabel: 'MCP · corsair',
		placeholder: 'Plan, search, build anything',
	},
	{
		id: 'chatgpt',
		name: 'ChatGPT',
		logo: '/clients/chatgpt.svg',
		dark: false,
		body: '#FFFFFF',
		bar: '#F3F3F3',
		text: '#0D0D0D',
		muted: '#8F8F8F',
		bubble: '#F4F4F4',
		border: '#E3E3E3',
		toolLabel: 'Called Corsair',
		placeholder: 'Ask anything',
	},
	{
		id: 'grok',
		name: 'Grok',
		logo: '/clients/grok.svg',
		dark: true,
		body: '#0E0E0E',
		bar: '#050505',
		text: 'rgba(255,255,255,0.9)',
		muted: 'rgba(255,255,255,0.48)',
		bubble: '#1F1F1F',
		border: 'rgba(255,255,255,0.12)',
		toolLabel: 'Corsair',
		placeholder: 'What do you want to know?',
	},
];
