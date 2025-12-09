import fs from 'fs-extra'
import path from 'path'
import type { ProjectConfig } from '../../cli/create-project.js'

export async function generatePackageJson(
  projectPath: string,
  config: ProjectConfig
): Promise<void> {
  const packageJson = {
    name: config.projectName,
    version: '0.1.0',
    private: true,
    scripts: {
      'dev': 'next dev',
      'build': 'next build',
      'start': 'next start',
      'lint': 'eslint',
      ...(config.orm === 'prisma'
        ? {
            'db:generate': 'prisma generate',
            'db:push': 'prisma db push',
            'db:migrate': 'prisma migrate dev',
            'db:studio': 'prisma studio',
            'db:seed': 'tsx db/seed.ts',
          }
        : {
            'db:generate': 'drizzle-kit generate',
            'db:push': 'drizzle-kit push',
            'db:migrate': 'drizzle-kit migrate',
            'db:studio': 'drizzle-kit studio',
            'db:seed': 'tsx db/seed.ts',
          }),
      'corsair:generate': 'corsair generate',
      'corsair:check': 'corsair check',
      'corsair:migrate': 'corsair migrate',
      'config': 'tsx corsair.config.ts',
    },
    dependencies: {
      '@corsair-ai/core': 'latest',
      '@tanstack/react-query': '^5.90.5',
      '@trpc/client': '^11.6.0',
      '@trpc/server': '^11.6.0',
      '@trpc/tanstack-react-query': '^11.6.0',
      ...(config.orm === 'prisma'
        ? {
            '@prisma/client': '^5.22.0',
          }
        : {
            'drizzle-orm': '^0.31.2',
            'drizzle-zod': '^0.5.1',
            'pg': '^8.11.0',
          }),
      '@radix-ui/react-avatar': '^1.1.10',
      '@radix-ui/react-dialog': '^1.1.15',
      '@radix-ui/react-select': '^2.2.6',
      '@radix-ui/react-slot': '^1.2.3',
      'class-variance-authority': '^0.7.1',
      'clsx': '^2.1.1',
      'dotenv': '^17.2.3',
      'lucide-react': '^0.546.0',
      'next': '15.5.6',
      'react': '19.1.0',
      'react-dom': '19.1.0',
      'server-only': '^0.0.1',
      'tailwind-merge': '^3.3.1',
      'tsx': '^4.20.6',
      'zod': '^3.23.8',
    },
    devDependencies: {
      '@corsair-ai/cli': 'workspace:*',
      '@eslint/eslintrc': '^3',
      '@tailwindcss/postcss': '^4',
      '@types/node': '^20',
      '@types/react': '^19',
      '@types/react-dom': '^19',
      ...(config.orm === 'prisma'
        ? {
            prisma: '^5.22.0',
          }
        : {
            '@types/pg': '^8.11.0',
            'drizzle-kit': '^0.22.7',
          }),
      'eslint': '^9',
      'eslint-config-next': '15.5.6',
      'tailwindcss': '^4',
      'tw-animate-css': '^1.4.0',
      'typescript': '^5',
    },
  }

  await fs.writeJson(path.join(projectPath, 'package.json'), packageJson, {
    spaces: 2,
  })
}