import BaseAddr from "../utils/addr.js"
import { hookCommon } from "./common.js"
import { hookDB } from "./db.js"

export const hookNt = (baseAddr: BaseAddr) => {
    // hookCommon(baseAddr)
    hookDB(baseAddr)
}