import { SystemMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
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

function buildLlm() {
	return new ChatGoogleGenerativeAI({
		model: process.env['GEMINI_MODEL'] ?? 'gemini-2.0-flash',
		temperature: 0,
	});
}

export function buildAgent() {
	const llm = buildLlm();
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

	const graph = new StateGraph(MessagesAnnotation)
		.addNode('agent', callModel)
		.addNode('tools', toolNode)
		.addEdge(START, 'agent')
		.addConditionalEdges('agent', shouldContinue, {
			tools: 'tools',
			[END]: END,
		})
		.addEdge('tools', 'agent');

	return graph.compile();
}

/** Singleton agent instance */
let _agent: ReturnType<typeof buildAgent> | null = null;

export function getAgent(fadePort = 8000) {
	setFadePort(fadePort);
	if (!_agent) {
		_agent = buildAgent();
	}
	return _agent;
}

/** Bare LLM without tools — for pipeline use */
export function getAgentLlm() {
	return buildLlm();
}
