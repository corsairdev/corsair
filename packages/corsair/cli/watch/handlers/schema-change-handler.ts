// @ts-nocheck

import { eventBus } from '../core/event-bus.js'
import { CorsairEvent } from '../types/events.js'
import type { SchemaUpdatedEvent } from '../types/events.js'
import type { SchemaDefinition, TableDefinition } from '../types/state.js'
import { stateMachine } from '../core/state-machine.js'
import * as path from 'path'

/**
 * Schema Change Handler
 *
 * Compares before/after states of Corsair schema definitions
 * and emits appropriate events for schema changes
 */
class SchemaChangeHandler {
  /**
   * Analyzes changes between before and after schema states
   */
  public detectChanges(data: {
    file: string
    before?: SchemaDefinition
    after?: SchemaDefinition
  }) {
    const { file, before, after } = data
    const fileName = path.basename(file)

    // If there's no before state, this is an initial load
    if (!before && after) {
      this.emitSchemaLoaded({
        schema: after,
        file,
        fileName,
      })
      return
    }

    // If there's no after state, schema was removed/corrupted
    if (before && !after) {
      this.emitSchemaRemoved({
        schema: before,
        file,
        fileName,
      })
      return
    }

    // Both exist, check for changes
    if (before && after) {
      if (this.hasSchemaChanged(before, after)) {
        this.emitSchemaUpdated({
          oldSchema: before,
          newSchema: after,
          file,
          fileName,
        })
      }
    }
  }

  /**
   * Checks if the schema has meaningfully changed
   */
  private hasSchemaChanged(
    before: SchemaDefinition,
    after: SchemaDefinition
  ): boolean {
    // Compare number of tables
    if (before.tables.length !== after.tables.length) {
      return true
    }

    // Compare each table
    for (let i = 0; i < before.tables.length; i++) {
      const beforeTable = before.tables[i]
      const afterTable = after.tables.find(t => t.name === beforeTable.name)

      if (!afterTable) {
        return true // Table was removed
      }

      if (this.hasTableChanged(beforeTable, afterTable)) {
        return true
      }
    }

    // Check for new tables
    for (const afterTable of after.tables) {
      const beforeTable = before.tables.find(t => t.name === afterTable.name)
      if (!beforeTable) {
        return true // New table was added
      }
    }

    return false
  }

  /**
   * Checks if a specific table has changed
   */
  private hasTableChanged(
    before: TableDefinition,
    after: TableDefinition
  ): boolean {
    // Compare number of columns
    if (before.columns.length !== after.columns.length) {
      return true
    }

    // Compare each column
    for (let i = 0; i < before.columns.length; i++) {
      const beforeColumn = before.columns[i]
      const afterColumn = after.columns.find(c => c.name === beforeColumn.name)

      if (!afterColumn) {
        return true // Column was removed
      }

      // Check column properties
      if (beforeColumn.type !== afterColumn.type) {
        return true
      }

      // Check references
      const beforeRefs = beforeColumn.references
      const afterRefs = afterColumn.references

      if (!beforeRefs && afterRefs) return true
      if (beforeRefs && !afterRefs) return true
      if (beforeRefs && afterRefs) {
        if (
          beforeRefs.table !== afterRefs.table ||
          beforeRefs.column !== afterRefs.column
        ) {
          return true
        }
      }
    }

    // Check for new columns
    for (const afterColumn of after.columns) {
      const beforeColumn = before.columns.find(c => c.name === afterColumn.name)
      if (!beforeColumn) {
        return true // New column was added
      }
    }

    return false
  }

  /**
   * Emits SCHEMA_LOADED event (initial load)
   */
  private emitSchemaLoaded(data: {
    schema: SchemaDefinition
    file: string
    fileName: string
  }) {
    const { schema, file, fileName } = data

    eventBus.emit(CorsairEvent.SCHEMA_LOADED, {
      schema,
    })
  }

