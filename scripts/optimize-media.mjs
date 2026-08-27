import { readdir, mkdir, unlink } from 'node:fs/promises'
import { dirname, join, parse } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDirectory = join(projectRoot, 'src', 'assets', 'media', 'source', 'trial')
const outputDirectory = join(projectRoot, 'src', 'assets', 'media', 'trial')
const widths = [640, 960, 1280, 1600]

await mkdir(outputDirectory, { recursive: true })

const staleFiles = (await readdir(outputDirectory)).filter((file) => /\.(avif|webp)$/i.test(file))
await Promise.all(staleFiles.map((file) => unlink(join(outputDirectory, file))))

const sourceFiles = (await readdir(sourceDirectory))
  .filter((file) => file.toLowerCase().endsWith('.png'))
  .sort()

for (const file of sourceFiles) {
  const sourcePath = join(sourceDirectory, file)
  const name = parse(file).name
  const image = sharp(sourcePath)

  for (const width of widths) {
    await image
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(join(outputDirectory, `${name}-${width}.webp`))
    await image
      .clone()
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 62, effort: 4 })
      .toFile(join(outputDirectory, `${name}-${width}.avif`))
  }
}

console.log(`Optimized ${sourceFiles.length} trial scene image(s) at ${widths.join(', ')}px widths`)
