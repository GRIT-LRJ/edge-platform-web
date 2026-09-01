import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const projectRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const sourceDirectory = join(projectRoot, 'src', 'assets', 'media', 'source', 'home')
const outputDirectory = join(projectRoot, 'src', 'assets', 'media', 'home')

const basePath = join(sourceDirectory, 'edge-drillmind-hero-v3-base.png')
const conceptSourcePath = join(sourceDirectory, 'edge-drillmind-concept-v3-source.png')
const conceptPath = join(sourceDirectory, 'edge-drillmind-concept-v3.png')
const heroPath = join(sourceDirectory, 'edge-drillmind-hero-v3.png')

const canvas = { width: 2560, height: 1440 }
const workspace = { top: 72, bottom: 1405 }
const workspaceHeight = workspace.bottom - workspace.top
const originalWorkspaceColor = [37, 40, 57]

const clamp = (value, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value))

const smoothstep = (value) => {
  const normalized = clamp(value)
  return normalized * normalized * (3 - 2 * normalized)
}

const mix = (from, to, amount) => Math.round(from + (to - from) * amount)

function gradientColor(position) {
  const start = [3, 9, 15]
  const middle = [6, 19, 33]
  const end = [7, 24, 37]

  if (position <= 0.58) {
    const amount = position / 0.58
    return start.map((channel, index) => mix(channel, middle[index], amount))
  }

  const amount = (position - 0.58) / 0.42
  return middle.map((channel, index) => mix(channel, end[index], amount))
}

function createWorkspaceBackground() {
  const data = Buffer.alloc(canvas.width * workspaceHeight * 3)
  const glowColor = [40, 222, 194]

  for (let y = 0; y < workspaceHeight; y += 1) {
    const yRatio = y / Math.max(1, workspaceHeight - 1)

    for (let x = 0; x < canvas.width; x += 1) {
      const xRatio = x / Math.max(1, canvas.width - 1)
      const diagonal = clamp(xRatio * 0.38 + yRatio * 0.62)
      const base = gradientColor(diagonal)
      const glowX = (xRatio - 0.5) / 0.33
      const glowY = (yRatio - 0.62) / 0.27
      const glow = smoothstep(1 - Math.sqrt(glowX * glowX + glowY * glowY)) * 0.075
      const offset = (y * canvas.width + x) * 3

      data[offset] = mix(base[0], glowColor[0], glow)
      data[offset + 1] = mix(base[1], glowColor[1], glow)
      data[offset + 2] = mix(base[2], glowColor[2], glow)
    }
  }

  return { input: data, raw: { width: canvas.width, height: workspaceHeight, channels: 3 } }
}

async function createWelcomeForeground() {
  const { data, info } = await sharp(basePath)
    .extract({ left: 0, top: workspace.top, width: canvas.width, height: workspaceHeight })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const alpha = Buffer.alloc(info.width * info.height)

  for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
    const offset = pixel * info.channels
    const difference = Math.max(
      Math.abs(data[offset] - originalWorkspaceColor[0]),
      Math.abs(data[offset + 1] - originalWorkspaceColor[1]),
      Math.abs(data[offset + 2] - originalWorkspaceColor[2]),
    )
    alpha[pixel] = difference <= 1 ? 0 : 255
  }

  const input = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png()
    .toBuffer()

  return { input, left: 0, top: workspace.top }
}

async function extractTransparentConcept() {
  const { data, info } = await sharp(conceptSourcePath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const alpha = Buffer.alloc(info.width * info.height)
  const shadowPixels = Buffer.alloc(info.width * info.height)
  const output = Buffer.alloc(info.width * info.height * 4)
  const matte = 250

  for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
    const sourceOffset = pixel * info.channels
    const outputOffset = pixel * 4
    const sourceY = Math.floor(pixel / info.width)
    const red = data[sourceOffset]
    const green = data[sourceOffset + 1]
    const blue = data[sourceOffset + 2]
    const maximum = Math.max(red, green, blue)
    const minimum = Math.min(red, green, blue)
    const saturation = maximum - minimum
    const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722
    const darkness = clamp((244 - luminance) / 42)
    const colorfulness = clamp((saturation - 3) / 28)
    const opacity = smoothstep(Math.max(darkness, colorfulness))
    const alphaValue = opacity < 0.035 ? 0 : Math.round(opacity * 255)
    const contactShadow =
      sourceY > 600 && saturation < 16 && luminance > 135 && alphaValue > 0

    alpha[pixel] = alphaValue
    shadowPixels[pixel] = contactShadow ? 1 : 0
    output[outputOffset + 3] = alphaValue

    if (alphaValue === 0) continue

    const normalizedAlpha = alphaValue / 255
    const recover = (channel) =>
      Math.round(clamp((channel - (1 - normalizedAlpha) * matte) / normalizedAlpha, 0, 255))

    output[outputOffset] = recover(red)
    output[outputOffset + 1] = recover(green)
    output[outputOffset + 2] = recover(blue)
  }

  const closedAlpha = await sharp(alpha, {
    raw: { width: info.width, height: info.height, channels: 1 },
  })
    .dilate(1)
    .erode(1)
    .blur(0.45)
    .raw()
    .toBuffer()

  for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
    const outputOffset = pixel * 4

    if (shadowPixels[pixel]) {
      output[outputOffset] = 1
      output[outputOffset + 1] = 11
      output[outputOffset + 2] = 18
      output[outputOffset + 3] = Math.min(
        92,
        Math.max(output[outputOffset + 3], Math.round(closedAlpha[pixel] * 0.4)),
      )
      continue
    }

    output[outputOffset + 3] = Math.max(output[outputOffset + 3], closedAlpha[pixel])
  }

  await sharp(output, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(conceptPath)
}

async function buildHero() {
  const background = createWorkspaceBackground()
  const welcomeForeground = await createWelcomeForeground()
  const concept = await sharp(conceptPath)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 3 })
    .resize({ height: 420, fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer({ resolveWithObject: true })
  const conceptLeft = Math.round((canvas.width - concept.info.width) / 2)
  const conceptTop = workspace.bottom - concept.info.height - 16

  await sharp(basePath)
    .composite([
      { ...background, left: 0, top: workspace.top },
      welcomeForeground,
      { input: concept.data, left: conceptLeft, top: conceptTop },
    ])
    .png({ compressionLevel: 9 })
    .toFile(heroPath)
}

const baseMetadata = await sharp(basePath).metadata()
if (baseMetadata.width !== canvas.width || baseMetadata.height !== canvas.height) {
  throw new Error(
    `Expected a ${canvas.width}x${canvas.height} base image, received ${baseMetadata.width}x${baseMetadata.height}`,
  )
}

await extractTransparentConcept()
await buildHero()

await sharp(heroPath)
  .webp({ quality: 88, smartSubsample: true })
  .toFile(join(outputDirectory, 'edge-drillmind-hero-v3.webp'))
await sharp(heroPath)
  .avif({ quality: 68, effort: 5, chromaSubsampling: '4:4:4' })
  .toFile(join(outputDirectory, 'edge-drillmind-hero-v3.avif'))

console.log('Built the 2560x1440 DrillMind hero V3 and optimized AVIF/WebP assets')
