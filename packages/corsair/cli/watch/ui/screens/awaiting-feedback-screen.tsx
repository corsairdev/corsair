import React from "react";
import { Box, Text } from "ink";
import type { StateContext } from "../../types/state.js";
import { CommandBar } from "../components/command-bar.js";

interface AwaitingFeedbackScreenProps {
  context: StateContext;
}

export const AwaitingFeedbackScreen: React.FC<AwaitingFeedbackScreenProps> = ({
  context,
}) => {
  const query = context.currentQuery;
  const files = context.generatedFiles || [];
  const llmResponse = context.llmResponse;
  const newOperation = context.newOperation;

  // If we have an LLM response, show LLM feedback instead of generation feedback
  if (llmResponse && newOperation) {
    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="magenta"
        padding={1}
      >
        <Text color="magenta" bold>
          🤖 AI Analysis Complete
        </Text>
        <Text> </Text>

        <Text>
          Operation: <Text color="cyan">"{newOperation.operationName}"</Text>
        </Text>
        <Text>
          Type: <Text color="yellow">{newOperation.operationType}</Text>
        </Text>
        <Text>
          Complexity: <Text color={llmResponse.analysis.complexity === "low" ? "green" : llmResponse.analysis.complexity === "medium" ? "yellow" : "red"}>
            {llmResponse.analysis.complexity.toUpperCase()}
          </Text>
        </Text>
        <Text>
          Confidence: <Text color="green">{Math.round(llmResponse.analysis.confidence * 100)}%</Text>
        </Text>

        <Text> </Text>
        <Text color="cyan" bold>💡 Suggestions:</Text>
        {llmResponse.suggestions.map((suggestion, i) => (
          <Text key={i} dimColor>
            • {suggestion}
          </Text>
        ))}

        <Text> </Text>
        <Text color="cyan" bold>🔧 Recommendations:</Text>
        {llmResponse.recommendations.dependencies && (
          <Text dimColor>
            Dependencies: <Text color="yellow">{llmResponse.recommendations.dependencies}</Text>
          </Text>
        )}
        {llmResponse.recommendations.handler && (
          <Text dimColor>
            Handler: <Text color="yellow">{llmResponse.recommendations.handler}</Text>
          </Text>
        )}
        {llmResponse.recommendations.optimizations.map((opt, i) => (
          <Text key={i} dimColor>
            • {opt}
          </Text>
        ))}

        <Text> </Text>
        <Text color="cyan" bold>📝 Analysis:</Text>
        <Text dimColor>{llmResponse.analysis.reasoning}</Text>

        <CommandBar
          commands={[
            { key: "A", label: "Accept" },
            { key: "R", label: "Regenerate" },
            { key: "M", label: "Modify" },
            { key: "C", label: "Cancel" },
          ]}
        />
      </Box>
    );
  }

  // Default generation feedback UI
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="green"
      padding={1}
    >
      <Text color="green" bold>
        ✓ Generated Successfully
      </Text>
      <Text> </Text>

      {query && (
        <>
          <Text>
            Query: <Text color="cyan">"{query.nlQuery}"</Text>
          </Text>
          <Text>
            Function: <Text color="green">{query.id}</Text>
          </Text>
        </>
      )}

      <Text> </Text>
      <Text>Generated files:</Text>
      {files.map((file, i) => (
        <Text key={i} dimColor>
          {" "}
          • {file}
        </Text>
      ))}

      <CommandBar
        commands={[
          { key: "R", label: "Regenerate" },
          { key: "T", label: "Tweak" },
          { key: "U", label: "Undo" },
          { key: "A", label: "Accept" },
        ]}
      />
    </Box>
  );
};
