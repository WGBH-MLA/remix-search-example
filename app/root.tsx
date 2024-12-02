import type { MetaFunction } from '@remix-run/node'
import {
  Links,
  // LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

export default function App() {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <>OV Search demo</>
        <br />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
