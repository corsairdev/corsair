#!/usr/bin/env node

import React from 'react'
import { render } from 'ink'
import chokidar from 'chokidar'
import { eventBus } from './core/event-bus.js'
import { CorsairEvent } from './types/events.js'
import { CorsairUI } from './ui/renderer.js'
import { Project } from 'ts-morph'
import * as path from 'path'
import { existsSync, writeFileSync, unlinkSync } from 'fs'
import { pathToFileURL } from 'url'
import { spawn } from 'child_process'
import {
  loadConfig,
  loadEnv,
  getResolvedPaths,
  validatePaths,
} from '../config.js'
import type { SchemaDefinition } from './types/state.js'

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

  async function tryLoadUnifiedSchema(): Promise<{
    schema?: SchemaDefinition
    configPath?: string
  }> {
    const cwd = process.cwd()
    const candidates = [
      'corsair.config.js',
      'corsair.config.mjs',
      'corsair.config.cjs',
      'corsair.config.ts',
    ]
    for (const file of candidates) {
      const full = path.resolve(cwd, file)
      if (!existsSync(full)) continue
      try {
        let mod: any
        if (file.endsWith('.ts')) {
          const loaderScript = `
            import { pathToFileURL } from 'url';
            import { createRequire } from 'module';
            const require = createRequire(import.meta.url);
            
            const Module = require('module');
            const originalRequire = Module.prototype.require;
            Module.prototype.require = function(id) {
              if (id === 'server-only' || id.endsWith('/server-only')) {
                return {};
              }
              return originalRequire.apply(this, arguments);
            };
            
            const mod = await import(pathToFileURL('${full.replace(/\\/g, '\\\\')}').href);
            const cfg = mod?.config ?? mod?.default ?? mod;
            const unified = cfg?.unifiedSchema ?? cfg?.config?.unifiedSchema;
            if (unified && typeof unified === 'object') {
              console.log(JSON.stringify(unified));
            }
          `
          const tempFile = path.join(cwd, '.corsair-temp-loader.mjs')
          writeFileSync(tempFile, loaderScript)

          const result = await new Promise<string>((resolve, reject) => {
            const child = spawn('npx', ['tsx', tempFile], {
              cwd,
              stdio: ['ignore', 'pipe', 'pipe'],
              env: {
                ...process.env,
                NEXT_RUNTIME: 'nodejs',
                NODE_ENV: process.env.NODE_ENV || 'development',
              },
            })

            let stdout = ''
            let stderr = ''

            child.stdout.on('data', data => {
              stdout += data.toString()
            })

            child.stderr.on('data', data => {
              stderr += data.toString()
            })

            child.on('close', code => {
              try {
                unlinkSync(tempFile)
              } catch {}

              if (code === 0) {
                resolve(stdout)
              } else {
                reject(new Error(stderr || `Process exited with code ${code}`))
              }
            })
          })

          const lines = result.split('\n').filter(line => line.trim())
          const jsonLine = lines.find(line => line.startsWith('{'))
          if (jsonLine) {
            const schema = JSON.parse(jsonLine) as SchemaDefinition
            return { schema, configPath: full }
          }
        } else {
          mod = await import(pathToFileURL(full).href)
          const cfg = mod?.config ?? mod?.default ?? mod
          const unified = cfg?.unifiedSchema ?? cfg?.config?.unifiedSchema
          if (unified && typeof unified === 'object') {
            const schema = unified as SchemaDefinition
            return { schema, configPath: full }
          }
        }
      } catch (err) {
        console.error('Error loading config:', err)
      }
    }
    return {}
  }

  // Load environment variables first
  const cfg = loadConfig()
  loadEnv(cfg.envFile ?? '.env.local')

  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
  })

  // Initialize operations handlers
  const paths = getResolvedPaths(cfg)
  const warnings = validatePaths(cfg)

  const queriesHandler = new Queries(paths.queriesDir)
  const mutationsHandler = new Mutations(paths.mutationsDir)
  const schemaHandler = new Schema(paths.schemaFile)

  let loadedSchema: SchemaDefinition | undefined
  let schemaConfigPath: string | undefined
  try {
    const { schema, configPath } = await tryLoadUnifiedSchema()
    if (schema) {
      loadedSchema = schema
      schemaConfigPath = configPath
      eventBus.emit(CorsairEvent.SCHEMA_LOADED, { schema })
    }
  } catch (err) {
    console.error('Error loading unified schema:', err)
  }

  // Parse operations immediately, don't wait for watcher ready
  console.log('Parsing operations...')
  await queriesHandler.parse()
  await mutationsHandler.parse()
  if (!loadedSchema && existsSync(paths.schemaFile)) {
    await schemaHandler.parse()
  }

  // Start file watcher - watch entire directory but filter in the change handler
  const watcher = chokidar.watch('.', {
    ignored:
      /(node_modules|\.next|dist|\.git|\.turbo|coverage|__tests__|\.test\.|\.spec\.)/,
    persistent: true,
    ignoreInitial: true,
    usePolling: true,
  })

  if (existsSync(paths.operationsFile)) {
    try {
      const operationsFile = project.addSourceFileAtPath(paths.operationsFile)
      const imports = operationsFile.getImportDeclarations()
      const desiredQueries = path
        .relative(path.dirname(paths.operationsFile), paths.queriesDir)
        .replace(/\\/g, '/')
      const desiredMutations = path
        .relative(path.dirname(paths.operationsFile), paths.mutationsDir)
        .replace(/\\/g, '/')
      const normalizedQueries = desiredQueries.startsWith('.')
        ? desiredQueries
        : `./${desiredQueries}`
      const normalizedMutations = desiredMutations.startsWith('.')
        ? desiredMutations
        : `./${desiredMutations}`

      const queriesImport = imports.find(
        d => d.getNamespaceImport()?.getText() === 'queriesModule'
      )
      const mutationsImport = imports.find(
        d => d.getNamespaceImport()?.getText() === 'mutationsModule'
      )

      if (queriesImport) {
        if (queriesImport.getModuleSpecifierValue() !== normalizedQueries) {
          queriesImport.setModuleSpecifier(normalizedQueries)
        }
      } else {
        operationsFile.addImportDeclaration({
          moduleSpecifier: normalizedQueries,
          namespaceImport: 'queriesModule',
        })
      }

      if (mutationsImport) {
        if (mutationsImport.getModuleSpecifierValue() !== normalizedMutations) {
          mutationsImport.setModuleSpecifier(normalizedMutations)
        }
      } else {
        operationsFile.addImportDeclaration({
          moduleSpecifier: normalizedMutations,
          namespaceImport: 'mutationsModule',
        })
      }

      operationsFile.formatText()
      await operationsFile.save()
    } catch (err) {
      console.error('Error loading operations file:', err)
    }
  }

  watcher.on('ready', async () => {
    console.log('✓ File watcher ready. Watching for changes...\n')
  })

  watcher.on('change', async (pathChanged: string) => {
    // Only process .ts and .tsx files
    if (!pathChanged.endsWith('.ts') && !pathChanged.endsWith('.tsx')) {
      return
    }

    // Handle queries/mutations file changes
    const isInQueries = pathChanged.includes(paths.queriesDir)
    const isInMutations = pathChanged.includes(paths.mutationsDir)
    const isOperations = pathChanged === paths.operationsFile
    const isSchema = pathChanged === paths.schemaFile
    const isConfigSchema = schemaConfigPath && pathChanged === schemaConfigPath

    if (isInQueries || isOperations) {
      await queriesHandler.update()
      return
    }

    if (isInMutations || isOperations) {
      await mutationsHandler.update()
      return
    }

    if (isConfigSchema) {
      try {
        const prev = loadedSchema
        const { schema } = await tryLoadUnifiedSchema()
        if (schema) {
          loadedSchema = schema
          if (prev) {
            eventBus.emit(CorsairEvent.SCHEMA_UPDATED, {
              oldSchema: prev,
              newSchema: schema,
              schemaPath: schemaConfigPath!,
              changes: [],
            })
          } else {
            eventBus.emit(CorsairEvent.SCHEMA_LOADED, { schema })
          }
        }
      } catch {}
      return
    }

    if (isSchema && !loadedSchema) {
      await schemaHandler.update()
      return
    }

    // Skip other generated corsair files
    if (
      pathChanged.includes('/corsair/') ||
      pathChanged.includes('\\corsair\\')
    ) {
      return
    }

    // Refresh the entire project from filesystem to pick up latest changes
    const sourceFile = project.getSourceFile(pathChanged)

    if (!sourceFile) {
      return
    }

    eventBus.emit(CorsairEvent.FILE_CHANGED, {
      file: pathChanged,
      timestamp: Date.now(),
      project,
    })
  })

  watcher.on('error', (error: unknown) => {
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
  const { unmount, waitUntilExit } = render(<CorsairUI warnings={warnings} />)

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
