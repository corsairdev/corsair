# Corsair LLM Integration

This module provides LLM integration for the Corsair CLI tool, allowing AI-powered analysis of new queries and mutations.

## Features

- **Multi-provider support**: OpenAI, Groq, and Together AI
- **Structured outputs**: Uses Zod schemas for type-safe responses
- **CLI integration**: Seamless integration with the watch tool UI

## Configuration

Set the appropriate environment variable for your chosen provider:

```bash
# For OpenAI (default)
export OPENAI_API_KEY=your_openai_api_key

# For Groq
export GROQ_API_KEY=your_groq_api_key

# For Together AI
export TOGETHER_API_KEY=your_together_api_key

# Choose provider (optional, defaults to "openai")
export CORSAIR_LLM_PROVIDER=openai  # or "groq" or "together"
```

## Usage

When a new query or mutation is detected, the CLI will automatically:

1. Transition to `LLM_PROCESSING` state showing a spinner and timer
2. Call the configured LLM provider with the operation details
3. Display structured AI suggestions including:
   - Configuration recommendations
   - Performance optimizations
   - Complexity analysis
   - Confidence scores

## API

```typescript
import { llm, type Providers } from "./llm/index.js";
import { z } from "zod";

const schema = z.object({
  suggestions: z.array(z.string()),
  confidence: z.number().min(0).max(1)
});

const result = await llm({
  provider: "openai",
  prompt: "Analyze this operation...",
  schema: schema
});
```

## CLI Flow

1. Developer adds a new `corsairQuery()` or `corsairMutation()`
2. CLI detects the new operation
3. User configures operation in configuration screen
4. LLM analyzes the operation and provides suggestions
5. User can accept, modify, regenerate, or cancel the suggestions

## States

- `LLM_PROCESSING`: Shows spinner while AI analyzes
- `AWAITING_FEEDBACK`: Shows AI suggestions with user options