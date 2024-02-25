import { StdString } from "../../cpp/std_string.js";
import BaseAddr from "../utils/addr.js";

export const hookDB = (baseAddr: BaseAddr) => {
  {
    const target = 'db info'
    const targetAddr = baseAddr.resolveAddress('0x0324CC00')
    if (targetAddr != null) {
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
            console.log(`${target} - onEnter`);
            console.log('[+] Called targetAddr:' + targetAddr);
            // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
            // console.log('arg0:', readStdString(args[0]))
            const a1 = args[0]
            const a2 = args[1]
            const a3 = args[2]
            const a4 = args[3]
            console.log('a1:', a1)
            console.log('a1:', a1.readPointer())

            console.log('a2:', a2)
            // console.log('a2:', a2.readUtf8String())

            console.log('a3:', a3)
            console.log('a3:', a3.readUtf8String(16))

            console.log('a4:', a4)
            console.log('a4:', a4.toInt32())
          }
          catch (error) {
            console.log('error:', error)
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
          console.log('[+] Returned from SomeFunc: ' + retval);
          */
          //    console.log('retval:', new StdString(retval).toString())
          console.log(`${target} - onLeave\n\n`);
        }
      });
    }
  }
}