# Perplexity AI Plugin for Corsair

This package provides an official Perplexity AI integration for Corsair. 

## Features
- Chat completions powered by Perplexity's Sonar models.
- Support for beta features such as Citations and Images.

## Setup
You need an active Perplexity AI account and an API Key.
Generate your key from the Perplexity Developer Console.

Supply it to the provider configuration:
```typescript
import { createCorsair } from 'corsair';
import { perplexityai } from '@corsair-dev/perplexityai';

export const corsair = createCorsair({
  // ...
  plugins: [
    perplexityai({
      key: process.env.PERPLEXITYAI_API_KEY,
    }),
  ],
});
```

## Usage

### Chat Completions
Generates a response from a given conversation context.

```typescript
const response = await corsair.perplexityai.api.chat.completions({
  model: 'llama-3.1-sonar-small-128k-online',
  messages: [
    { role: 'user', content: 'What is the current weather in Paris?' }
  ],
  return_citations: true,
});

console.log(response.choices[0].message.content);
console.log(response.citations);
```

### Quirks & Constraints
- **Penalties**: `presence_penalty` and `frequency_penalty` are mutually exclusive constraints in the Perplexity AI API. You cannot supply both parameters simultaneously, and the plugin will actively validate against this.
