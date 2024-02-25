/*
44 FC 97 00 00 00 00 00  30(起始) 6E D4 76 00 00 00 00
78 C9 E1 00(根元素) F8 A1 E1 00（元素）  68 E0 E1 00（元素） 08 00 00 00（个数）
00 00 E1 00 00 00 00 00  00 00 00 00 74 FC 97 00
74 FC 97 00 00 00 00 00  00 00 00 00 A0 E5 53 00
20 E5 53 00 E0 EE 53 00  40 E9 53 00 00 00 00 00
*/
/**
01 00 00 00 5C FC 97 00（父地址）  C0 BE DE 00（左子地址） 98 CD DE 00（右子地址）
F8 CE DE 00 2B 00 00 00(key)  2B 00 00 00 0D F0 AD BA
0D F0 AD BA 0D F0 AD BA  D8 B6 DE 00 DA 00 00 00(value)
 */

import { StdString } from "./std_string.js"
import { stdVectorStringParse, stdVectorStringParseJSON } from "./std_vector.js"

interface StdMapOption {
    inspectElement: (p: NativePointer) => any
}
const BUF_SIZE = 16
export default class StdMap {
    private addr: NativePointer
    private options: StdMapOption
    constructor(addr: NativePointer, options: StdMapOption) {
        this.addr = addr
        this.options = options
    }
    get size() {
        return this.addr.add(20).readU32()
    }
    /**
     * 中序遍历
     * @param ptr 节点地址
     * @returns 
     */
    inorderTraverse(ptr: NativePointer) {
        const left = ptr.add(8)
        const right = left.add(4)
        let result: string = ''
        if (left.readU32() > 0)
            result += this.inorderTraverse(left.readPointer())
        result += this.options.inspectElement(ptr)
        if (right.readU32() > 0)
            result += this.inorderTraverse(right.readPointer())
        if (result.endsWith(','))
            result = result.substring(0, result.length - 1)
        
        return result
    }
    inorderTraverseJSON(ptr: NativePointer) {
        const left = ptr.add(8)
        const right = left.add(4)
        let result: any[] = []
        if (left.readU32() > 0)
            result.push(...this.inorderTraverseJSON(left.readPointer()))
        result.push(this.options.inspectElement(ptr))
        if (right.readU32() > 0)
            result.push(...this.inorderTraverseJSON(right.readPointer()))
        
        return result
    }
    toJSON() {
        const result: Record<string, any> = {
            type: 'std::map',
            size: this.size,
            data: []
        }
        const startPtr = this.addr.add(8)
        if (startPtr.readU32() > 0) {
            result.data = this.inorderTraverseJSON(startPtr.readPointer())
        }
        return result
    }
    toString() {
        const startPtr = this.addr.add(8)
        let data = `{ size:${this.size}, content:[`
        if (startPtr.readU32() > 0) {
            data = this.inorderTraverse(startPtr.readPointer())
        }
        data += ']'
        return `StdMap{${data}}`
    }
}

export const stdMapString2StringParse = (p: NativePointer) => {
    return new StdMap(p, {
        inspectElement(ptr) {
            // console.log('data:', ptr.readU64().toString(16))
            const keyPtr = ptr.add(16)
            const valuePtr = keyPtr.add(24)
            // console.log('key:', keyPtr)
            // console.log('value:', valuePtr)
            const result = {
                key: '',
                value: '',
            }
            if (keyPtr.readU32() > 0)
                result.key = new StdString(keyPtr).toString() || ''
            if (valuePtr.readU32() > 0)
                result.value = new StdString(valuePtr).toString() || ''
            return JSON.stringify(result, null, 4) + ',\n'
        }
    }).toString()
}

export const stdMapString2StringParseJSON = (p: NativePointer) => {
    return new StdMap(p, {
        inspectElement(ptr) {
            // console.log('data:', ptr.readU64().toString(16))
            const keyPtr = ptr.add(16)
            const valuePtr = keyPtr.add(24)
            // console.log('key:', keyPtr)
            // console.log('value:', valuePtr)
            const result = {
                key: '',
                value: '',
            }
            if (keyPtr.readU32() > 0)
                result.key = new StdString(keyPtr).toString() || ''
            if (valuePtr.readU32() > 0)
                result.value = new StdString(valuePtr).toString() || ''
            return result
        }
    }).toJSON()
}
export const stdMapString2IntParse = (p: NativePointer) => {
    return new StdMap(p, {
        inspectElement(ptr) {
            // console.log('data:', ptr.readU64().toString(16))
            const keyPtr = ptr.add(16)
            const valuePtr = keyPtr.add(24)
            // console.log('key:', keyPtr)
            // console.log('value:', valuePtr)
            const result = {
                key: '',
                value: 0,
            }
            if (keyPtr.readU32() > 0)
                result.key = new StdString(keyPtr).toString() || ''
            if (valuePtr.readU32() > 0)
                result.value = valuePtr.readU32()
            return result
        }
    }).toJSON()
}

/**
 * map<string, vector<string>>
 * @param p 
 * @returns 
 */
export const stdMapString2VectorStringParse = (p: NativePointer) => {
    return new StdMap(p, {
        inspectElement(ptr) {
            // console.log('data:', ptr.readU64().toString(16))
            const keyPtr = ptr.add(16)
            const valuePtr = keyPtr.add(24)
            // console.log('key:', keyPtr)
            // console.log('value:', valuePtr)
            const result = {
                key: '',
                value: '',
            }
            if (keyPtr.readU32() > 0)
                result.key = new StdString(keyPtr).toString() || ''
            if (valuePtr.readU32() > 0)
                result.value = stdVectorStringParse(valuePtr)
            return JSON.stringify(result, null, 4) + ',\n'
        }
    }).toString()
}

/**
 * map<string, vector<string>>
 * @param p 
 * @returns 
 */
export const stdMapString2VectorStringParseJSON = (p: NativePointer) => {
    return new StdMap(p, {
        inspectElement(ptr) {
            // console.log('data:', ptr.readU64().toString(16))
            const keyPtr = ptr.add(16)
            const valuePtr = keyPtr.add(24)
            // console.log('key:', keyPtr)
            // console.log('value:', valuePtr)
            const result = {
                key: '',
                value: {},
            }
            if (keyPtr.readU32() > 0)
                result.key = new StdString(keyPtr).toString() || ''
            if (valuePtr.readU32() > 0)
                result.value = stdVectorStringParseJSON(valuePtr)
            return result
        }
    }).toJSON()
}