const { lstatSync, statSync, readdirSync, rename } = require('fs')
const { join } = require('path')

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  getFilesOrDirs(source).filter(isDirectory)
const getFilesOrDirs = source => readdirSync(source).map(name => join(source, name))

const args = process.argv.slice(2)

const path = args[0]

console.log(getDirectories(path))

getDirectories(path).map((folder) => {
    const files = getFilesOrDirs(folder).map((file) => {
        const size = statSync(file).size
        return {
            file,
            size
        }
    })
    let biggestFile = null
    files.forEach((item) => {
        if(!biggestFile || item.size > biggestFile.size)
            biggestFile = item
    })

    const fileName = biggestFile.file.substring(biggestFile.file.lastIndexOf('/')+1)
    rename(biggestFile.file, join(path, fileName), (err) => console.log(err))
    
})
