import BaseAddr from "../../utils/addr.js"
import { hookParamParse } from "./param-parse.js"
import { hookProcess } from "./process-start.js"

export const hookOIDB = (baseAddr: BaseAddr) => {
    hookParamParse(baseAddr)
    hookProcess(baseAddr)
}