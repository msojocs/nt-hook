import BaseAddr from "../utils/addr.js"
import { hookCommon } from "./common.js"
import { hookDBLinux } from "./db-linux.js"
import { hookDB } from "./db.js"
import { hookSql } from "./sql-linux.js"

export const hookNt = (baseAddr: BaseAddr) => {
    // hookCommon(baseAddr)
    hookDBLinux(baseAddr)
    // hookSql(baseAddr)
}