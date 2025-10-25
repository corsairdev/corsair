import React from 'react';
import { Box, Text } from 'ink';
import type { StateContext } from '../../types/state.js';
import { ProgressBar } from '../components/progress-bar.js';

interface GeneratingScreenProps {
  context: StateContext;
}

export const GeneratingScreen: React.FC<GeneratingScreenProps> = ({ context }) => {
  const query = context.currentQuery;
  const progress = context.generationProgress;

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1}>
      <Text color="yellow" bold>🤖 Generating...</Text>
      <Text> </Text>

      {query && (
        <>
          <Text>Query: <Text color="cyan">"{query.nlQuery}"</Text></Text>
          <Text>Function: <Text dimColor>{query.id}</Text></Text>
          <Text>Source: <Text dimColor>{query.sourceFile}:{query.lineNumber}</Text></Text>
        </>
      )}

      {progress && (
        <>
          <Text> </Text>
          <Text>Stage: {progress.stage}</Text>
          <ProgressBar percentage={progress.percentage} />
          {progress.message && <Text dimColor>{progress.message}</Text>}
        </>
      )}
    </Box>
  );
};
