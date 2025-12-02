import React, { useState, useEffect } from 'react'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import type { StateContext } from '../../types/state.js'

interface LLMScreenProps {
  context: StateContext
}

const formatElapsedTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export const LLMScreen: React.FC<LLMScreenProps> = ({ context }) => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const newOperation = context.newOperation

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="magenta"
      padding={1}
    >
      <Box>
        <Text color="magenta" bold>
          🤖 AI Assistant{' '}
        </Text>
        <Spinner type="dots" />
        <Text color="magenta" bold>
          {' '}
          Processing...
        </Text>
      </Box>
      <Text> </Text>

      {newOperation && (
        <>
          <Text>
            Type: <Text color="cyan">{newOperation.operationType}</Text>
          </Text>
          <Text>
            Name: <Text color="cyan">"{newOperation.operationName}"</Text>
          </Text>
          <Text>
            Function: <Text dimColor>{newOperation.functionName}</Text>
          </Text>
          <Text>
            Source:{' '}
            <Text dimColor>
              {newOperation.file}:{newOperation.lineNumber}
            </Text>
          </Text>
          <Text> </Text>
          <Text>
            Prompt: <Text color="yellow">"{newOperation.prompt}"</Text>
          </Text>
        </>
      )}

      <Text> </Text>
      <Box>
        <Text dimColor>Elapsed: </Text>
        <Text color="green">{formatElapsedTime(elapsedTime)}</Text>
      </Box>

      <Text> </Text>
      <Text dimColor>Agent is generating the operation file...</Text>
      <Text dimColor>
        This includes writing code, validating TypeScript, and fixing any
        errors.
      </Text>
    </Box>
  )
}
