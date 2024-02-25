const fs = require('fs')

const transitTable = require('../res/transit_table.json')
const path = require('path')
// console.log(transitTable)
const mapInt = transitTable.offset_0

// using BNF = std::vector<std::shared_ptr<WXSS::CSSTreeLib::Base>>;
let ret = ''
// std::map<int,std::map<std::string,std::vector<WXSS::CSSTreeLib::BNF>>>
for (const mapIntItem of mapInt.data) {
    ret += `auto v${mapIntItem.key} = &this->offset_0[${mapIntItem.key}];\n`
    const v1 = mapIntItem.value
    // std::map<std::string,std::vector<WXSS::CSSTreeLib::BNF>>
    for (const mapStrItem1 of v1.data){
        const k2 = mapStrItem1.key
        const v2 = mapStrItem1.value
        ret += '{\n'
        ret += 'std::vector<std::shared_ptr<WXSS::CSSTreeLib::Base>> v1416;\n'
        for (const vec1 of v2.data) {
            for (let i=0; i < vec1.data.length; i++) {
                const item = vec1.data[i]
                switch (item.offset_0) {
                    case '0x519b58':
                        /*
                        std::shared_ptr<WXSS::CSSTreeLib::Base> v1412(new WXSS::CSSTreeLib::Base());
                        // off_519B58
                        v1412->offset_4_str = "+";
                        v1416_2.push_back(v1412);
                        */
                        if ("<EMPTY std::string>" === item.offset_36)
                        item.offset_36 = ""
                       ret += `
                        std::shared_ptr<WXSS::CSSTreeLib::Base> base_${i}(new WXSS::CSSTreeLib::Base());
                        base_${i}->offset_0 = off_519B58;
                        base_${i}->offset_4_str = "${item.offset_4}";
                        base_${i}->offset_28 = ${item.offset_28};
                        base_${i}->offset_32 = ${item.offset_32};
                        base_${i}->offset_36 = "${item.offset_36}";
                        v1416.push_back(base_${i});
                       `
                        break;
                    case '0x519b2c':
                        /*
                        std::shared_ptr<WXSS::CSSTreeLib::Base> v1415(new WXSS::CSSTreeLib::Base());
                        // v1415->offset_0 = off_519B2C
                        v1415->offset_4_str = "SELECTOR";
                        v1415->offset_28 = 0;
                        v1415->offset_32 = 2;
                        v1415->offset_36 = "";
                        v1416.push_back(v1415);
                        */
                        if ("<EMPTY std::string>" === item.offset_36)
                            item.offset_36 = ""
                        ret += `
                        std::shared_ptr<WXSS::CSSTreeLib::Base> base_${i}(new WXSS::CSSTreeLib::Base());
                        base_${i}->offset_0 = off_519B2C;
                        base_${i}->offset_4_str = "${item.offset_4}";
                        base_${i}->offset_28 = ${item.offset_28};
                        base_${i}->offset_32 = ${item.offset_32};
                        base_${i}->offset_36 = "${item.offset_36}";
                        v1416.push_back(base_${i});
                        `
                        break;
                    case '0x519a44':
                        ret += `
                        std::shared_ptr<WXSS::CSSTreeLib::Base> base_${i}(new WXSS::CSSTreeLib::Base());
                        base_${i}->offset_0 = off_519A44;
                        base_${i}->offset_4_int = ${item.offset_4};
                        v1416.push_back(base_${i});
                        `
                        break;
                    case '0x519b18':
                        ret += `
                        std::shared_ptr<WXSS::CSSTreeLib::Base> base_${i}(new WXSS::CSSTreeLib::Base());
                        base_${i}->offset_0 = off_519B18;
                        v1416.push_back(base_${i});
                        `
                        break;
                    default:
                        console.log('not supported', JSON.stringify(item))
                        break
                }
            }
        }
        ret += `(*v${mapIntItem.key})["${k2}"].push_back(v1416);\n`
        ret += '}\n'
    }
}

fs.writeFileSync(path.resolve(__dirname, '../res/transitTable.cpp'), ret)