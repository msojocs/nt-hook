const str = 'E8 87 AA E5 BE 8B E5 AD  A6 E4 B9 A0 E5 9E 8B 41'
const t = str.replace(/\s+/g, '').replace(/[0-9a-fA-F]{2}/g, '%$&')
console.log(t)
var r = decodeURIComponent(t);
console.log(r)