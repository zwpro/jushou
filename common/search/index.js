//import persistence from "./modules/persistence";
// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./module', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})


//modules 就是我们引入modules文件夹下的所有方法
export let search = modules