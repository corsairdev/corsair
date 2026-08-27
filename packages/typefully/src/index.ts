import { TypefullyAuthSchema, CreateDraftSchema } from './schemas';

export class TypefullyPlugin {
  private apiKey: string;
  private baseUrl = 'https://typefully.com';

  constructor(config: { apiKey: string }) {
    const parsed = TypefullyAuthSchema.parse(config);
    this.apiKey = parsed.apiKey;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async createDraft(data: { text: string }) {
    const validated = CreateDraftSchema.parse(data);
    const response = await fetch(`${this.baseUrl}/drafts/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(validated),
    });

    if (response.status === 429) {
      throw new Error('Typefully API Rate Limit Exceeded (429)');
    }

    if (!response.ok) {
      throw new Error(`Typefully API Error: ${response.statusText}`);
    }

    return response.json();
  }
}
