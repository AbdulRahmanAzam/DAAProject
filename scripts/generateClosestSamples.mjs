import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SAMPLE_POINT_SETS } from '../src/utils/samplePointSets.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const outDir = path.resolve(__dirname, '../samples/closest')
mkdirSync(outDir, { recursive: true })

for (const set of SAMPLE_POINT_SETS) {
  const lines = set.points.map(p => `${p.x},${p.y}`)
  const content = `# ${set.name} (Total: ${set.points.length} points)\n# Format: x,y (range [0,100])\n` + lines.join('\n') + '\n'
  const filePath = path.join(outDir, `closest-${set.id}.txt`)
  writeFileSync(filePath, content, 'utf8')
  console.log('Wrote', filePath)
}
