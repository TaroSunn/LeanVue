import babel from '@rollup/plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
  input: './src/index.js', // 入口文件
  output: {
    format: 'umd', // 打包格式
    name: 'Vue', // 挂载到window上的名字
    file: 'dist/umd/vue.js', // 打包后文件路径
    sourcemap: true
  },
  plugins: [
    babel({ 
      exclude: 'node_modules',
      babelHelpers: 'bundled',
     }),
     serve({
       port: 3000,
       contentBase: '',
       openPage: '/index.html',
       open: true
     })
  ]
}