import { eventBus } from "../core/event-bus.js";
import { CorsairEvent } from "../types/events.js";
import type { SchemaLoadedEvent, SchemaUpdatedEvent } from "../types/events.js";
import type { SchemaDefinition, TableDefinition } from "../types/state.js";
import { Project, SyntaxKind } from "ts-morph";

/**
 * Schema Handler
 *
 * Manages Corsair schema definitions from corsair/schema.ts.
 * Parses schema file, extracts definitions, and emits events to update state machine.
 */
export class Schema {
  private schema?: SchemaDefinition;
  private filePath: string;

  constructor() {
    this.filePath = process.cwd() + "/corsair/schema.ts";
  }

  /**
   * Parse the schema file and extract schema definition
   */
  public async parse(isInitialLoad: boolean = true): Promise<void> {
    try {
      const project = new Project();
      const schemaFile = project.addSourceFileAtPath(this.filePath);

      // Get all exported variable declarations that represent tables
      const exportedDeclarations = schemaFile.getExportedDeclarations();
      const tables = [];

      for (const [name, declarations] of exportedDeclarations) {
        for (const declaration of declarations) {
          if (declaration.isKind(SyntaxKind.VariableDeclaration)) {
            const initializer = declaration.getInitializer();

            // Check if this is a CorsairDB.table() call
            if (initializer?.isKind(SyntaxKind.CallExpression)) {
              const expression = initializer.getExpression();

              if (expression.getText() === "CorsairDB.table") {
                const args = initializer.getArguments();

                if (args.length >= 2) {
                  // First argument is the table name
                  const tableName = args[0].getText().replace(/['"`]/g, "");

                  // Second argument is the columns object
                  const columnsArg = args[1];

                  if (columnsArg.isKind(SyntaxKind.ObjectLiteralExpression)) {
                    const columns = this.parseColumnsFromCorsairDBTable(columnsArg);

                    tables.push({
                      name: tableName,
                      columns
                    });
                  }
                }
              }
            }
          }
        }
      }

      this.schema = { tables };

      // Only emit SCHEMA_LOADED on initial load
      if (isInitialLoad) {
        eventBus.emit(CorsairEvent.SCHEMA_LOADED, {
          schema: this.schema,
        } as SchemaLoadedEvent);
      }

    } catch (error) {
      console.error(`Can't find the schema file. Does it exist at ${this.filePath}?`);
      console.error(error);
    }
  }

  /**
   * Parse columns from CorsairDB.table() columns object
   */
  private parseColumnsFromCorsairDBTable(columnsObj: any): any[] {
    const columns = [];

    for (const property of columnsObj.getProperties()) {
      if (property.isKind(SyntaxKind.PropertyAssignment)) {
        const columnName = property.getName();
        const columnExpression = property.getInitializer();

        if (columnExpression?.isKind(SyntaxKind.CallExpression)) {
          const column = this.parseColumnExpression(columnName, columnExpression);
          if (column) {
            columns.push(column);
          }
        }
      }
    }

    return columns;
  }

  /**
   * Parse a single column expression like CorsairDB.text("name") or CorsairDB.integer("id").primaryKey()
   */
  private parseColumnExpression(columnName: string, expression: any): any {
    // Find the base CorsairDB type call by traversing the call chain
    let current = expression;
    let corsairDBCall = null;

    // Walk through the expression to find the CorsairDB.type() call
    while (current) {
      if (current.isKind(SyntaxKind.CallExpression)) {
        const memberExpression = current.getExpression();

        if (memberExpression.isKind(SyntaxKind.PropertyAccessExpression)) {
          const objectExpression = memberExpression.getExpression();

          // Check if this is CorsairDB.type()
          if (objectExpression.getText() === "CorsairDB") {
            corsairDBCall = current;
            break;
          }

          // If this is a method call on another call expression, continue traversing
          if (objectExpression.isKind(SyntaxKind.CallExpression)) {
            current = objectExpression;
            continue;
          }
        } else if (memberExpression.isKind(SyntaxKind.CallExpression)) {
          // Handle cases like CorsairDB.jsonb("genres")() where the result of CorsairDB.jsonb() is called
          current = memberExpression;
          continue;
        }
      }
      break;
    }

    // Extract the type from CorsairDB.type() call
    if (corsairDBCall) {
      const memberExpression = corsairDBCall.getExpression();

      if (memberExpression.isKind(SyntaxKind.PropertyAccessExpression)) {
        const typeName = memberExpression.getName();

        // Map CorsairDB types to SQL types
        let sqlType = this.mapCorsairDBTypeToSQL(typeName);

        // Check for references by looking for .references() in the chain
        let references;
        if (expression.getText().includes('.references(')) {
          // For now, we'll extract basic reference info
          // This is a simplified approach - a full parser would be more complex
          const fullText = expression.getText();
          const referencesMatch = fullText.match(/\.references\(\(\)\s*=>\s*(\w+)\.(\w+)\)/);
          if (referencesMatch) {
            references = {
              table: referencesMatch[1],
              column: referencesMatch[2]
            };
          }
        }

        return {
          name: columnName,
          type: sqlType,
          ...(references && { references })
        };
      }
    }

    return null;
  }

  /**
   * Map CorsairDB column types to SQL types
   */
  private mapCorsairDBTypeToSQL(corsairType: string): string {
    const typeMap: Record<string, string> = {
      'text': 'text',
      'integer': 'integer',
      'boolean': 'boolean',
      'uuid': 'uuid',
      'jsonb': 'jsonb',
      'json': 'json',
      'timestamp': 'timestamp',
      'date': 'date',
      'decimal': 'decimal',
      'serial': 'serial'
    };

    return typeMap[corsairType] || 'text';
  }

  /**
   * Re-parse the schema file (called on file change)
   */
  public async update(): Promise<void> {
    const oldSchema = this.schema;
    await this.parse(false); // Don't emit SCHEMA_LOADED on updates

    // Emit update event if schema changed
    if (this.schema && oldSchema) {
      const changes = this.getChangesSummary(oldSchema, this.schema);

      eventBus.emit(CorsairEvent.SCHEMA_UPDATED, {
        oldSchema,
        newSchema: this.schema,
        schemaPath: this.filePath,
        changes,
      } as SchemaUpdatedEvent);
    }
  }

  /**
   * Get current schema
   */
  public getSchema(): SchemaDefinition | undefined {
    return this.schema;
  }

  /**
   * Gets a summary of changes between two schemas
   */
  private getChangesSummary(before: SchemaDefinition, after: SchemaDefinition): string[] {
    const changes: string[] = [];

    // Check for added tables
    for (const afterTable of after.tables) {
      const beforeTable = before.tables.find(t => t.name === afterTable.name);
      if (!beforeTable) {
        changes.push(`${afterTable.name} table added`);
      }
    }

    // Check for removed tables
    for (const beforeTable of before.tables) {
      const afterTable = after.tables.find(t => t.name === beforeTable.name);
      if (!afterTable) {
        changes.push(`${beforeTable.name} table removed`);
      }
    }

    // Check for modified tables
    for (const beforeTable of before.tables) {
      const afterTable = after.tables.find(t => t.name === beforeTable.name);
      if (afterTable && this.hasTableChanged(beforeTable, afterTable)) {
        const tableChanges = this.getTableChangesSummary(beforeTable, afterTable);
        changes.push(...tableChanges.map(change => `${beforeTable.name}.${change}`));
      }
    }

    return changes;
  }

  /**
   * Checks if a specific table has changed
   */
  private hasTableChanged(before: TableDefinition, after: TableDefinition): boolean {
    // Compare number of columns
    if (before.columns.length !== after.columns.length) {
      return true;
    }

    // Compare each column
    for (let i = 0; i < before.columns.length; i++) {
      const beforeColumn = before.columns[i];
      const afterColumn = after.columns.find(c => c.name === beforeColumn.name);

      if (!afterColumn) {
        return true; // Column was removed
      }

      // Check column properties
      if (beforeColumn.type !== afterColumn.type) {
        return true;
      }

      // Check references
      const beforeRefs = beforeColumn.references;
      const afterRefs = afterColumn.references;

      if (!beforeRefs && afterRefs) return true;
      if (beforeRefs && !afterRefs) return true;
      if (beforeRefs && afterRefs) {
        if (beforeRefs.table !== afterRefs.table || beforeRefs.column !== afterRefs.column) {
          return true;
        }
      }
    }

    // Check for new columns
    for (const afterColumn of after.columns) {
      const beforeColumn = before.columns.find(c => c.name === afterColumn.name);
      if (!beforeColumn) {
        return true; // New column was added
      }
    }

    return false;
  }

  /**
   * Gets a summary of changes for a specific table
   */
  private getTableChangesSummary(before: TableDefinition, after: TableDefinition): string[] {
    const changes: string[] = [];

    // Check for added columns
    for (const afterColumn of after.columns) {
      const beforeColumn = before.columns.find(c => c.name === afterColumn.name);
      if (!beforeColumn) {
        changes.push(`${afterColumn.name} added (${afterColumn.type})`);
      }
    }

    // Check for removed columns
    for (const beforeColumn of before.columns) {
      const afterColumn = after.columns.find(c => c.name === beforeColumn.name);
      if (!afterColumn) {
        changes.push(`${beforeColumn.name} removed`);
      }
    }

    // Check for modified columns
    for (const beforeColumn of before.columns) {
      const afterColumn = after.columns.find(c => c.name === beforeColumn.name);
      if (afterColumn) {
        if (beforeColumn.type !== afterColumn.type) {
          changes.push(`${beforeColumn.name} type changed from ${beforeColumn.type} to ${afterColumn.type}`);
        }

        const beforeRefs = beforeColumn.references;
        const afterRefs = afterColumn.references;

        if (!beforeRefs && afterRefs) {
          changes.push(`${beforeColumn.name} reference added -> ${afterRefs.table}.${afterRefs.column}`);
        } else if (beforeRefs && !afterRefs) {
          changes.push(`${beforeColumn.name} reference removed`);
        } else if (beforeRefs && afterRefs) {
          if (beforeRefs.table !== afterRefs.table || beforeRefs.column !== afterRefs.column) {
            changes.push(`${beforeColumn.name} reference changed from ${beforeRefs.table}.${beforeRefs.column} to ${afterRefs.table}.${afterRefs.column}`);
          }
        }
      }
    }

    return changes;
  }
}