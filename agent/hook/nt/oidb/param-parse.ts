import BaseAddr from "../../utils/addr.js";
import { useLogger } from "../../../utils/log.js";

export const hookParamParse = (baseAddr: BaseAddr) => {
    {
      const targetAddr = baseAddr.resolveAddress('0x01EF0A1B')
      if (targetAddr != null) {
        const log = useLogger('ParamPaser')
        Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function
  
          // When function is called, print out its parameters
          /*
          以下内容演示了
          1. 怎么提取 printf 的第一个参数的字符串
          2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
          其他API 用法
          https://frida.re/docs/javascript-api/
          */
          onEnter: function (args) {
            try {
              log.info(`onEnter`);
              log.info('[+] Called targetAddr:' + targetAddr);
            }
            catch (error) {
              log.info('error:', error)
            }
  
            /*
            dumpAddr('Input', args[0], args[3].toInt32());
            this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
            this.outsize = args[2].toInt32();
            */
          },
  
          // When function is finished
          onLeave: function (retval) {
            /*
            dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
            log.info('[+] Returned from SomeFunc: ' + retval);
            */
            log.info('retval:', retval)
            log.info(`onLeave\n\n`);
          }
        });
      }
    }
  }