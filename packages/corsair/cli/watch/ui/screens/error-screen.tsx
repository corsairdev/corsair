import React from 'react';
import { Box, Text } from 'ink';
import type { StateContext } from '../../types/state.js';
import { CommandBar } from '../components/command-bar.js';

interface ErrorScreenProps {
  context: StateContext;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ context }) => {
  const error = context.error;

  if (!error) return null;

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="red" padding={1}>
      <Text color="red" bold>✗ Error</Text>
      <Text> </Text>

      <Text color="red">{error.message}</Text>

      {error.code && (
        <Text dimColor>Code: {error.code}</Text>
      )}

      {error.suggestions && error.suggestions.length > 0 && (
        <>
          <Text> </Text>
          <Text>Suggestions:</Text>
          {error.suggestions.map((suggestion, i) => (
            <Text key={i} dimColor>  • {suggestion}</Text>
          ))}
        </>
      )}

      <CommandBar
        commands={[
          { key: 'H', label: 'Help' },
          { key: 'Q', label: 'Quit' },
        ]}
      />
    </Box>
  );
};
