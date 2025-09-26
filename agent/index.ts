
import BaseAddr from "./hook/utils/addr.js"
import { hook } from "./hook/index.js"
;import { useLogger } from "./utils/log.js";
(() => {
    const log = useLogger('init')
    const type = 'wrapper'
    const moduleName = 'wrapper.node'
    // Process.enumerateModules().forEach(m => {
    //     log.info(`module: ${m.name} base: ${m.base} size: ${m.size}`)
    // })
    const module = Process.getModuleByName(moduleName);
    if (module == null)
        throw new Error(`Module ${moduleName} not found!`)
    log.info('module:', module)
    const baseAddr = new BaseAddr(type, module.base)
    log.info('start hook')
    hook(baseAddr)
})()