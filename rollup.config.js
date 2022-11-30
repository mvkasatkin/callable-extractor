import typescript from 'rollup-plugin-typescript'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: 'src/index.ts',
    external: [],
    plugins: [
      typescript(),
    ],
    output: [
      { file: 'dist/index.cjs', format: 'cjs' },
      { file: 'dist/index.esm.js', format: 'es' },
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.d.ts', format: 'es' }
    ],
    plugins: [
      dts()
    ],
  },
]
