import { corsairTools } from '@corsair-dev/langchain';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { corsair, TENANT } from '../corsair';
import { llm } from '../llm';

const tools = await corsairTools({
	corsair,
	plugin: 'slack',
	tenantId: TENANT,
});

const agent = createReactAgent({ llm, tools });

const result = await agent.invoke({
	messages: [{ role: 'user', content: 'List the Slack channels.' }],
});

console.log(result.messages.at(-1)?.content);
