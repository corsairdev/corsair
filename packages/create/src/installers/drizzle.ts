import fs from 'fs-extra'
import path from 'path'

import { PKG_ROOT } from '@/consts.js'
import type { Installer } from '@/installers/index.js'
import { addPackageDependency } from '@/utils/addPackageDependency.js'
import { addPackageScript } from '@/utils/addPackageScript.js'

export const drizzleInstaller: Installer = ({ projectDir, scopedAppName }) => {
  addPackageDependency({
    projectDir,
    dependencies: ['drizzle-kit'],
    devMode: true,
  })
  addPackageDependency({
    projectDir,
    dependencies: ['drizzle-orm', 'postgres'],
    devMode: false,
  })

  const extrasDir = path.join(PKG_ROOT, 'template/extras')

  const configFile = path.join(extrasDir, 'config/drizzle-config-postgres.ts')
  const configDest = path.join(projectDir, 'drizzle.config.ts')

  // Always use with-better-auth since betterAuth is required
  const schemaSrc = path.join(
    extrasDir,
    'src/server/db/schema-drizzle',
    'with-better-auth-postgres.ts'
  )
  const schemaDest = path.join(projectDir, 'src/server/db/schema.ts')

  // Replace placeholder table prefix with project name
  let schemaContent = fs.readFileSync(schemaSrc, 'utf-8')
  schemaContent = schemaContent.replace(
    'project1_${name}',
    `${scopedAppName}_\${name}`
  )

  let configContent = fs.readFileSync(configFile, 'utf-8')

  configContent = configContent.replace('project1_*', `${scopedAppName}_*`)

  const clientSrc = path.join(
    extrasDir,
    'src/server/db/index-drizzle/with-postgres.ts'
  )
  const clientDest = path.join(projectDir, 'src/server/db/index.ts')

  addPackageScript({
    projectDir,
    scripts: {
      'db:push': 'drizzle-kit push',
      'db:studio': 'drizzle-kit studio',
      'db:generate': 'drizzle-kit generate',
      'db:migrate': 'drizzle-kit migrate',
    },
  })

  fs.copySync(configFile, configDest)
  fs.mkdirSync(path.dirname(schemaDest), { recursive: true })
  fs.writeFileSync(schemaDest, schemaContent)
  fs.writeFileSync(configDest, configContent)
  fs.copySync(clientSrc, clientDest)
}
