import * as path from 'path'
import { existsSync, writeFileSync, unlinkSync } from 'fs'
import { pathToFileURL } from 'url'
import { spawn } from 'child_process'
import type { SchemaDefinition } from './watch/types/state.js'

export async function tryLoadUnifiedSchema(): Promise<{
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
