/*
 * @Author:
 * @Date: 2021-07-16 14:41:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-17 18:48:52
 * @Description: 批量压缩图片
 * @FilePath: \tinypng-node-demo-master\index.js
 */
const fs = require('fs')
const tinify = require('tinify')
const paths = require('path')
const root = paths.join(__dirname + '/img')
tinify.key = 'wfFQcRv3QncQ294TS8MZhQTbplddczYC'

// 图片压缩
const task = (oFile, nFile) => {
  const source = tinify.fromFile(oFile)
  source.toFile(nFile)
}

// 获取文件夹
const getDirSync = path => {
  let fileList = fs.readdirSync(path)
  Promise.all(
    fileList.map(item => {
      let file = `${path}/${item}`
      let info = fs.statSync(file)
      let state = info.isDirectory()
      let isMkdir = fs.existsSync('./compress')
      if (!isMkdir) {
        console.log('没有发现compress文件夹，开始创建')
        fs.mkdirSync('./compress')
        isMkdir = true
        console.log('compress文件夹创建完成')
      }
      if (state && isMkdir) {
        getDirSync(file)
        fs.mkdirSync(`./compress/${item}`)
      } else {
        let io = paths.resolve(path + '/' + item, '..')
        let name = io.replace('img', 'compress') + `/${item}`
        console.log(`正在压缩${file}图片，存放到compress文件夹`)
        task(file, name)
      }
    })
  )
}

getDirSync(root)
