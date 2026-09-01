import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const projectRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const sourceDirectory = join(projectRoot, 'src', 'assets', 'media', 'source', 'home')
const outputDirectory = join(projectRoot, 'src', 'assets', 'media', 'home')

const basePath = join(sourceDirectory, 'edge-drillmind-hero-v2-base.png')
const conceptAPath = join(sourceDirectory, 'edge-drillmind-concept-a.png')
const conceptBPath = join(sourceDirectory, 'edge-drillmind-concept-b.png')
const candidateAPath = join(sourceDirectory, 'edge-drillmind-hero-v2-alternative.png')
const candidateBPath = join(sourceDirectory, 'edge-drillmind-hero-v2.png')

const canvas = { width: 1920, height: 1080 }
const workspaceBottom = 1058

const clamp = (value, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value))

const smoothstep = (value) => {
  const normalized = clamp(value)
  return normalized * normalized * (3 - 2 * normalized)
}

function createAlphaMask(width, height, placement, opacity) {
  const mask = Buffer.alloc(width * height)

  for (let y = 0; y < height; y += 1) {
    const globalY = placement.top + y
    const verticalFade = smoothstep((globalY - 555) / 175)

    for (let x = 0; x < width; x += 1) {
      const edgeFade = smoothstep(x / 36) * smoothstep((width - 1 - x) / 36)
      mask[y * width + x] = Math.round(255 * verticalFade * edgeFade * opacity)
    }
  }

  return mask
}

async function createPreservedWelcomeLayer() {
  const region = { left: 840, top: 390, width: 470, height: 330 }
  const { data, info } = await sharp(basePath)
    .extract(region)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const alpha = Buffer.alloc(info.width * info.height)
  const background = [37, 42, 60]

  for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
    const localY = Math.floor(pixel / info.width)
    if (region.top + localY < 555) continue

    const offset = pixel * info.channels
    const difference = Math.max(
      Math.abs(data[offset] - background[0]),
      Math.abs(data[offset + 1] - background[1]),
      Math.abs(data[offset + 2] - background[2]),
    )
    alpha[pixel] = Math.round(255 * smoothstep((difference - 2) / 12))
  }

  const input = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png()
    .toBuffer()

  return { input, left: region.left, top: region.top }
}

async function prepareLayer(inputPath, transform, placement, opacity) {
  let pipeline = sharp(inputPath).removeAlpha().toColourspace('srgb')

  if (transform.extract) pipeline = pipeline.extract(transform.extract)
  pipeline = pipeline.resize({ width: transform.width })

  const { data, info } = await pipeline.png().toBuffer({ resolveWithObject: true })
  const alpha = createAlphaMask(info.width, info.height, placement, opacity)
  const layer = await sharp(data)
    .joinChannel(alpha, {
      raw: { width: info.width, height: info.height, channels: 1 },
    })
    .png()
    .toBuffer()

  return { input: layer, left: placement.left, top: placement.top }
}

async function buildCandidate(conceptPath, transform, placement, opacity, outputPath) {
  const layer = await prepareLayer(conceptPath, transform, placement, opacity)
  const welcomeLayer = await createPreservedWelcomeLayer()
  await sharp(basePath)
    .composite([layer, welcomeLayer])
    .png({ compressionLevel: 9 })
    .toFile(outputPath)
}

const baseMetadata = await sharp(basePath).metadata()
if (baseMetadata.width !== canvas.width || baseMetadata.height !== canvas.height) {
  throw new Error(
    `Expected a ${canvas.width}x${canvas.height} base image, received ${baseMetadata.width}x${baseMetadata.height}`,
  )
}

const conceptAMetadata = await sharp(conceptAPath).metadata()
const conceptAHeight = Math.round((conceptAMetadata.height / conceptAMetadata.width) * 1250)
await buildCandidate(
  conceptAPath,
  { width: 1250 },
  { left: 350, top: workspaceBottom - conceptAHeight },
  0.94,
  candidateAPath,
)

const conceptBMetadata = await sharp(conceptBPath).metadata()
const conceptBExtract = {
  left: 0,
  top: 300,
  width: conceptBMetadata.width,
  height: conceptBMetadata.height - 300,
}
const conceptBHeight = Math.round((conceptBExtract.height / conceptBExtract.width) * 1680)
await buildCandidate(
  conceptBPath,
  { width: 1680, extract: conceptBExtract },
  { left: 240, top: workspaceBottom - conceptBHeight },
  0.96,
  candidateBPath,
)

await sharp(candidateBPath)
  .webp({ quality: 88, smartSubsample: true })
  .toFile(join(outputDirectory, 'edge-drillmind-hero-v2.webp'))
await sharp(candidateBPath)
  .avif({ quality: 68, effort: 5, chromaSubsampling: '4:4:4' })
  .toFile(join(outputDirectory, 'edge-drillmind-hero-v2.avif'))

console.log('Built two 1920x1080 hero candidates and optimized candidate B for the homepage')
