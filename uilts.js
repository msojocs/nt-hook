//字节数组转十六进制字符串，对负值填坑
function Bytes2HexString(arrBytes) {
    var str = "";
    for (var i = 0; i < arrBytes.length; i++) {
        var tmp;
        var num = arrBytes[i];
        if (num < 0) {
            //此处填坑，当byte因为符合位导致数值为负时候，需要对数据进行处理
            tmp = (255 + num + 1).toString(16);
        } else {
            tmp = num.toString(16);
        }
        if (tmp.length == 1) {
            tmp = "0" + tmp;
        }
        str += tmp;
    }
    return str;
}
function byteToString(arr) {
    if(typeof arr === 'string') {
        return arr;
    }
    var str = '',
        _arr = arr;
    for(var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if(v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for(var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
}

const data1 = [-49, 23, -45, 19, -99, 76, -120, 2, -41, 19, -119, 8, -35, 23, -50, 77, -45, 12, -41, 89, -106, 83, -108, 83, -120, 0, -53, 10, -62, 13, -45, 76, -60, 4, -50, 78, -59, 10, -55, 76, -58, 19, -50, 77, -63, 0, -64]
console.log(Bytes2HexString(data1))
console.log(Bytes2HexString([-89, 99]))
console.log(Bytes2HexString([-89, 99]))

const fs = require('fs')
const path = require('path')
const data = fs.readFileSync(path.resolve(__dirname, './musicurl.java')).toString();
// console.log(data)
const mat = data.matchAll(/a\((new byte\[\]\{.*?\}, new byte\[\]\{.*?\})\)/g)
let t = mat.next()
let ret = ""
while(!t.done){
    ret += `\t\tSystem.out.println("${t.value[1]} -> " + new String(b(${t.value[1]})));\r\n`
    t = mat.next()
}
fs.writeFileSync(path.resolve(__dirname, './debug.java'), ret)
