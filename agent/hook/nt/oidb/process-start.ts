import BaseAddr from "../../utils/addr.js";
import { useLogger } from "../../../utils/log.js";
class Buf {
  private p: NativePointer
  constructor(p: NativePointer)
  {
    this.p = p
  }
  get size() {
    return this.p.add(8).readPointer().sub(this.p.readPointer()).toInt32()
  }
  toString() {
    return this.p.readPointer().readUtf8String(this.size)
  }
}
export const hookProcess = (baseAddr: BaseAddr) => {
    {
      const targetAddr = baseAddr.resolveAddress('0x00056DE2')
      if (targetAddr != null) {
        const log = useLogger('Process1')
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
              log.info(args[0])
              log.info(args[1].toInt32())
              log.info(args[2].toInt32())
              log.info(args[3].toInt32())
              log.info(args[4].readUtf8String())
              log.info(args[5].readByteArray(16))
              const buf = new Buf(args[5])
              log.info('buf size:', buf.size)
              log.info('buf data:', buf.toString())
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
    {
      const targetAddr = baseAddr.resolveAddress('0x0005408A')
      if (targetAddr != null) {
        const log = useLogger('Process1 - 1')
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
              log.info('arg0:', args[0])
              log.info('arg1:', args[1].toInt32())
              log.info('arg2:', args[2].toInt32())
              log.info('arg3:', args[3].toInt32())
              log.info('arg4:', args[4].readUtf8String())
              const buf = new Buf(args[5])
              log.info('buf size:', buf.size)
              log.info('buf data:', buf.toString())
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