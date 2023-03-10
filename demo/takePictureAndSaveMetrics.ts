import { writeFileSync } from 'fs'
import { resolve } from 'path'
import debug from 'debug'

import { takePictureAndReturnMetrics } from '../src'

const namespace = 'DoorCloud:Demo:takePictureAndSaveMetrics'
const log = debug(namespace)

const main = async () => {
  const regexNumber = /^\d+$/
  const iterations = regexNumber.test(process.argv[2])
    ? parseInt(process.argv[2])
    : 1000
  const results: (string | number)[][] = [['timeAt', 'seconds']]
  let average = 0

  log(`Taking photos ${iterations}...`)

  for (let i = 0; i < iterations; i++) {
    const seconds = await takePictureAndReturnMetrics('jpg')

    average += seconds
    results.push([new Date().toISOString(), seconds])
    log(`Photo: ${i + 1}`)
  }

  average = parseFloat((average / iterations).toFixed(3))
  writeFileSync(
    resolve(__dirname, 'metrics', 'takingPhoto.csv'),
    results.join('\n'),
    'utf-8'
  )
  log(`Done! Average time: ${average} seconds`)
  process.exit(0)
}

main()
