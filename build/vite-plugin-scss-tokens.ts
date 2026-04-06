// =============================================================================
// Vite Plugin — extracts SCSS variables from _tokens.scss as a virtual JS module
// =============================================================================

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { compileString } from 'sass'
import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:scss-tokens'
const RESOLVED_ID = '\0' + VIRTUAL_ID

/**
 * Parses _tokens.scss and extracts all `$color-*` and `$graph-*` variables
 * by compiling a small SCSS snippet that outputs their values as CSS custom
 * properties, then scraping the compiled CSS.
 */
function extractTokens(
  tokensPath: string,
): Record<string, Record<string, string>> {
  const source = readFileSync(tokensPath, 'utf-8')

  // Collect variable names matching our prefixes
  const varRegex = /^\$(color|graph)-([a-z][-a-z]*)\s*:/gm
  const vars: { prefix: string; scssName: string; suffix: string }[] = []
  let match: RegExpExecArray | null

  while ((match = varRegex.exec(source)) !== null) {
    const [, prefix, suffix] = match
    vars.push({ prefix, scssName: `$${prefix}-${suffix}`, suffix })
  }

  // Build a tiny SCSS file that outputs each value as a CSS custom property
  const scss = [
    `@use '${tokensPath.replace(/\\/g, '/')}' as t;`,
    ':root {',
    ...vars.map(
      (v) => `  --_extract-${v.prefix}-${v.suffix}: #{t.${v.scssName}};`,
    ),
    '}',
  ].join('\n')

  const result = compileString(scss, {
    loadPaths: [dirname(tokensPath)],
  })

  // Parse the compiled CSS to extract values
  const colors: Record<string, string> = {}
  const graphColors: Record<string, string> = {}

  const propRegex = /--_extract-(color|graph)-([a-z][-a-z]*):\s*([^;]+);/g
  while ((match = propRegex.exec(result.css)) !== null) {
    const [, prefix, suffix, value] = match
    const camelKey = suffix.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    if (prefix === 'color') {
      colors[camelKey] = value.trim()
    } else {
      graphColors[camelKey] = value.trim()
    }
  }

  return { colors, graphColors }
}

export default function scssTokensPlugin(): Plugin {
  let tokensPath: string

  return {
    name: 'scss-tokens',

    configResolved(config) {
      tokensPath = resolve(config.root, 'src/styles/_tokens.scss')
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    load(id) {
      if (id !== RESOLVED_ID) return

      const { colors, graphColors } = extractTokens(tokensPath)

      return [
        `export const colors = ${JSON.stringify(colors)};`,
        `export const graphColors = ${JSON.stringify(graphColors)};`,
      ].join('\n')
    },

    handleHotUpdate({ file, server }) {
      if (file === tokensPath) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) {
          server.moduleGraph.invalidateModule(mod)
          return [mod]
        }
      }
    },
  }
}
