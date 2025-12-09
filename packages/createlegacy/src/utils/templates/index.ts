import fs from 'fs-extra'
import path from 'path'
import type { ProjectConfig } from '../../cli/create-project.js'
import { generatePackageJson } from './package.js'
import { generateConfigFiles } from './config.js'
import { generateDatabaseFiles } from './database.js'
import { generateCorsairSetup } from './corsair.js'
import { generateNextjsStructure } from './nextjs.js'
import { generateUIComponents } from './ui.js'
import { generateSeedData } from './seed.js'
import { generateDocumentation } from './documentation.js'

export async function generateTemplate(
  projectPath: string,
  config: ProjectConfig
): Promise<void> {
  // Ensure project directory exists
  await fs.ensureDir(projectPath)

  // Generate package.json
  await generatePackageJson(projectPath, config)

  // Generate basic project structure
  await generateProjectStructure(projectPath, config)

  // Generate environment files
  await generateEnvironmentFiles(projectPath)

  // Generate configuration files
  await generateConfigFiles(projectPath, config)

  // Generate database files
  await generateDatabaseFiles(projectPath, config)

  // Generate Corsair setup
  await generateCorsairSetup(projectPath, config)

  // Generate Next.js app structure
  await generateNextjsStructure(projectPath, config)

  // Generate UI components
  await generateUIComponents(projectPath)

  // Generate seed data
  await generateSeedData(projectPath, config)

  // Generate README and documentation
  await generateDocumentation(projectPath, config)
}

async function generateProjectStructure(
  projectPath: string,
  config: ProjectConfig
): Promise<void> {
  const directories = [
    'app',
    'components',
    'corsair',
    'db',
    'lib',
    'public',
    'data',
  ]

  if (config.orm === 'prisma') {
    directories.push('prisma')
  } else {
    directories.push('drizzle')
  }

  for (const dir of directories) {
    await fs.ensureDir(path.join(projectPath, dir))
  }
}

async function generateEnvironmentFiles(projectPath: string): Promise<void> {
  const envExample = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"

# Next.js
NEXT_PUBLIC_CORSAIR_API_ROUTE="/api/corsair"

# Optional: For production
# NEXTAUTH_SECRET=""
# NEXTAUTH_URL=""
`

  const envLocal = `# Database (copy from .env.example and update)
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"

# Next.js
NEXT_PUBLIC_CORSAIR_API_ROUTE="/api/corsair"
`

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample)
  await fs.writeFile(path.join(projectPath, '.env.local'), envLocal)
}