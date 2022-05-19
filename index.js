/*
 * @Author:
 * @Date: 2021-07-16 14:41:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-19 14:09:09
 * @Description: 批量压缩图片
 * @FilePath: \tinypng-node-demo-master\index.js
 */
const fs = require('fs')
const tinify = require('tinify')
const paths = require('path')
const root = paths.join(__dirname + '/img')
const key = 'wfFQcRv3QncQ294TS8MZhQTbplddczYC'
tinify.key = key

const color1 = '\x1B[34m%s\x1B[39m'
const color2 = '\x1B[36m%s\x1B[0m'

// 图片压缩
const task = async (oFile, nFile) => {
  try {
    let fileName = ''
    const source = tinify.fromFile(oFile)
    let res = await source.toFile(nFile).then(res => {
      console.log(color2, `压缩成功,地址是${nFile}`)
      fileName = nFile
      return fileName
    })
    return res
  } catch (error) {
    console.log('压缩发生错误', error)
  }
}

// 获取文件夹
const getDirSync = async path => {
  // 同步读取目录
  let fileList = fs.readdirSync(path)
  // 判断是否存在此路径
  let isMkdir = fs.existsSync('./compress')
  if (!isMkdir) {
    console.log(color1, '没有发现compress文件夹，开始创建')
    // 同步创建目录
    fs.mkdirSync('./compress')
    isMkdir = true
    console.log(color2, 'compress文件夹创建完成')
    getDirSync(path)
  } else {
    let res = await Promise.all(
      fileList.map(async item => {
        let file = `${path}/${item}`
        // 返回有关文件的信息
        let info = fs.statSync(file)
        // 返回一个布尔值，
        let state = info.isDirectory()
        if (state && isMkdir) {
          getDirSync(file)
          // 同步创建目录
          fs.mkdirSync(`./compress/${item}`)
        } else {
          let io = paths.resolve(path + '/' + item, '..')
          let name = io.replace('img', 'compress') + `/${item}`
          console.log(color1, `正在压缩${file}图片，存放到compress文件夹`)
          const res = await task(file, name)
          return res
        }
      })
    )
    if (res.length == fileList.length) {
      console.log(color1, `所有图片压缩成功`)
    }
  }
}

getDirSync(root)
