import BaseAddr from "../utils/addr.js";
import { useLogger } from "../../utils/log.js";

/**
 * 大小：208
 */
class MsfParse {
  /**
   * *v42
   */
  private p: NativePointer
  constructor(p: NativePointer) {
    this.p = p
  }
  get seq() {
    return this.p.add(8 * Process.pointerSize).readInt()
  }
  get uin() {
    return this.p.add(4 * Process.pointerSize).readUtf8String()
  }
  get cmd() {
    return this.p.readPointer().readUtf8String()
  }
  get dataSize() {
    const v4 = this.p.readPointer()
    const start = v4.add(32).readPointer()
    const end = start.add(8)
    return end.readPointer().sub(start.readPointer()).toInt32()
  }
  get data() {
    const v4 = this.p.readPointer()
    const startPtr = v4.add(32).readPointer().readPointer()
    return startPtr.readByteArray(this.dataSize)
  }
}

export const hookMSF = (baseAddr: BaseAddr) => {
  // {
  //   const targetAddr = baseAddr.resolveAddress('0x00BB21C5')
  //   if (targetAddr != null) {
  //     const log = useLogger('MSF pre1')
  //     Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

  //       // When function is called, print out its parameters
  //       /*
  //       以下内容演示了
  //       1. 怎么提取 printf 的第一个参数的字符串
  //       2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
  //       其他API 用法
  //       https://frida.re/docs/javascript-api/
  //       */
  //       onEnter: function (args) {
  //         try {
  //           log.info(`onEnter`);
  //           log.info('[+] Called targetAddr:' + targetAddr);
  //           const data = args[0]
  //           log.info('seq:', data.add(72).readInt())

  //           const cmdAndData = data.add(40)
  //           const p = cmdAndData.readPointer()
  //           log.info('cmd:', p.readUtf8String())

  //           const start = p.add(32).readPointer()
  //           const end = start.add(8)
  //           const size = end.readPointer().sub(start.readPointer()).toInt32()
  //           log.info('data:', start.readPointer().readByteArray(size))
  //         }
  //         catch (error) {
  //           log.info('error:', error)
  //         }

  //         /*
  //         dumpAddr('Input', args[0], args[3].toInt32());
  //         this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
  //         this.outsize = args[2].toInt32();
  //         */
  //       },

  //       // When function is finished
  //       onLeave: function (retval) {
  //         /*
  //         dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
  //         log.info('[+] Returned from SomeFunc: ' + retval);
  //         */
  //         log.info('retval:', retval)
  //         log.info(`onLeave\n\n`);
  //       }
  //     });
  //   }
  // }
  {
    const targetAddr = baseAddr.resolveAddress('0x01BD1718')
    if (targetAddr != null) {
      const log = useLogger('MSF pre')
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
            const cmdAndData = args[2]
            log.info(cmdAndData.readByteArray(64))
            const p = cmdAndData.readPointer()
            log.info('cmd:', p.readUtf8String())

            const start = p.add(32).readPointer()
            const end = start.add(8)
            const size = end.readPointer().sub(start.readPointer()).toInt32()
            log.info('data:', start.readPointer().readByteArray(size))
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
    const targetAddr = baseAddr.resolveAddress('0x01BD19E8')
    if (targetAddr != null) {
      const log = useLogger('MSF')
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
            const msfData = args[1].readPointer()
            const msf = new MsfParse(msfData)
            log.info('seq:', msf.seq)
            log.info('uin:', msf.uin)
            log.info('cmd:', msf.cmd)
            log.info('dataSize:', msf.dataSize)
            log.info('data:', msf.data)

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