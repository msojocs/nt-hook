import { log } from "./logger.js"
import BaseAddr from "./hook/utils/addr.js"
import { hook } from "./hook/index.js"
import { readMap } from "./utils/map.js"

(() => {
    const type = 'wrapper'
    const moduleName = 'wrapper.node'
    const _baseAddr = Module.findBaseAddress(moduleName);
    if (_baseAddr == null)
        throw new Error('baseAddr error!')
    console.log('base addr:', _baseAddr)
    const baseAddr = new BaseAddr(type, _baseAddr)
    console.log('start hook')
    hook(baseAddr)
})()