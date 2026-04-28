import { useEffect, useRef, useState } from 'react';
import { Button, EmptyState, Textarea } from '../components/Primitives';

type ToolEvent = {
	name: string;
	args: unknown;
	result?: unknown;
};

type Msg = {
	id: string;
	role: 'user' | 'assistant';
	text: string;
	tools: ToolEvent[];
	error?: string;
};

type SseEvent =
	| { type: 'text'; text: string }
	| { type: 'tool-start'; name: string; args: unknown }
	| { type: 'tool-end'; name: string; result: unknown }
	| { type: 'done' }
	| { type: 'error'; message: string };

function ToolCallRow({ tc }: { tc: ToolEvent }) {
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

function MessageBubble({ msg }: { msg: Msg }) {
	const isUser = msg.role === 'user';

	if (isUser) {
		return (
			<div className="flex justify-end">
				<div className="max-w-[75%] px-3 py-2 rounded-xl rounded-br-sm bg-[var(--color-accent)] text-black text-xs leading-relaxed whitespace-pre-wrap break-words">
					{msg.text}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 max-w-[85%]">
			{msg.tools.length > 0 ? (
				<div className="flex flex-col gap-1">
					{msg.tools.map((tc, i) => (
						<ToolCallRow key={`${tc.name}-${i}`} tc={tc} />
					))}
				</div>
			) : null}

			{msg.text ? (
				<div className="px-3 py-2 rounded-xl rounded-bl-sm bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-xs leading-relaxed whitespace-pre-wrap break-words text-[var(--color-text)]">
					{msg.text}
					{!msg.error && msg.text.endsWith('…') ? null : null}
				</div>
			) : null}

			{msg.error ? (
				<div className="px-3 py-2 rounded-xl border border-[var(--color-err)]/40 bg-[var(--color-err)]/5 text-xs text-[var(--color-err)]">
					{msg.error}
				</div>
			) : null}
		</div>
	);
}

export function ChatPage({ tenant }: { tenant: string }) {
	const [messages, setMessages] = useState<Msg[]>([]);
	const [input, setInput] = useState('');
	const [streaming, setStreaming] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const send = async () => {
		const text = input.trim();
		if (!text || streaming) return;
		setInput('');

		const userMsg: Msg = {
			id: crypto.randomUUID(),
			role: 'user',
			text,
			tools: [],
		};
		const asstId = crypto.randomUUID();
		const asstMsg: Msg = {
			id: asstId,
			role: 'assistant',
			text: '',
			tools: [],
		};

		setMessages((prev) => [...prev, userMsg, asstMsg]);
		setStreaming(true);

		const apiMessages = [...messages, userMsg].map((m) => ({
			role: m.role,
			content: m.text,
		}));

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: apiMessages, tenant }),
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
							prev.map((m) =>
								m.id === asstId ? { ...m, text: m.text + event.text } : m,
							),
						);
					} else if (event.type === 'tool-start') {
						setMessages((prev) =>
							prev.map((m) =>
								m.id === asstId
									? {
											...m,
											tools: [
												...m.tools,
												{ name: event.name, args: event.args },
											],
										}
									: m,
							),
						);
					} else if (event.type === 'tool-end') {
						setMessages((prev) =>
							prev.map((m) => {
								if (m.id !== asstId) return m;
								const tools = [...m.tools];
								const idx = tools.findLastIndex(
									(t) => t.name === event.name && t.result === undefined,
								);
								const existing = idx >= 0 ? tools[idx] : undefined;
								if (existing) {
									tools[idx] = {
										name: existing.name,
										args: existing.args,
										result: event.result,
									};
								}
								return { ...m, tools };
							}),
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
					m.id === asstId
						? { ...m, error: (err as Error).message }
						: m,
				),
			);
		} finally {
			setStreaming(false);
		}
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			void send();
		}
	};

	return (
		<div className="h-full flex flex-col">
			<div className="flex-1 overflow-auto p-4 flex flex-col gap-3 min-h-0">
				{messages.length === 0 ? (
					<EmptyState
						title="Chat with your Corsair instance"
						hint="Ask about your plugins, operations, or data. The assistant has access to Corsair MCP tools."
					/>
				) : (
					messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
				)}
				{streaming && messages.at(-1)?.role === 'assistant' && !messages.at(-1)?.text && !messages.at(-1)?.tools.length ? (
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
					<Textarea
						className="flex-1 resize-none"
						rows={3}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={onKeyDown}
						placeholder="Ask about your integrations… (Ctrl+Enter to send)"
						disabled={streaming}
					/>
					<Button
						variant="primary"
						onClick={() => void send()}
						disabled={!input.trim() || streaming}
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
