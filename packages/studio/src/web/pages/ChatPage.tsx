import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, EmptyState, Textarea } from '../components/Primitives';

type ToolBlock = {
	type: 'tool';
	name: string;
	args: unknown;
	result?: unknown;
};

type TextBlock = {
	type: 'text';
	content: string;
};

type MsgBlock = TextBlock | ToolBlock;

type MessageUsage = {
	model: string;
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
	cost: number | null;
};

type Msg = {
	id: string;
	role: 'user' | 'assistant';
	blocks: MsgBlock[];
	error?: string;
	usage?: MessageUsage;
};

type ApiChat = {
	id: string;
	title: string;
	created_at: number;
};

type ApiMessage = {
	id: string;
	role: 'user' | 'assistant';
	blocks: MsgBlock[];
	error: string | null;
	usage: MessageUsage | null;
};

type SseEvent =
	| { type: 'text'; text: string }
	| { type: 'tool-start'; name: string; args: unknown }
	| { type: 'tool-end'; name: string; result: unknown }
	| { type: 'usage'; usage: MessageUsage }
	| { type: 'done' }
	| { type: 'error'; message: string };

type UsageTotal = {
	inputTokens: number;
	outputTokens: number;
	totalTokens: number;
	cost: number;
	hasUnknownCost: boolean;
	hasAnyKnownCost: boolean;
};

function aggregateUsage(messages: Msg[]): UsageTotal {
	const total: UsageTotal = {
		inputTokens: 0,
		outputTokens: 0,
		totalTokens: 0,
		cost: 0,
		hasUnknownCost: false,
		hasAnyKnownCost: false,
	};
	for (const msg of messages) {
		const u = msg.usage;
		if (!u) continue;
		total.inputTokens += u.inputTokens;
		total.outputTokens += u.outputTokens;
		total.totalTokens += u.totalTokens;
		if (u.cost === null) {
			total.hasUnknownCost = true;
		} else {
			total.cost += u.cost;
			total.hasAnyKnownCost = true;
		}
	}
	return total;
}

function formatTokens(n: number): string {
	if (n < 1000) return String(n);
	if (n < 1_000_000) return `${(n / 1000).toFixed(1)}K`;
	return `${(n / 1_000_000).toFixed(2)}M`;
}

function formatCost(cost: number): string {
	if (cost === 0) return '$0.00';
	if (cost < 0.01) return `$${cost.toFixed(4)}`;
	if (cost < 1) return `$${cost.toFixed(3)}`;
	return `$${cost.toFixed(2)}`;
}

