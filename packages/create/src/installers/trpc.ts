import fs from 'fs-extra'
import path from 'path'

import { PKG_ROOT } from '@/consts.js'
import type { Installer } from '@/installers/index.js'
import { addPackageDependency } from '@/utils/addPackageDependency.js'

export const trpcInstaller: Installer = ({ projectDir, packages }) => {
  addPackageDependency({
    projectDir,
    dependencies: [
      '@tanstack/react-query',
      'superjson',
      '@trpc/server',
      '@trpc/client',
      '@trpc/react-query',
    ],
    devMode: false,
  })

  const usingPrisma = packages?.prisma.inUse
  const usingDrizzle = packages?.drizzle.inUse
  const usingDb = usingPrisma === true || usingDrizzle === true

  const extrasDir = path.join(PKG_ROOT, 'template/extras')

  // Always use app router
  const routeHandlerFile = 'src/app/api/trpc/[trpc]/route.ts'
  const apiHandlerSrc = path.join(extrasDir, routeHandlerFile)
  const apiHandlerDest = path.join(projectDir, routeHandlerFile)

  // Always use betterAuth, select based on db usage
  const trpcFile = usingDb ? 'with-better-auth-db.ts' : 'with-better-auth.ts'
  const trpcSrc = path.join(extrasDir, 'src/server/api/trpc-app', trpcFile)
  const trpcDest = path.join(projectDir, 'src/server/api/trpc.ts')

  const rootRouterSrc = path.join(extrasDir, 'src/server/api/root.ts')
  const rootRouterDest = path.join(projectDir, 'src/server/api/root.ts')

  // Always use betterAuth, select based on db type
  const exampleRouterFile = usingPrisma
    ? 'with-auth-prisma.ts'
    : usingDrizzle
      ? 'with-auth-drizzle.ts'
      : 'with-auth.ts'

  const exampleRouterSrc = path.join(
    extrasDir,
    'src/server/api/routers/post',
    exampleRouterFile
  )
  const exampleRouterDest = path.join(
    projectDir,
    'src/server/api/routers/post.ts'
  )

  const copySrcDest: [string, string][] = [
    [apiHandlerSrc, apiHandlerDest],
    [trpcSrc, trpcDest],
    [rootRouterSrc, rootRouterDest],
    [exampleRouterSrc, exampleRouterDest],
  ]

  // Always use app router
  addPackageDependency({
    dependencies: ['server-only'],
    devMode: false,
    projectDir,
  })

  const trpcDir = path.join(extrasDir, 'src/trpc')
  copySrcDest.push(
    [
      path.join(trpcDir, 'server.ts'),
      path.join(projectDir, 'src/trpc/server.ts'),
    ],
    [
      path.join(trpcDir, 'react.tsx'),
      path.join(projectDir, 'src/trpc/react.tsx'),
    ],
    [
      path.join(
        extrasDir,
        'src/app/_components',
        packages?.tailwind.inUse ? 'post-tw.tsx' : 'post.tsx'
      ),
      path.join(projectDir, 'src/app/_components/post.tsx'),
    ],
    [
      path.join(extrasDir, 'src/trpc/query-client.ts'),
      path.join(projectDir, 'src/trpc/query-client.ts'),
    ]
  )

  copySrcDest.forEach(([src, dest]) => {
    fs.copySync(src, dest)
  })
}
