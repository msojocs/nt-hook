import BaseAddr from "../utils/addr.js"
import { hookLog } from "./log-win32.js"
import { hookDBLinux } from "./db-linux.js"
import { hookDBWin32 } from "./db-win32.js"
import { hookSql } from "./sql-linux.js"

export const hookNt = (baseAddr: BaseAddr) => {
    hookLog(baseAddr)
    // hookDBLinux(baseAddr)
    // hookSql(baseAddr)
}