function ToolCallRow({ tc }: { tc: ToolBlock }) {
	const [open, setOpen] = useState(false);
	const done = tc.result !== undefined;
	return (
		<div className="text-[11px] border border-[var(--color-border)] rounded-md overflow-hidden">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="w-full flex items-center gap-2 px-2 py-1 bg-[var(--color-bg-elevated)] text-left hover:bg-[var(--color-bg-hover)] transition-colors"
			>
				<span
					className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${done ? 'bg-[var(--color-ok)]' : 'bg-[var(--color-warn)] animate-pulse'}`}
				/>
				<span className="font-mono text-[var(--color-text-muted)]">
					{tc.name}
				</span>
				<span className="ml-auto text-[var(--color-text-subtle)]">
					{open ? '▴' : '▾'}
				</span>
			</button>
			{open ? (
				<div className="border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]">
					<div className="px-2 py-1.5">
						<div className="text-[10px] uppercase tracking-wide text-[var(--color-text-subtle)] mb-1">
							args
						</div>
						<pre className="font-mono text-[var(--color-text-muted)] whitespace-pre-wrap break-all">
							{JSON.stringify(tc.args, null, 2)}
						</pre>
					</div>
					{tc.result !== undefined ? (
						<div className="px-2 py-1.5">
							<div className="text-[10px] uppercase tracking-wide text-[var(--color-text-subtle)] mb-1">
								result
							</div>
							<pre className="font-mono text-[var(--color-text-muted)] whitespace-pre-wrap break-all max-h-48 overflow-auto">
								{typeof tc.result === 'string'
									? tc.result
									: JSON.stringify(tc.result, null, 2)}
							</pre>
						</div>
					) : null}
				</div>
			) : null}
		</div>
	);
}

function MessageUsageRow({ usage }: { usage: MessageUsage }) {
	return (
		<div
			className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono pl-1"
			title={`model: ${usage.model}`}
		>
			<span className="px-1.5 py-0.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
				↑ {formatTokens(usage.inputTokens)}
			</span>
			<span className="px-1.5 py-0.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
				↓ {formatTokens(usage.outputTokens)}
			</span>
			{usage.cost !== null ? (
				<span className="px-1.5 py-0.5 rounded bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)]">
					{formatCost(usage.cost)}
				</span>
			) : null}
			<span className="text-[var(--color-text-subtle)]">{usage.model}</span>
		</div>
	);
}

function MessageBubble({ msg }: { msg: Msg }) {
	const isUser = msg.role === 'user';

	if (isUser) {
		const text = msg.blocks
			.map((b) => (b.type === 'text' ? b.content : ''))
			.join('');
		return (
			<div className="flex justify-end">
				<div className="max-w-[75%] px-3 py-2 rounded-xl rounded-br-sm bg-[var(--color-accent)] text-black text-xs leading-relaxed whitespace-pre-wrap break-words">
					{text}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 max-w-[85%]">
			{msg.blocks.map((block, i) =>
				block.type === 'tool' ? (
					<ToolCallRow key={`${block.name}-${i}`} tc={block} />
				) : block.content ? (
					<div
						key={i}
						className="px-3 py-2 rounded-xl rounded-bl-sm bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-xs leading-relaxed whitespace-pre-wrap break-words text-[var(--color-text)]"
					>
						{block.content}
					</div>
				) : null,
			)}

			{msg.usage ? <MessageUsageRow usage={msg.usage} /> : null}

			{msg.error ? (
				<div className="px-3 py-2 rounded-xl border border-[var(--color-err)]/40 bg-[var(--color-err)]/5 text-xs text-[var(--color-err)]">
					{msg.error}
				</div>
			) : null}
		</div>
	);
}

function toMsg(m: ApiMessage): Msg {
	return {
		id: m.id,
		role: m.role,
		blocks: m.blocks,
		error: m.error ?? undefined,
		usage: m.usage ?? undefined,
	};
}

export function ChatPage({ tenant }: { tenant: string }) {
	const [chats, setChats] = useState<ApiChat[]>([]);
	const [activeChatId, setActiveChatId] = useState<string | null>(null);
	const [messages, setMessages] = useState<Msg[]>([]);
	const [input, setInput] = useState('');
	const [streaming, setStreaming] = useState(false);
	const [chatLoading, setChatLoading] = useState(true);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const usageTotal = useMemo(() => aggregateUsage(messages), [messages]);

	const loadMessages = async (chatId: string) => {
		const res = await fetch(`/api/chats/messages?chatId=${chatId}`);
		const data = (await res.json()) as { messages: ApiMessage[] };
		setMessages(data.messages.map(toMsg));
	};

	const newChat = async () => {
		const res = await fetch('/api/chats', { method: 'POST' });
		const data = (await res.json()) as { chat: ApiChat };
		setChats((prev) => [data.chat, ...prev]);
		setActiveChatId(data.chat.id);
		setMessages([]);
	};

	const switchChat = async (chatId: string) => {
		if (chatId === activeChatId) return;
		setActiveChatId(chatId);
		setChatLoading(true);
		try {
			await loadMessages(chatId);
		} finally {
			setChatLoading(false);
		}
	};

	useEffect(() => {
		const init = async () => {
			setChatLoading(true);
			try {
				const res = await fetch('/api/chats');
				const data = (await res.json()) as { chats: ApiChat[] };
				const first = data.chats[0];
				if (first) {
					setChats(data.chats);
					setActiveChatId(first.id);
					await loadMessages(first.id);
				} else {
					const createRes = await fetch('/api/chats', { method: 'POST' });
					const createData = (await createRes.json()) as { chat: ApiChat };
					setChats([createData.chat]);
					setActiveChatId(createData.chat.id);
					setMessages([]);
				}
			} finally {
				setChatLoading(false);
			}
		};
		void init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const send = async () => {
		const text = input.trim();
		if (!text || streaming || !activeChatId) return;
		setInput('');

		const userMsg: Msg = {
			id: crypto.randomUUID(),
			role: 'user',
			blocks: [{ type: 'text', content: text }],
		};
		const asstId = crypto.randomUUID();
		const asstMsg: Msg = {
			id: asstId,
			role: 'assistant',
			blocks: [],
		};

		setMessages((prev) => [...prev, userMsg, asstMsg]);
		setStreaming(true);

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: text,
					tenant,
					chatId: activeChatId,
				}),
			});

			if (!response.ok) {
				const err = (await response.json()) as { error?: string };
				setMessages((prev) =>
					prev.map((m) =>
						m.id === asstId
							? { ...m, error: err.error ?? 'Request failed' }
							: m,
					),
				);
				return;
			}

			const reader = response.body!.getReader();
			const decoder = new TextDecoder();
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });

				const lines = buffer.split('\n');
				buffer = lines.pop() ?? '';

				for (const line of lines) {
					if (!line.startsWith('data: ')) continue;
					let event: SseEvent;
					try {
						event = JSON.parse(line.slice(6)) as SseEvent;
					} catch {
						continue;
					}

					if (event.type === 'text') {
						setMessages((prev) =>
							prev.map((m) => {
								if (m.id !== asstId) return m;
								const blocks = [...m.blocks];
								const last = blocks[blocks.length - 1];
								if (last?.type === 'text') {
									blocks[blocks.length - 1] = {
										...last,
										content: last.content + event.text,
									};
								} else {
									blocks.push({ type: 'text', content: event.text });
								}
								return { ...m, blocks };
							}),
						);
					} else if (event.type === 'tool-start') {
						setMessages((prev) =>
							prev.map((m) =>
								m.id === asstId
									? {
											...m,
											blocks: [
												...m.blocks,
												{ type: 'tool', name: event.name, args: event.args },
											],
										}
									: m,
							),
						);
					} else if (event.type === 'tool-end') {
						setMessages((prev) =>
							prev.map((m) => {
								if (m.id !== asstId) return m;
								const blocks = [...m.blocks];
								const idx = blocks.findLastIndex(
									(b): b is ToolBlock =>
										b.type === 'tool' &&
										b.name === event.name &&
										b.result === undefined,
								);
								if (idx >= 0) {
									const existing = blocks[idx] as ToolBlock;
									blocks[idx] = { ...existing, result: event.result };
								}
								return { ...m, blocks };
							}),
						);
					} else if (event.type === 'usage') {
						setMessages((prev) =>
							prev.map((m) =>
								m.id === asstId ? { ...m, usage: event.usage } : m,
							),
						);
					} else if (event.type === 'error') {
						setMessages((prev) =>
							prev.map((m) =>
								m.id === asstId ? { ...m, error: event.message } : m,
							),
						);
					}
				}
			}
		} catch (err) {
			setMessages((prev) =>
				prev.map((m) =>
					m.id === asstId ? { ...m, error: (err as Error).message } : m,
				),
			);
		} finally {
			setStreaming(false);
			// Refresh chat list so title updates (first message sets title)
			fetch('/api/chats')
				.then((r) => r.json())
				.then((data) => setChats((data as { chats: ApiChat[] }).chats))
				.catch(() => undefined);
		}
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			void send();
		}
	};

	const hasUsage = usageTotal.totalTokens > 0;

	return (
		<div className="h-full flex flex-col">
			<div className="flex-shrink-0 border-b border-[var(--color-border)] px-4 py-2 flex items-center gap-2">
				<select
					value={activeChatId ?? ''}
					onChange={(e) => void switchChat(e.target.value)}
					disabled={chatLoading || streaming}
					className="flex-1 text-xs bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-2 h-7 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-dim)] disabled:opacity-40"
				>
					{chats.map((c) => (
						<option key={c.id} value={c.id}>
							{c.title}
						</option>
					))}
				</select>
				<Button
					variant="default"
					onClick={() => void newChat()}
					disabled={chatLoading || streaming}
					className="h-7 px-2 flex-shrink-0"
				>
					+ New
				</Button>
			</div>

			<div className="flex-1 overflow-auto p-4 flex flex-col gap-3 min-h-0">
				{chatLoading ? (
					<div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-subtle)]">
						<span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
						<span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
						<span className="w-1 h-1 rounded-full bg-current animate-bounce" />
					</div>
				) : messages.length === 0 ? (
					<EmptyState
						title="Chat with your Corsair instance"
						hint="Ask about your plugins, operations, or data. The assistant has access to Corsair MCP tools."
					/>
				) : (
					messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
				)}
				{streaming &&
				messages.at(-1)?.role === 'assistant' &&
				!messages.at(-1)?.blocks.length ? (
					<div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-subtle)]">
						<span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
						<span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
						<span className="w-1 h-1 rounded-full bg-current animate-bounce" />
					</div>
				) : null}
				<div ref={bottomRef} />
			</div>

			<div className="flex-shrink-0 border-t border-[var(--color-border)] p-4">
				<div className="flex gap-2 items-end">
					<div className="flex-1 flex flex-col  min-w-0">
						{hasUsage ? (
							<div className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex items-center justify-between gap-3 text-xs font-mono">
								<div className="flex items-center gap-2 flex-wrap">
									<span className="text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)]">
										Usage
									</span>
									<span
										className="px-2 py-0.5 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)]"
										title="input tokens"
									>
										<span className="text-[var(--color-text-subtle)]">
											↑ in
										</span>{' '}
										<span className="font-semibold">
											{formatTokens(usageTotal.inputTokens)}
										</span>
									</span>
									<span
										className="px-2 py-0.5 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)]"
										title="output tokens"
									>
										<span className="text-[var(--color-text-subtle)]">
											↓ out
										</span>{' '}
										<span className="font-semibold">
											{formatTokens(usageTotal.outputTokens)}
										</span>
									</span>
									<span
										className="px-2 py-0.5 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)]"
										title="total tokens"
									>
										<span className="text-[var(--color-text-subtle)]">
											Σ total
										</span>{' '}
										<span className="font-semibold">
											{formatTokens(usageTotal.totalTokens)}
										</span>
									</span>
								</div>
								{usageTotal.hasAnyKnownCost ? (
									<div
										className="px-2.5 py-0.5 rounded-md bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/40 text-[var(--color-accent)] font-semibold whitespace-nowrap"
										title={
											usageTotal.hasUnknownCost
												? 'Estimated cost (some messages used a model without pricing data)'
												: 'Estimated cost for this chat'
										}
									>
										{formatCost(usageTotal.cost)}
										{usageTotal.hasUnknownCost ? '+' : ''}
									</div>
								) : null}
							</div>
						) : null}
						<Textarea
							className="resize-none"
							rows={3}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={onKeyDown}
							placeholder="Ask about your integrations… (Ctrl+Enter to send)"
							disabled={streaming || chatLoading}
						/>
					</div>
					<Button
						variant="primary"
						onClick={() => void send()}
						disabled={!input.trim() || streaming || chatLoading}
						className="h-auto py-2 self-stretch"
					>
						{streaming ? '…' : '↑'}
					</Button>
				</div>
				<div className="mt-1.5 text-[10px] text-[var(--color-text-subtle)]">
					Ctrl+Enter to send · Powered by Corsair MCP tools
				</div>
			</div>
		</div>
	);
}
