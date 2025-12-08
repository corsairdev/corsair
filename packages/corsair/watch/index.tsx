#!/usr/bin/env node

import chokidar from 'chokidar'
import { existsSync } from 'fs'
import { render } from 'ink'
import * as path from 'path'
import { Project } from 'ts-morph'
import { getResolvedPaths, loadConfig, validatePaths } from '../cli/config.js'
import { loadSchema } from '../cli/utils/schema-loader.js'
import { eventBus } from './core/event-bus.js'
import { CorsairEvent } from './types/events.js'
import type { SchemaDefinition } from './types/state.js'
import { CorsairUI } from './ui/renderer.js'

import './handlers/file-change-handler.js'
import './handlers/query-generator.js'
import './handlers/user-input-handler.js'
import './handlers/error-handler.js'
import './handlers/schema-change-handler.js'

import { Mutations, Queries } from './handlers/operations-handler.js'
import { Schema } from './handlers/schema-handler.js'

import './core/state-machine.js'

export async function watch(): Promise<void> {
  console.clear()

  const cfg = loadConfig()

  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
  })

  const paths = getResolvedPaths(cfg)
  const warnings = validatePaths(cfg)

  const queriesHandler = new Queries(paths.queriesDir)
  const mutationsHandler = new Mutations(paths.mutationsDir)
  const schemaHandler = new Schema(paths.schemaFile)

  let loadedSchema: SchemaDefinition | undefined
  let schemaConfigPath: string | undefined
  try {
    const result = await loadSchema()
    if (result?.db) {
      loadedSchema = result.db as any
      eventBus.emit(CorsairEvent.SCHEMA_LOADED, { schema: result.db })
    }
  } catch (err) {
    console.error('Error loading unified schema:', err)
  }

  await queriesHandler.parse()
  await mutationsHandler.parse()
  if (!loadedSchema && existsSync(paths.schemaFile)) {
    await schemaHandler.parse()
  }

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

  watcher.on('change', async (pathChanged: string) => {
    if (!pathChanged.endsWith('.ts') && !pathChanged.endsWith('.tsx')) {
      return
    }

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
        const result = await loadSchema()
        if (result?.db) {
          const schema = result.db as any
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

    if (
      pathChanged.includes('/corsair/') ||
      pathChanged.includes('\\corsair\\')
    ) {
      return
    }

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

  const { unmount, waitUntilExit } = render(<CorsairUI warnings={warnings} />)

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

  await waitUntilExit()

  watcher.close()
}
