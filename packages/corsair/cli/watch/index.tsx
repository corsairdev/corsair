#!/usr/bin/env node

import React from 'react'
import { render } from 'ink'
import chokidar from 'chokidar'
import { eventBus } from './core/event-bus.js'
import { CorsairEvent } from './types/events.js'
import { CorsairUI } from './ui/renderer.js'
import { Project } from 'ts-morph'
import { loadConfig, loadEnv } from '../config.js'

// Import handlers to initialize them
import './handlers/file-change-handler.js'
import './handlers/query-generator.js'
import './handlers/user-input-handler.js'
import './handlers/error-handler.js'
import './handlers/schema-change-handler.js'

// Import operations handlers
import { Queries, Mutations } from './handlers/operations-handler.js'
import { Schema } from './handlers/schema-handler.js'

// Also import state machine to initialize it
import './core/state-machine.js'

/**
 * Corsair Watch - Main Entry Point
 *
 * Event-driven CLI that watches for database query definitions
 * and auto-generates query logic and TypeScript types.
 */
export async function watch(): Promise<void> {
  console.clear()
  console.log('Starting Corsair Watch...\n')

  // Load environment variables first
  const cfg = loadConfig()
  loadEnv(cfg.envFile)

  // Start file watcher - watch entire directory but filter in the change handler
  const watcher = chokidar.watch('.', {
    ignored:
      /(node_modules|\.next|dist|\.git|\.turbo|coverage|__tests__|\.test\.|\.spec\.)/,
    persistent: true,
    ignoreInitial: true,
    usePolling: true,
  })

  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
  })

  // Initialize operations handlers
  const queriesHandler = new Queries()
  const mutationsHandler = new Mutations()
  const schemaHandler = new Schema()

  watcher.on('ready', async () => {
    // Parse queries, mutations, and schema files on startup
    await queriesHandler.parse()
    await mutationsHandler.parse()
    await schemaHandler.parse()

    console.log('✓ File watcher ready. Watching for changes...\n')

    console.clear()
  })

  watcher.on('change', async path => {
    // Only process .ts and .tsx files
    if (!path.endsWith('.ts') && !path.endsWith('.tsx')) {
      return
    }

    // Handle queries/mutations file changes
    if (path.includes('corsair/queries.ts')) {
      await queriesHandler.update()
      return
    }

    if (path.includes('corsair/mutations.ts')) {
      await mutationsHandler.update()
      return
    }

    if (path.includes('corsair/schema.ts')) {
      await schemaHandler.update()
      return
    }

    // Skip other generated corsair files
    if (path.includes('/corsair/') || path.includes('\\corsair\\')) {
      return
    }

    // Refresh the entire project from filesystem to pick up latest changes
    const sourceFile = project.getSourceFile(path)

    if (!sourceFile) {
      return
    }

    eventBus.emit(CorsairEvent.FILE_CHANGED, {
      file: path,
      timestamp: Date.now(),
      project,
    })
  })

  watcher.on('error', error => {
    console.error('Watcher error:', error)
  })

  // watcher.on("add", (path) => {
  //   // Treat new files as changes
  //   eventBus.emit(CorsairEvent.FILE_CHANGED, {
  //     file: path,
  //     timestamp: Date.now(),
  //   });
  // });

  // watcher.on("error", (error) => {
  //   if (error instanceof Error) {
  //     eventBus.emit(CorsairEvent.ERROR_OCCURRED, {
  //       message: `File watcher error: ${error.message}`,
  //       code: "WATCHER_ERROR",
  //       stack: error.stack,
  //     });
  //   }
  // });

  // Render UI
  const { unmount, waitUntilExit } = render(<CorsairUI />)

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down...')
    watcher.close()
    unmount()
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    console.log('\nShutting down...')
    watcher.close()
    unmount()
    process.exit(0)
  })

  // Wait for exit
  await waitUntilExit()

  // Cleanup
  watcher.close()
}
