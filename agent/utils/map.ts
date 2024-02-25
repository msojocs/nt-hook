import { readFileSync } from "fs"
import * as path from "path"
import map from '../../addr_map/map.js'
export const readMap = (type: 'wcc' | 'wcsc') => {
    return map[type]
    // return {}
}