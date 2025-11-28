import fs from 'fs'
import path from 'path'

export interface TOCItem {
  title: string
  url: string
  depth: number
}

export function extractTOC(mdxPath: string): TOCItem[] {
  const fullPath = path.join(process.cwd(), 'content', 'docs', `${mdxPath}.mdx`)
  const content = fs.readFileSync(fullPath, 'utf-8')
  
  const lines = content.split('\n')
  const toc: TOCItem[] = []
  
  let inFrontmatter = false
  let inCodeBlock = false
  
  for (const line of lines) {
    if (line.trim() === '---') {
      inFrontmatter = !inFrontmatter
      continue
    }
    
    if (inFrontmatter) continue
    
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    
    if (inCodeBlock) continue
    
    const match = line.match(/^(#{2,6})\s+(.+)$/)
    if (match) {
      const depth = match[1].length
      const title = match[2].trim()
      const url = `#${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
      
      toc.push({
        title,
        url,
        depth,
      })
    }
  }
  
  return toc
}

