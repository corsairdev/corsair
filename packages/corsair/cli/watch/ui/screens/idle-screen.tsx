import React from 'react';
import { Box, Text } from 'ink';
import type { StateContext, HistoryEntry } from '../../types/state.js';
import { CommandBar } from '../components/command-bar.js';

interface IdleScreenProps {
  context: StateContext;
}

const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
};

const getActivityIcon = (action: string): { icon: string; color: string } => {
  if (action.includes('New query detected')) {
    return { icon: '✨Q', color: 'cyan' };
  }
  if (action.includes('New mutation detected')) {
    return { icon: '✨M', color: 'cyan' };
  }
  if (action.includes('Added query')) {
    return { icon: '+ Q', color: 'green' };
  }
  if (action.includes('Added mutation')) {
    return { icon: '+ M', color: 'green' };
  }
  if (action.includes('Removed query')) {
    return { icon: '- Q', color: 'red' };
  }
  if (action.includes('Removed mutation')) {
    return { icon: '- M', color: 'red' };
  }
  if (action.includes('Updated query')) {
    return { icon: '~ Q', color: 'yellow' };
  }
  if (action.includes('Updated mutation')) {
    return { icon: '~ M', color: 'yellow' };
  }
  if (action.includes('Operation configuration')) {
    return { icon: '🔧', color: 'magenta' };
  }
  return { icon: '•', color: 'blue' };
};

const parseOperationDetails = (details: string): { operationName: string; context: string } => {
  // Match patterns like "operationName in fileName" or "operationName from fileName"
  const match = details.match(/^(.+?)\s+(in|from)\s+(.+)$/);
  if (match) {
    return {
      operationName: match[1],
      context: `${match[2]} ${match[3]}`
    };
  }
  // Fallback if pattern doesn't match
  return {
    operationName: details,
    context: ''
  };
};

const ActivityEntry: React.FC<{ entry: HistoryEntry }> = ({ entry }) => {
  const { icon, color } = getActivityIcon(entry.action);
  const timeAgo = formatTimeAgo(entry.timestamp);

  return (
    <Box>
      <Text color={color as any} bold>
        [{icon}]
      </Text>
      <Text> </Text>
      <Text>
        {entry.action}
        {entry.details && (
          <>
            {' - '}
            {(() => {
              const { operationName, context } = parseOperationDetails(entry.details);
              return (
                <>
                  <Text color="cyan" bold>{operationName}</Text>
                  {context && <Text> {context}</Text>}
                </>
              );
            })()}
          </>
        )}
      </Text>
      <Text dimColor> ({timeAgo})</Text>
    </Box>
  );
};

export const IdleScreen: React.FC<IdleScreenProps> = ({ context }) => {
  const watchPaths = context.watchedPaths?.join(', ') || 'src/**/*.{ts,tsx}';
  const recentActivity = context.history.slice(-5).reverse();

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="blue" padding={1}>
      <Text color="blue" bold>🎯 Corsair - Watching</Text>
      <Text> </Text>
      <Text>Status: <Text color="green">Idle</Text></Text>
      <Text>Watching: <Text dimColor>{watchPaths}</Text></Text>

      {recentActivity.length > 0 && (
        <>
          <Text> </Text>
          <Text dimColor>━━━ Recent Activity ━━━</Text>
          {recentActivity.map((entry, i) => (
            <ActivityEntry key={`${entry.timestamp}-${i}`} entry={entry} />
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
