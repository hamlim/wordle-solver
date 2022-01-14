import React from 'react'
import { ThemeProvider, Reset, Box } from '@ds-pack/components'
import Head from 'next/head'

function Layout({ children }) {
  return (
    <Box backgroundColor="LemonChiffon">
      <Box
        maxWidth={{
          _: '95vw',
          1000: '85vw',
        }}
        minHeight="100vh"
        margin="0 auto"
        display="flex"
      >
        {children}
      </Box>
    </Box>
  )
}

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Wordle Solver</title>
      </Head>
      <Reset />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}
