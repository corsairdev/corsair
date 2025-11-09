import 'fumadocs-ui/style.css'
import { RootProvider } from 'fumadocs-ui/provider'
import { NextProvider } from 'fumadocs-core/framework/next'

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextProvider>
          <RootProvider theme={{ defaultTheme: 'light', enableSystem: false }}>
            {props.children}
          </RootProvider>
        </NextProvider>
      </body>
    </html>
  )
}
