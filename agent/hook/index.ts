
import BaseAddr from "./utils/addr.js";
import { hookNt as hookNt } from "./nt/index.js";

export const hook = (baseAddr: BaseAddr) => {
    // hookCPP(baseAddr)
    hookNt(baseAddr)
}