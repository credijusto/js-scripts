'use strict'

const chalk = require('chalk')
const spawn = require('cross-spawn')

process.on('unhandledRejection', err => {
  throw err
})

const isCIEnvironment = process.env.CI === 'true'

const paths = require('../config/paths')
const eslintConfig = `${paths.ownPath}/config/.eslintrc.json`

const sourceDir = 'src'
const jsExtensions = 'js|jsx'
const cssExtensions = 'css|pcss|scss'

const eslintProc = spawn.sync('eslint',
  [
    `${sourceDir}`,
    [
      `${sourceDir}`,
      ...(jsExtensions.split('|').map(ext => ['--ext', ext])),
      isCIEnvironment ? '--check' : '--fix'
    ],
    isCIEnvironment ? '--check' : '--fix'
  ]),
  { stdio: 'inherit' }
)

if (eslintProc.error) {
  process.error(eslintProc.error)
  process.exit(1)
} else {
  console.log(chalk.green('Eslint executed correctly'))
}

const stylelintProc = spawn.sync('stylelint', [`${sourceDir}/**/*.(${cssExtensions})`, isCIEnvironment ? '--check' : '--fix'], {
  stdio: 'inherit',
})

if (stylelintProc.error) {
  console.error(stylelintProc.error)
  process.exit(1)
} else {
  console.log(chalk.green('Stylelint executed correctly'))
}
