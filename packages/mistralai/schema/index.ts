export const MistralAiSchema = {
	version: '1.0.0',
	// Completions, embeddings and classifications are computed per call, and
	// models, files, batch jobs and agents live on Mistral's side; nothing
	// here is worth mirroring locally.
	entities: {},
} as const;
