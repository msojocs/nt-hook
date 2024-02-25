const fs = require('fs')
const path = require('path')

const p = path.resolve(__dirname, '../addr_map')
const wccMapContent = fs.readFileSync(`${p}/wcc.map`).toString()
const wcscMapContent = fs.readFileSync(`${p}/wcsc.map`).toString()
const wccMap = {}
{
    const lines = wccMapContent.split('\r\n')
    for (const line of lines) {
        const d = line.split('\t')
        wccMap[d[0]] = d[1]
    }
}
const wcscMap = {}
{
    const lines = wcscMapContent.split('\r\n')
    for (const line of lines) {
        const d = line.split('\t')
        wcscMap[d[0]] = d[1]
    }
}

const map = {
    wcc: wccMap,
    wcsc: wcscMap
}
const json = JSON.stringify(map, null, 4)
fs.writeFileSync(`${p}/map.ts`, `
export default ${json}
`)