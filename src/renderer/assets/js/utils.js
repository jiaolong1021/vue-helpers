const path = require('path')
const fs = require('fs')
const execa = require('execa')

const update = async (projectDist) => {
  const copyDirs = ['src/layout/zlstSidebar/applicationCenter.vue', 'src/layout/zlstSidebar/menuList.vue']
  const projectSrc = '/Users/sjl/Documents/zlst/iam-front2.0'
  // const projectDist = ['/Users/sjl/Documents/zlst/zy-logistics-lms-web']
  const updateMsg = 'update common'

  // 多个工程
  projectDist.forEach((dist) => {
    updateProject(projectSrc, dist, copyDirs, updateMsg)
  })
}
const updateProject = async (src, dist, dirs, commitMsg) => {
  try {
    await execa('git', ['pull'], {
      cwd: dist
    })
  } catch (error) {
    console.log('error', error)
  }
  dirs.forEach(dir => {
    console.log('dist', dist, src, dir)
    fs.writeFileSync(path.join(dist, dir), fs.readFileSync(path.join(src, dir), 'utf-8'))
  })
  try {
    await execa('git', ['add', '.'], {
      cwd: dist
    })
    await execa('git', ['commit', '-m', commitMsg], {
      cwd: dist
    })
    await execa('git', ['push'], {
      cwd: dist
    })
  } catch (error) {
    console.log('error', error)
  }
}

export default {
  update
}
