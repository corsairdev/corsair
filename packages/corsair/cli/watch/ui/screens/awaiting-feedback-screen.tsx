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
