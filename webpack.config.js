const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
   entry: './src/app.js',//Входной файл для нашего приложения
   output: { //конфигю обьекта
       filename: 'bundle.[chunkhash].js',//название файла
       path: path.resolve(__dirname/*текущая директория*/, 'public')// скалыдвает все js соеденнёные 
   },
   devServer: {
       port: 3000
   },
   plugins: [
       new HTMLPlugin ({
           template: './src/index.html'
       }),
       new CleanWebpackPlugin()
    ],
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
}