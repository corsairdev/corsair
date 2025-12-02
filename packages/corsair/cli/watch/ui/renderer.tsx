import React, { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import { stateMachine } from '../core/state-machine.js'
import { eventBus } from '../core/event-bus.js'
import { CorsairEvent } from '../types/events.js'
import { CorsairState, type ApplicationState } from '../types/state.js'
import { IdleScreen } from './screens/idle-screen.js'
import { GeneratingScreen } from './screens/generating-screen.js'
import { AwaitingFeedbackScreen } from './screens/awaiting-feedback-screen.js'
import { ErrorScreen } from './screens/error-screen.js'
import { OperationsScreen } from './screens/operations-screen.js'
import { OperationDetailScreen } from './screens/operation-detail-screen.js'
import { OperationConfigurationScreen } from './screens/operation-configuration-screen.js'
import { LLMScreen } from './screens/llm-screen.js'

// Global keyboard shortcuts available across all screens
const GLOBAL_SHORTCUTS = [
  { key: 'q', label: 'Queries' },
  { key: 'm', label: 'Mutations' },
  { key: 'h', label: 'Help' },
  { key: 'ctrl+c', label: 'Quit' },
]

// Bottom bar component that displays global shortcuts
const BottomBar: React.FC = () => {
  return (
    <Box borderStyle="single" borderColor="gray" paddingX={1} marginTop={1}>
      <Box gap={2}>
        {GLOBAL_SHORTCUTS.map((shortcut, index) => (
          <Text key={index} dimColor>
            [
            <Text bold color="cyan">
              {shortcut.key}
            </Text>
            ] {shortcut.label}
          </Text>
        ))}
      </Box>
    </Box>
  )
}

type CorsairUIProps = {
  warnings?: string[]
}

export const CorsairUI: React.FC<CorsairUIProps> = ({ warnings }) => {
  const [state, setState] = useState<ApplicationState>(
    stateMachine.getCurrentState()
  )

  useEffect(() => {
    const handler = () => {
      setState(stateMachine.getCurrentState())
    }

    eventBus.on(CorsairEvent.STATE_CHANGED, handler)

    return () => {
      eventBus.off(CorsairEvent.STATE_CHANGED, handler)
    }
  }, [])

  // Handle keyboard input
  useInput((input, key) => {
    const inputLower = input.toLowerCase()

    // Global shortcuts
    if (key.ctrl && input === 'c') {
      eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'quit' })
      return
    }

    if (inputLower === 'q' && state.state === CorsairState.IDLE) {
      eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'queries' })
      return
    }

    if (inputLower === 'm' && state.state === CorsairState.IDLE) {
      eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'mutations' })
      return
    }

    if (state.state === CorsairState.IDLE) {
      const list = state.context.unfinishedOperations || []
      if (/^[0-9]$/.test(inputLower)) {
        const idx = parseInt(inputLower, 10)
        if (idx >= 1 && idx <= list.length) {
          const item = list[idx - 1]
          eventBus.emit(CorsairEvent.USER_COMMAND, {
            command: 'resume_unfinished',
            args: { id: item!.id },
          })
          return
        }
      }
    }

    if (inputLower === 'h') {
      eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'help' })
      return
    }

    // Commands available in AWAITING_FEEDBACK state
    if (state.state === CorsairState.AWAITING_FEEDBACK) {
      if (state.context.llmResponse) {
        if (inputLower === 'u') {
          eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'update' })
        } else if (inputLower === 'h') {
          eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'help' })
        } else if (key.escape || inputLower === 'q' || inputLower === 'c') {
          eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'cancel' })
        }
      } else {
        if (inputLower === 'r') {
          eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'regenerate' })
        } else if (inputLower === 't') {
          eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'tweak' })
        } else if (inputLower === 'u') {
          eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'undo' })
        } else if (inputLower === 'a') {
          eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'accept' })
        } else if (inputLower === 'm') {
          eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'modify' })
        } else if (inputLower === 'c') {
          eventBus.emit(CorsairEvent.USER_COMMAND, { command: 'cancel' })
        }
      }
    }
  })

  // Render the appropriate screen based on state
  let currentScreen
  switch (state.state) {
    case CorsairState.IDLE:
      currentScreen = <IdleScreen context={state.context} />
      break

    case CorsairState.DETECTING:
    case CorsairState.GENERATING:
      currentScreen = <GeneratingScreen context={state.context} />
      break

    case CorsairState.AWAITING_FEEDBACK:
      currentScreen = <AwaitingFeedbackScreen context={state.context} />
      break

    case CorsairState.ERROR:
      currentScreen = <ErrorScreen context={state.context} />
      break

    case CorsairState.PROMPTING:
      // TODO: Implement prompting screen
      currentScreen = <IdleScreen context={state.context} />
      break

    case CorsairState.MODIFYING:
      // TODO: Implement modifying screen
      currentScreen = <GeneratingScreen context={state.context} />
      break

    case CorsairState.VIEWING_QUERIES:
    case CorsairState.VIEWING_MUTATIONS:
      currentScreen = <OperationsScreen context={state.context} />
      break

    case CorsairState.VIEWING_OPERATION_DETAIL:
      currentScreen = <OperationDetailScreen context={state.context} />
      break

    case CorsairState.CONFIGURING_NEW_OPERATION:
      currentScreen = <OperationConfigurationScreen context={state.context} />
      break

    case CorsairState.LLM_PROCESSING:
      currentScreen = <LLMScreen context={state.context} />
      break

    default:
      currentScreen = <IdleScreen context={state.context} />
  }

  // Hide bottom bar in operations screens since they have their own navigation
  const showBottomBar =
    state.state !== CorsairState.VIEWING_QUERIES &&
    state.state !== CorsairState.VIEWING_MUTATIONS &&
    state.state !== CorsairState.VIEWING_OPERATION_DETAIL &&
    state.state !== CorsairState.CONFIGURING_NEW_OPERATION &&
    state.state !== CorsairState.LLM_PROCESSING

  // Wrap screen with layout that includes bottom bar
  return (
    <Box flexDirection="column">
      {!!warnings?.length && (
        <Box
          borderStyle="single"
          borderColor="yellow"
          flexDirection="column"
          paddingX={1}
          marginBottom={1}
        >
          <Text color="yellow">
            Warning: Some configured Corsair paths are missing
          </Text>
          {warnings.map((w, i) => (
            <Text key={i} dimColor>
              {w}
            </Text>
          ))}
        </Box>
      )}
      {currentScreen}
      {showBottomBar && <BottomBar />}
    </Box>
  )
}
