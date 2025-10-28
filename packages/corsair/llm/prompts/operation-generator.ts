import type { SchemaDefinition } from "../../cli/watch/types/state.js";

export const operationGeneratorPrompt = ({
  type,
  name,
  schema,
}: {
  type: "query" | "mutation";
  name: string;
  schema: SchemaDefinition;
}): string => ``;