  /**
   * Emits SCHEMA_UPDATED event
   */
  private emitSchemaUpdated(data: {
    oldSchema: SchemaDefinition
    newSchema: SchemaDefinition
    file: string
    fileName: string
  }) {
    const { oldSchema, newSchema, file, fileName } = data

    const changes = this.getChangesSummary(oldSchema, newSchema)

    const event: SchemaUpdatedEvent = {
      oldSchema,
      newSchema,
      schemaPath: file,
      changes,
    }

    eventBus.emit(CorsairEvent.SCHEMA_UPDATED, event)
  }

  /**
   * Emits schema removed event (using ERROR_OCCURRED for now)
   */
  private emitSchemaRemoved(data: {
    schema: SchemaDefinition
    file: string
    fileName: string
  }) {
    const { schema, file, fileName } = data

    eventBus.emit(CorsairEvent.ERROR_OCCURRED, {
      message: `Schema file removed or corrupted: ${fileName}`,
      code: 'SCHEMA_REMOVED',
      suggestions: [
        'Check if the schema file exists',
        'Verify schema file syntax',
        'Restore from backup if needed',
      ],
    })
  }

  /**
   * Gets a summary of changes between two schemas
   */
  public getChangesSummary(
    before: SchemaDefinition,
    after: SchemaDefinition
  ): string[] {
    const changes: string[] = []

    // Check for added tables
    for (const afterTable of after.tables) {
      const beforeTable = before.tables.find(t => t.name === afterTable.name)
      if (!beforeTable) {
        changes.push(`Added table: ${afterTable.name}`)
      }
    }

    // Check for removed tables
    for (const beforeTable of before.tables) {
      const afterTable = after.tables.find(t => t.name === beforeTable.name)
      if (!afterTable) {
        changes.push(`Removed table: ${beforeTable.name}`)
      }
    }

    // Check for modified tables
    for (const beforeTable of before.tables) {
      const afterTable = after.tables.find(t => t.name === beforeTable.name)
      if (afterTable && this.hasTableChanged(beforeTable, afterTable)) {
        const tableChanges = this.getTableChangesSummary(
          beforeTable,
          afterTable
        )
        changes.push(
          `Modified table ${beforeTable.name}: ${tableChanges.join(', ')}`
        )
      }
    }

    return changes
  }

  /**
   * Gets a summary of changes for a specific table
   */
  private getTableChangesSummary(
    before: TableDefinition,
    after: TableDefinition
  ): string[] {
    const changes: string[] = []

    // Check for added columns
    for (const afterColumn of after.columns) {
      const beforeColumn = before.columns.find(c => c.name === afterColumn.name)
      if (!beforeColumn) {
        changes.push(`added column ${afterColumn.name}`)
      }
    }

    // Check for removed columns
    for (const beforeColumn of before.columns) {
      const afterColumn = after.columns.find(c => c.name === beforeColumn.name)
      if (!afterColumn) {
        changes.push(`removed column ${beforeColumn.name}`)
      }
    }

    // Check for modified columns
    for (const beforeColumn of before.columns) {
      const afterColumn = after.columns.find(c => c.name === beforeColumn.name)
      if (afterColumn) {
        if (beforeColumn.type !== afterColumn.type) {
          changes.push(
            `changed ${beforeColumn.name} type from ${beforeColumn.type} to ${afterColumn.type}`
          )
        }

        const beforeRefs = beforeColumn.references
        const afterRefs = afterColumn.references

        if (!beforeRefs && afterRefs) {
          changes.push(`added reference to ${beforeColumn.name}`)
        } else if (beforeRefs && !afterRefs) {
          changes.push(`removed reference from ${beforeColumn.name}`)
        } else if (beforeRefs && afterRefs) {
          if (
            beforeRefs.table !== afterRefs.table ||
            beforeRefs.column !== afterRefs.column
          ) {
            changes.push(`modified reference for ${beforeColumn.name}`)
          }
        }
      }
    }

    return changes
  }
}

// Export singleton instance
export const schemaChangeHandler = new SchemaChangeHandler()
