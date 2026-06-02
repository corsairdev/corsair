---
title: OpenAI Agents
description: Connect Corsair to the OpenAI Agents SDK.
---

Use `OpenAIAgentsProvider` to connect Corsair to the [OpenAI Agents SDK](https://github.com/openai/openai-agents-js).

## Install

```bash
npm install @openai/agents
```

## Usage

```ts agent.ts
import { OpenAIAgentsProvider } from '@corsair-dev/mcp';
import { Agent, run, tool } from '@openai/agents';
import { corsair } from './corsair';

const provider = new OpenAIAgentsProvider();
const tools = provider.build({ corsair, tool });

const agent = new Agent({
    name: 'corsair-agent',
    model: 'gpt-4.1',
    instructions:
        'You have access to Corsair tools. Use list_operations to discover available APIs, get_schema to understand required arguments, and run_script to execute them. When referencing resources (like channels), always use their ID, not their name.',
    tools,
});

const result = await run(agent, 'Setup corsair, then list all Slack channels.');
console.log(result.finalOutput);
```

`OpenAIAgentsProvider.build()` is async — it dynamically imports `@openai/agents` as an optional peer dependency. Pass the `tool` function from `@openai/agents` so the provider can wrap each Corsair tool in the correct format.
