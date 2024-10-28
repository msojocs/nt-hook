import BaseAddr from "../utils/addr.js"
import { hookLog } from "./log-win32.js"
import { hookDBLinux } from "./db-linux.js"
import { hookDBWin32 } from "./db-win32.js"
import { hookSql } from "./sql-linux.js"
import { hookHostsWin32 } from "./host-win32.js"
import { hookOIDB } from "./oidb/oidb.js"
import { hookMSF } from "./msf.js"

export const hookNt = (baseAddr: BaseAddr) => {
    hookLog(baseAddr)
    // hookHostsWin32(baseAddr)
    // hookDBLinux(baseAddr)
    // hookSql(baseAddr)
    hookOIDB(baseAddr)
    hookMSF(baseAddr)
}