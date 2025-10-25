import React from 'react';
import { Box, Text, useInput } from 'ink';
import type { StateContext } from '../../types/state.js';
import { eventBus } from '../../core/event-bus.js';
import { CorsairEvent } from '../../types/events.js';

interface OperationDetailScreenProps {
  context: StateContext;
}

export const OperationDetailScreen: React.FC<OperationDetailScreenProps> = ({ context }) => {
  const operationsView = context.operationsView;

  if (!operationsView || !operationsView.selectedOperation) {
    return null;
  }

  const { type, selectedOperation } = operationsView;

  // Get the operation details
  const operationsMap = type === 'queries' ? context.queries : context.mutations;
  const operation = operationsMap?.get(selectedOperation);

  if (!operation) {
    return null;
  }

  const displayColor = type === 'queries' ? 'cyan' : 'yellow';
  const operationType = type === 'queries' ? 'Query' : 'Mutation';

  // Handle keyboard input
  useInput((input, key) => {
    if (key.escape) {
      eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'go_back' });
    }
  });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={displayColor} padding={1}>
      {/* Header with type badge */}
      <Box justifyContent="space-between">
        <Text color={displayColor} bold>
          Operation Details
        </Text>
        <Box>
          <Text backgroundColor={displayColor} color="black" bold>
            {' '}{operationType}{' '}
          </Text>
        </Box>
      </Box>

      <Text> </Text>

      {/* Function Name */}
      <Box flexDirection="column" marginBottom={1}>
        <Text dimColor>Function Name:</Text>
        <Text color={displayColor} bold>
          {operation.name}
        </Text>
      </Box>

      {/* Prompt */}
      <Box flexDirection="column" marginBottom={1}>
        <Text dimColor>Prompt:</Text>
        <Box paddingLeft={2} flexDirection="column">
          <Text color="white">{operation.prompt}</Text>
        </Box>
      </Box>

      {/* Dependencies (if present) */}
      {operation.dependencies && (
        <Box flexDirection="column" marginBottom={1}>
          <Text dimColor>Dependencies:</Text>
          <Box paddingLeft={2}>
            <Text color="gray">{operation.dependencies}</Text>
          </Box>
        </Box>
      )}

      {/* Navigation hint */}
      <Box marginTop={1} borderTop borderStyle="single" borderColor="gray" paddingTop={1}>
        <Text dimColor>[ESC] Back to operations list</Text>
      </Box>
    </Box>
  );
};
