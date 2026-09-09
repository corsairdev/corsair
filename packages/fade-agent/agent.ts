import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { SystemMessage } from '@langchain/core/messages';
import {
	END,
	MessagesAnnotation,
	START,
	StateGraph,
} from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { setFadePort } from './client.js';
import { AUDIO_TOOLS } from './tools/audio.js';
import { EXPORT_TOOLS } from './tools/export.js';
import { LIBRARY_TOOLS } from './tools/library.js';
import { MEDIA_TOOLS } from './tools/media.js';
import { PUBLISH_TOOLS } from './tools/publish.js';
import { TIMELINE_TOOLS } from './tools/timeline.js';
import { TIMELINE_EXTRA_TOOLS } from './tools/timeline_extra.js';

export { setFadePort };
export { setPhantomBusterKey } from './tools/publish.js';

const ALL_TOOLS = [
	...TIMELINE_TOOLS,
	...TIMELINE_EXTRA_TOOLS,
	...LIBRARY_TOOLS,
	...MEDIA_TOOLS,
	...AUDIO_TOOLS,
	...EXPORT_TOOLS,
	...PUBLISH_TOOLS,
];

const SYSTEM_PROMPT = `You are Fade AI, an intelligent video editing assistant.
You have full control over the Fade video editor and can fetch leads from PhantomBuster,
create videos based on those leads, and publish the finished video back via PhantomBuster.

Workflow:
1. Use list_library_assets / download_videos to gather media.
2. Use timeline tools to compose the video.
3. Use export_video + wait_for_export to render.
4. Use post_to_platform to publish via PhantomBuster.

Always call get_timeline_state before making edits to understand the current state.`;

/** Runtime-mutable config — updated by /api/settings without restart */
export const agentConfig = {
	provider: (process.env['FADE_AI_PROVIDER'] ?? '').toLowerCase(),
	model: process.env['FADE_AI_MODEL'] ?? '',
	googleApiKey: process.env['GOOGLE_API_KEY'] ?? '',
	openaiApiKey: process.env['OPENAI_API_KEY'] ?? '',
	anthropicApiKey: process.env['ANTHROPIC_API_KEY'] ?? '',
	groqApiKey: process.env['GROQ_API_KEY'] ?? '',
	tabiApiKey: process.env['TABI_API_KEY'] ?? '',
	tabiBaseUrl: process.env['TABI_BASE_URL'] ?? '',
};

export async function buildLlm(): Promise<BaseChatModel> {
	const p = agentConfig.provider || 'google';
	const model = agentConfig.model;
	if (!model)
		throw new Error(
			'No AI model set. Open Settings (⚙) and enter your provider + model name.',
		);

	if (p === 'openai') {
		if (!agentConfig.openaiApiKey)
			throw new Error('OPENAI_API_KEY not set. Add it in Settings (⚙).');
		const { ChatOpenAI } = await import('@langchain/openai');
		return new ChatOpenAI({
			model,
			temperature: 0,
			apiKey: agentConfig.openaiApiKey,
		});
	}
	if (p === 'anthropic') {
		if (!agentConfig.anthropicApiKey)
			throw new Error('ANTHROPIC_API_KEY not set. Add it in Settings (⚙).');
		const { ChatAnthropic } = await import('@langchain/anthropic');
		return new ChatAnthropic({
			model,
			temperature: 0,
			apiKey: agentConfig.anthropicApiKey,
		});
	}
	if (p === 'groq') {
		if (!agentConfig.groqApiKey)
			throw new Error('GROQ_API_KEY not set. Add it in Settings (⚙).');
		const { ChatGroq } = await import('@langchain/groq');
		return new ChatGroq({
			model,
			temperature: 0,
			apiKey: agentConfig.groqApiKey,
		});
	}
	if (p === 'tabi') {
		if (!agentConfig.tabiApiKey)
			throw new Error('TABI_API_KEY not set. Add it in Settings (⚙).');
		if (!agentConfig.tabiBaseUrl)
			throw new Error('TABI_BASE_URL not set. Add it in Settings (⚙).');
		const { ChatOpenAI } = await import('@langchain/openai');
		return new ChatOpenAI({
			model,
			temperature: 1,
			apiKey: agentConfig.tabiApiKey,
			configuration: { baseURL: agentConfig.tabiBaseUrl },
		});
	}
	// Default: Google
	if (!agentConfig.googleApiKey)
		throw new Error('GOOGLE_API_KEY not set. Add it in Settings (⚙).');
	const { ChatGoogleGenerativeAI } = await import('@langchain/google-genai');
	return new ChatGoogleGenerativeAI({
		model,
		temperature: 0,
		apiKey: agentConfig.googleApiKey,
	});
}

export async function buildAgent() {
	const llm = await buildLlm();
	const llmWithTools = llm.bindTools(ALL_TOOLS);
	const toolNode = new ToolNode(ALL_TOOLS);

	const callModel = async (state: typeof MessagesAnnotation.State) => {
		const messages = [new SystemMessage(SYSTEM_PROMPT), ...state.messages];
		const response = await llmWithTools.invoke(messages);
		return { messages: [response] };
	};

	const shouldContinue = (state: typeof MessagesAnnotation.State) => {
		const last = state.messages.at(-1);
		if (
			last &&
			'tool_calls' in last &&
			Array.isArray(last.tool_calls) &&
			last.tool_calls.length > 0
		) {
			return 'tools';
		}
		return END;
	};

	return new StateGraph(MessagesAnnotation)
		.addNode('agent', callModel)
		.addNode('tools', toolNode)
		.addEdge(START, 'agent')
		.addConditionalEdges('agent', shouldContinue, {
			tools: 'tools',
			[END]: END,
		})
		.addEdge('tools', 'agent')
		.compile();
}

let _agent: Awaited<ReturnType<typeof buildAgent>> | null = null;

export async function getAgent(fadePort = 8000) {
	setFadePort(fadePort);
	if (!_agent) _agent = await buildAgent();
	return _agent;
}

export function resetAgent() {
	_agent = null;
}

export async function getAgentLlm() {
	return buildLlm();
}
