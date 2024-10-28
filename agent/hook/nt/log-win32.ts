import { useLogger } from "../../utils/log.js";
import { StdString } from "../../cpp/std_string.js";
import BaseAddr from "../utils/addr.js";

class VSprintf {
    private format: string
    private argList: NativePointer
    constructor(format: string, argList: NativePointer)
    {
        this.argList = argList
        this.format = format
    }
    toString()
    {
        const handle = [
            {
                exp: 'd',
                handle: (argIndex: number) => {
                    const arg = this.argList.add(argIndex * 8)
                    return arg.readInt()
                }
            },
            {
                exp: '02d',
                handle: (argIndex: number) => {
                    const arg = this.argList.add(argIndex * 8)
                    return arg.readInt()
                }
            },
            {
                exp: '05d',
                handle: (argIndex: number) => {
                    const arg = this.argList.add(argIndex * 8)
                    return arg.readInt()
                }
            },
            {
                exp: 'lld',
                handle: (argIndex: number) => {
                    const arg = this.argList.add(argIndex * 8)
                    return arg.readLong()
                }
            },
            {
                exp: '+.1f',
                handle: (argIndex: number) => {
                    const arg = this.argList.add(argIndex * 8)
                    return arg.readFloat()
                }
            },
            {
                exp: 's',
                handle: (argIndex: number) => {
                    const arg = this.argList.add(argIndex * 8)
                    // console.log(arg.readPointer().readByteArray(16))
                    return arg.readPointer().readUtf8String()
                }
            },
        ]
        let result = ''
        let argIndex = 0
        for(let i=0; i < this.format.length; i++)
        {
            if (this.format[i] === '%')
            {
                // 表达式
                const subFormat = this.format.substring(i + 1)
                const h = handle.find(e => subFormat.startsWith(e.exp))
                if (h)
                {
                    result += h.handle(argIndex)
                    i += h.exp.length
                }
                argIndex++
            }
            else
            {
                // 非表达式
                result += this.format[i]
            }
        }
        return result
    }
}

export const hookLog = (baseAddr: BaseAddr) => {
    {
      const targetAddr = baseAddr.resolveAddress('0x035BC858')
      if (targetAddr != null) {
        const log = useLogger('vsprintf')
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
                const format = args[3].readUtf8String()
                if (format && !format.startsWith('%d-%02d-%02d'))
                {
                    log.info('write target:', args[0])
                    args[0] = ptr('1')
                    log.info(args[1].readPointer().readByteArray(args[2].toInt32()))
                    log.info(args[2].toInt32())
                    log.info(args[3].readUtf8String())
                    log.info(args[5].readByteArray(16))
                
                    const printf = new VSprintf(format, args[5])
                    log.info(printf.toString())
                }
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
      const targetAddr = baseAddr.resolveAddress('0x035BCAAC')
      if (targetAddr != null) {
        const log = useLogger('vsprintf_s')
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
                const format = args[3].readUtf8String()
                if (format && !format.startsWith('%d-%02d-%02d'))
                {
                    log.info('write target:', args[0])
                    // args[0] = new NativePointer(0x1)
                    log.info(args[1].readPointer().readByteArray(args[2].toInt32()))
                    log.info(args[2].toInt32())
                    log.info(args[3].readUtf8String())
                    log.info(args[5].readByteArray(16))
                
                    const printf = new VSprintf(format, args[5])
                    log.info(printf.toString())
                }
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
      const targetAddr = baseAddr.resolveAddress('0x035BCBC0')
      if (targetAddr != null) {
        const log = useLogger('vsnprintf_s')
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
                const format = args[3].readUtf8String()
                if (format && !format.startsWith('%d-%02d-%02d'))
                {
                    log.info('write target:', args[0])
                    // args[0] = new NativePointer(0x1)
                    log.info(args[1].readPointer().readByteArray(args[2].toInt32()))
                    log.info(args[2].toInt32())
                    log.info(args[3].readUtf8String())
                    log.info(args[5].readByteArray(16))
                
                    const printf = new VSprintf(format, args[5])
                    log.info(printf.toString())
                }
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
      const targetAddr = baseAddr.resolveAddress('0x035BC1E8')
      if (targetAddr != null) {
        const log = useLogger('vswprintf')
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
                const format = args[3].readUtf8String()
                if (format && !format.startsWith('%d-%02d-%02d'))
                {
                    log.info('write target:', args[0])
                    // args[0] = new NativePointer(0x1)
                    log.info(args[1].readPointer().readByteArray(args[2].toInt32()))
                    log.info(args[2].toInt32())
                    log.info(args[3].readUtf8String())
                    log.info(args[5].readByteArray(16))
                
                    const printf = new VSprintf(format, args[5])
                    log.info(printf.toString())
                }
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
      const targetAddr = baseAddr.resolveAddress('0x035BC444')
      if (targetAddr != null) {
        const log = useLogger('vswprintf_s')
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
                const format = args[3].readUtf8String()
                if (format && !format.startsWith('%d-%02d-%02d'))
                {
                    log.info('write target:', args[0])
                    // args[0] = new NativePointer(0x1)
                    log.info(args[1].readPointer().readByteArray(args[2].toInt32()))
                    log.info(args[2].toInt32())
                    log.info(args[3].readUtf8String())
                    log.info(args[5].readByteArray(16))
                
                    const printf = new VSprintf(format, args[5])
                    log.info(printf.toString())
                }
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
      const targetAddr = baseAddr.resolveAddress('0x035BC558')
      if (targetAddr != null) {
        const log = useLogger('vsnwprintf_s')
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
                const format = args[3].readUtf8String()
                if (format && !format.startsWith('%d-%02d-%02d'))
                {
                    log.info('write target:', args[0])
                    // args[0] = new NativePointer(0x1)
                    log.info(args[1].readPointer().readByteArray(args[2].toInt32()))
                    log.info(args[2].toInt32())
                    log.info(args[3].readUtf8String())
                    log.info(args[5].readByteArray(16))
                
                    const printf = new VSprintf(format, args[5])
                    log.info(printf.toString())
                }
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
    // {
    //   const targetAddr = baseAddr.resolveAddress('0x002888DC')
    //   if (targetAddr != null) {
    //     const log = useLogger('output overwrite')
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
    //             log.info(`onEnter`);
    //             log.info('[+] Called targetAddr:' + targetAddr);
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
    //         retval.replace(new NativePointer(0x1))
    //       }
    //     });
    //   }
    // }
    // {
    //     const target = 'forwardMsg'
    //     const targetAddr = baseAddr.resolveAddress('0x11FE480')
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     const p = args[0].readPointer()
    //                     const pLength = p.add(4 * 4).readInt()
    //                     console.log('pLength:', pLength)

    //                     const pList = p.add(8).readPointer()
    //                     const msgList = pList.readPointer()
    //                     const msgLength = msgList.add('0xB').readInt() / 2
    //                     console.log('msgLength:', msgLength)
    //                     const _list = msgList.add(0x5a)
    //                     for (let i = 0; i < msgLength; i++) {
    //                         const msg = _list.add(0xa4 * i)
    //                         const len = msg.add(0x35)
    //                         console.log('len:', len.readInt())
    //                         const msgId = len.add(4).readCString(len.readInt())
    //                         console.log(`msg[${i}]:`, msgId)
    //                     }
                        
    //                     const fromPeer = pList.add(1 * 8).readPointer()
    //                     const fromId = fromPeer.add(48)
    //                     const _fromId = fromId.add(0xb).readCString(fromId.add(7).readInt())
    //                     console.log('chatType:', fromPeer.add(0xb).readInt() / 2, 'id:', _fromId)
    //                     const toPeer = pList.add(2 * 8).readPointer()
    //                     const toId = toPeer.add(48)
    //                     const _toId = toId.add(0xb).readCString(toId.add(7).readInt())
    //                     console.log('chatType:', toPeer.add(0xb).readInt() / 2, 'id:', _toId)

    //                     const cmtList = pList.add(3 * 8).readPointer()
    //                     const attrMap = pList.add(4 * 8).readPointer()
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
    const logAdd = (addr: string) => {
        const target = 'log - ' + addr
        const targetAddr = baseAddr.resolveAddress(addr)
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
                        
                        console.log(`\n${target} - onEnter`);
                        console.log('[+] Called targetAddr:' + targetAddr);
                        // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
                        // console.log('arg0:', readStdString(args[0]))
                        console.log('[+] Argv0: ', args[0])
                        
                        for (let i = 0; i < 12; i++) {
                            const cur = args[i]
                            console.log(`a${i + 1} :`, cur)
                            try {
                              console.log(`a${i + 1} int:`, cur.readInt())
                                console.log(`a${i + 1} raw str:`, cur.readUtf8String())

                            }catch{
                                // console.log('read str error')
                            }
                            try {
                                const ptr = cur.readPointer()
                                console.log(`a${i + 1} ptr:`, ptr)
                                console.log(`a${i + 1} str:`, ptr.readUtf8String())
                            } catch (error) {
                                // console.log('read std::str error')
                            }
                            
                        }
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
                    console.log('\n')
                }
            });
        }
    }
    const logList = [
        '0x01BD215D',
        '0x0804f', // 00007FFAA3DFCF10
        '0x00001471',
        '0x0004BE56',
    ]
    for (const addr of logList) {
        logAdd(addr)
    }
    // {
    //     const target = 'log58BE80'
    //     const targetAddr = baseAddr.resolveAddress('0x58BE80')
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     const a1 = args[0].readPointer()
    //                     const a2 = args[1].readPointer()
    //                     console.log('a2:', a2.readUtf8String())
    //                     try {
    //                         const a3 = args[2].readPointer()
    //                         console.log('a3:', a3.readUtf8String())
    //                     }
    //                     catch(e) {
    //                         const a3 = args[2].readInt()
    //                         console.log('a3 try to read int:', a3)
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
    // {
    //     const target = 'log58BF40'
    //     const targetAddr = baseAddr.resolveAddress('0x58BF40')
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     const a1 = args[0].readPointer()
    //                     const a2 = args[1].readPointer()
    //                     console.log('a2:', a2.readUtf8String())
    //                     try {
    //                         const a3 = args[2].readPointer()
    //                         console.log('a3:', a3.readUtf8String())
    //                     }
    //                     catch(e) {
    //                         const a3 = args[2].readInt()
    //                         console.log('a3 try to read int:', a3)
    //                     }
    //                     try {
    //                         const a4 = args[3].readPointer()
    //                         // const len = args[3].add(16).readInt()
    //                         // const byte = a4.readByteArray(len)
    //                         console.log('a4:', a4.readUtf8String())
    //                     }catch(e) {
    //                         const a4 = args[3].readInt()
    //                         console.log('a4 try to read int:', a4)
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
    // {
    //     const target = 'log58C4E0'
    //     const targetAddr = baseAddr.resolveAddress('0x58C4E0')
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     const a1 = args[0].readPointer()
    //                     const a2 = args[1].readPointer()
    //                     console.log('a2:', a2.readUtf8String())
    //                     try {
    //                         const a3 = args[2].readPointer()
    //                         console.log('a3:', a3.readUtf8String())
    //                     }
    //                     catch(e) {
    //                         const a3 = args[2].readInt()
    //                         console.log('a3 try to read int:', a3)
    //                     }
    //                     try {
    //                         const a4 = args[3].readPointer()
    //                         // const len = args[3].add(16).readInt()
    //                         // const byte = a4.readByteArray(len)
    //                         console.log('a4:', a4.readUtf8String())
    //                     }catch(e) {
    //                         const a4 = args[3].readInt()
    //                         console.log('a4 try to read int:', a4)
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
    // {
    //     const target = 'log69B427'
    //     const targetAddr = baseAddr.resolveAddress('0x69B427')
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     const a1 = args[0].readPointer()
    //                     const a2 = args[1].readPointer()
    //                     console.log('a2:', a2.readUtf8String())
    //                     try {
    //                         const a3 = args[2].readPointer()
    //                         console.log('a3:', a3.readUtf8String())
    //                     }
    //                     catch(e) {
    //                         const a3 = args[2].readInt()
    //                         console.log('a3 try to read int:', a3)
    //                     }
    //                     try {
    //                         const a4 = args[3].readPointer()
    //                         console.log('a4:', a4.readUtf8String())
    //                     }catch(e) {
    //                         const a4 = args[3].readInt()
    //                         console.log('a4 try to read int:', a4)
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
    // {
    //     const target = 'log031A7850'
    //     const targetAddr = baseAddr.resolveAddress('0x031A7850')
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     const a1 = args[0].readPointer()
    //                     const a2 = args[1].readPointer()
    //                     console.log('a2:', a2.readUtf8String())
    //                     try {
    //                         const a3 = args[2].readPointer()
    //                         console.log('a3:', a3.readUtf8String())
    //                     }
    //                     catch(e) {
    //                         const a3 = args[2].readInt()
    //                         console.log('a3 try to read int:', a3)
    //                     }
    //                     try {
    //                         const a4 = args[3].readPointer()
    //                         console.log('a4:', a4.readUtf8String())
    //                     }catch(e) {
    //                         const a4 = args[3].readInt()
    //                         console.log('a4 try to read int:', a4)
    //                     }
    //                     try {
    //                         const a5 = args[4].readPointer()
    //                         console.log('a5:', a5.readUtf8String())
    //                     }catch(e) {
    //                         const a5 = args[4].readInt()
    //                         console.log('a45try to read int:', a5)
    //                     }
    //                     try {
    //                         const a6 = args[5].readPointer()
    //                         console.log('a6:', a6.readUtf8String())
    //                     }catch(e) {
    //                         const a6 = args[5].readInt()
    //                         console.log('a6 try to read int:', a6)
    //                     }
    //                     try {
    //                         const a7 = args[6].readPointer()
    //                         console.log('a7:', a7.readUtf8String())
    //                     }catch(e) {
    //                         const a7 = args[6].readInt()
    //                         console.log('a7 try to read int:', a7)
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
    // {
    //     const addr = "02F7B780"
    //     const target = 'SQL' + addr
    //     const targetAddr = baseAddr.resolveAddress('0x' + addr)
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     try {
                                
    //                         const a1 = args[0].readPointer()
    //                     } catch (error) {
    //                         const a1 = args[0].readInt()
    //                         console.log('a1 try to read int:', a1)
    //                     }
    //                     try {
                                
    //                         const a2 = args[1].readPointer()
    //                         console.log('a2:', a2.readUtf8String())
    //                     } catch (error) {
    //                         const a2 = args[1].readInt()
    //                         console.log('a2 try to read int:', a2)
    //                     }
    //                     try {
    //                         const a3 = args[2].readPointer()
    //                         console.log('a3:', a3.readUtf8String())
    //                     }
    //                     catch(e) {
    //                         const a3 = args[2].readInt()
    //                         console.log('a3 try to read int:', a3)
    //                     }
    //                     try {
    //                         const a4 = args[3].readPointer()
    //                         console.log('a4:', a4.readUtf8String())
    //                     }catch(e) {
    //                         const a4 = args[3].readInt()
    //                         console.log('a4 try to read int:', a4)
    //                     }
    //                     try {
    //                         const a5 = args[4].readPointer()
    //                         console.log('a5:', a5.readUtf8String())
    //                     }catch(e) {
    //                         const a5 = args[4].readInt()
    //                         console.log('a45try to read int:', a5)
    //                     }
    //                     try {
    //                         const a6 = args[5].readPointer()
    //                         console.log('a6:', a6.readUtf8String())
    //                     }catch(e) {
    //                         const a6 = args[5].readInt()
    //                         console.log('a6 try to read int:', a6)
    //                     }
    //                     try {
    //                         const a7 = args[6].readPointer()
    //                         console.log('a7:', a7.readUtf8String())
    //                     }catch(e) {
    //                         const a7 = args[6].readInt()
    //                         console.log('a7 try to read int:', a7)
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
    // {
    //     const target = 'SQL03266770'
    //     const targetAddr = baseAddr.resolveAddress('0x03266770')
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     try {
                                
    //                         const a1 = args[0].readUtf8String()
    //                         console.log('a1:', a1)
    //                     } catch (error) {
    //                         const a1 = args[0].readInt()
    //                         console.log('a1 try to read int:', a1)
    //                     }
    //                     try {
                                
    //                         console.log('a2:', args[1])
    //                         // const a2 = args[1].readPointer()
    //                         // console.log('a2 str:', a2.readUtf8String())
    //                     } catch (error) {
    //                         const a2 = args[1].readInt()
    //                         console.log('a2 try to read int:', a2)
    //                     }
    //                     try {
    //                         const a3 = args[2]
    //                         console.log('a3:', a3)
    //                     }
    //                     catch(e) {
    //                         const a3 = args[2].readInt()
    //                         console.log('a3 try to read int:', a3)
    //                     }
    //                     try {
    //                         const a4 = args[3]
    //                         console.log('a4:', a4)
    //                     }catch(e) {
    //                         const a4 = args[3].readInt()
    //                         console.log('a4 try to read int:', a4)
    //                     }
    //                     try {
    //                         const a5 = args[4]
    //                         console.log('a5:', a5)
    //                     }catch(e) {
    //                         const a5 = args[4].readInt()
    //                         console.log('a45try to read int:', a5)
    //                     }
    //                     try {
    //                         const a6 = args[5]
    //                         console.log('a6:', a6)
    //                     }catch(e) {
    //                         const a6 = args[5].readInt()
    //                         console.log('a6 try to read int:', a6)
    //                     }
    //                     try {
    //                         const a7 = args[6].readPointer()
    //                         console.log('a7:', a7.readUtf8String())
    //                     }catch(e) {
    //                         const a7 = args[6].readInt()
    //                         console.log('a7 try to read int:', a7)
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
    // {
    //     const addr = "03275930"
    //     const target = 'SQL' + addr
    //     const targetAddr = baseAddr.resolveAddress('0x' + addr)
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     try {
                                
    //                         const a1 = args[0].readPointer()
    //                     } catch (error) {
    //                         const a1 = args[0].readInt()
    //                         console.log('a1 try to read int:', a1)
    //                     }
    //                     try {
                                
    //                         const a2 = args[1].readPointer()
    //                         console.log('a2:', a2.readUtf8String())
    //                     } catch (error) {
    //                         const a2 = args[1].readInt()
    //                         console.log('a2 try to read int:', a2)
    //                     }
    //                     try {
    //                         const a3 = args[2].readPointer()
    //                         console.log('a3:', a3.readUtf8String())
    //                     }
    //                     catch(e) {
    //                         const a3 = args[2].readInt()
    //                         console.log('a3 try to read int:', a3)
    //                     }
    //                     try {
    //                         const a4 = args[3].readPointer()
    //                         console.log('a4:', a4.readUtf8String())
    //                     }catch(e) {
    //                         const a4 = args[3].readInt()
    //                         console.log('a4 try to read int:', a4)
    //                     }
    //                     try {
    //                         const a5 = args[4].readPointer()
    //                         console.log('a5:', a5.readUtf8String())
    //                     }catch(e) {
    //                         const a5 = args[4].readInt()
    //                         console.log('a45try to read int:', a5)
    //                     }
    //                     try {
    //                         const a6 = args[5].readPointer()
    //                         console.log('a6:', a6.readUtf8String())
    //                     }catch(e) {
    //                         const a6 = args[5].readInt()
    //                         console.log('a6 try to read int:', a6)
    //                     }
    //                     try {
    //                         const a7 = args[6].readPointer()
    //                         console.log('a7:', a7.readUtf8String())
    //                     }catch(e) {
    //                         const a7 = args[6].readInt()
    //                         console.log('a7 try to read int:', a7)
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
    // {
    //     const addr = "032AD9F0"
    //     const target = 'SQL' + addr
    //     const targetAddr = baseAddr.resolveAddress('0x' + addr)
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     try {
                                
    //                         const a1 = args[0].readPointer()
    //                     } catch (error) {
    //                         const a1 = args[0].readInt()
    //                         console.log('a1 try to read int:', a1)
    //                     }
    //                     try {
                                
    //                         const a2 = args[1].readPointer()
    //                         console.log('a2:', a2.readUtf8String())
    //                     } catch (error) {
    //                         const a2 = args[1].readInt()
    //                         console.log('a2 try to read int:', a2)
    //                     }
    //                     try {
    //                         const a3 = args[2].readPointer()
    //                         console.log('a3:', a3.readUtf8String())
    //                     }
    //                     catch(e) {
    //                         const a3 = args[2].readInt()
    //                         console.log('a3 try to read int:', a3)
    //                     }
    //                     try {
    //                         const a4 = args[3].readPointer()
    //                         console.log('a4:', a4.readUtf8String())
    //                     }catch(e) {
    //                         const a4 = args[3].readInt()
    //                         console.log('a4 try to read int:', a4)
    //                     }
    //                     try {
    //                         const a5 = args[4].readPointer()
    //                         console.log('a5:', a5.readUtf8String())
    //                     }catch(e) {
    //                         const a5 = args[4].readInt()
    //                         console.log('a45try to read int:', a5)
    //                     }
    //                     try {
    //                         const a6 = args[5].readPointer()
    //                         console.log('a6:', a6.readUtf8String())
    //                     }catch(e) {
    //                         const a6 = args[5].readInt()
    //                         console.log('a6 try to read int:', a6)
    //                     }
    //                     try {
    //                         const a7 = args[6].readPointer()
    //                         console.log('a7:', a7.readUtf8String())
    //                     }catch(e) {
    //                         const a7 = args[6].readInt()
    //                         console.log('a7 try to read int:', a7)
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
    // {
    //     const addr = "032DAE50"
    //     const target = 'SQL' + addr
    //     const targetAddr = baseAddr.resolveAddress('0x' + addr)
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     try {
                                
    //                         const a1 = args[0].readPointer()
    //                     } catch (error) {
    //                         const a1 = args[0].readInt()
    //                         console.log('a1 try to read int:', a1)
    //                     }
    //                     try {
                                
    //                         const a2 = args[1].readPointer()
    //                         console.log('a2:', a2.readUtf8String())
    //                     } catch (error) {
    //                         const a2 = args[1].readInt()
    //                         console.log('a2 try to read int:', a2)
    //                     }
    //                     try {
    //                         const a3 = args[2].readPointer()
    //                         console.log('a3:', a3.readUtf8String())
    //                     }
    //                     catch(e) {
    //                         const a3 = args[2].readInt()
    //                         console.log('a3 try to read int:', a3)
    //                     }
    //                     try {
    //                         const a4 = args[3].readPointer()
    //                         console.log('a4:', a4.readUtf8String())
    //                     }catch(e) {
    //                         const a4 = args[3].readInt()
    //                         console.log('a4 try to read int:', a4)
    //                     }
    //                     try {
    //                         const a5 = args[4].readPointer()
    //                         console.log('a5:', a5.readUtf8String())
    //                     }catch(e) {
    //                         const a5 = args[4].readInt()
    //                         console.log('a45try to read int:', a5)
    //                     }
    //                     try {
    //                         const a6 = args[5].readPointer()
    //                         console.log('a6:', a6.readUtf8String())
    //                     }catch(e) {
    //                         const a6 = args[5].readInt()
    //                         console.log('a6 try to read int:', a6)
    //                     }
    //                     try {
    //                         const a7 = args[6].readPointer()
    //                         console.log('a7:', a7.readUtf8String())
    //                     }catch(e) {
    //                         const a7 = args[6].readInt()
    //                         console.log('a7 try to read int:', a7)
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
    // {
    //     const addr = "00727180"
    //     const target = 'LOG' + addr
    //     const targetAddr = baseAddr.resolveAddress('0x' + addr)
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     try {
                                
    //                         const a1 = args[0].readPointer()
    //                     } catch (error) {
    //                         const a1 = args[0].readInt()
    //                         console.log('a1 try to read int:', a1)
    //                     }
    //                     try {
                                
    //                         const a2 = args[1].readPointer()
    //                         console.log('a2:', a2.readUtf8String())
    //                     } catch (error) {
    //                         const a2 = args[1].readInt()
    //                         console.log('a2 try to read int:', a2)
    //                     }
    //                     try {
    //                         const a3 = args[2].readPointer()
    //                         console.log('a3:', a3.readUtf8String())
    //                     }
    //                     catch(e) {
    //                         const a3 = args[2].readInt()
    //                         console.log('a3 try to read int:', a3)
    //                     }
    //                     try {
    //                         const a4 = args[3].readPointer()
    //                         console.log('a4:', a4.readUtf8String())
    //                     }catch(e) {
    //                         const a4 = args[3].readInt()
    //                         console.log('a4 try to read int:', a4)
    //                     }
    //                     try {
    //                         const a5 = args[4].readPointer()
    //                         console.log('a5:', a5.readUtf8String())
    //                     }catch(e) {
    //                         const a5 = args[4].readInt()
    //                         console.log('a45try to read int:', a5)
    //                     }
    //                     try {
    //                         const a6 = args[5].readPointer()
    //                         console.log('a6:', a6.readUtf8String())
    //                     }catch(e) {
    //                         const a6 = args[5].readInt()
    //                         console.log('a6 try to read int:', a6)
    //                     }
    //                     try {
    //                         const a7 = args[6].readPointer()
    //                         console.log('a7:', a7.readUtf8String())
    //                     }catch(e) {
    //                         const a7 = args[6].readInt()
    //                         console.log('a7 try to read int:', a7)
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
    // {
    //     const addr = "0074A050"
    //     const target = 'LOG' + addr
    //     const targetAddr = baseAddr.resolveAddress('0x' + addr)
    //     if (targetAddr != null) {
    //         Interceptor.attach(targetAddr, { // Intercept calls to our SetAesDecrypt function

    //             // When function is called, print out its parameters
    //             /*
    //             以下内容演示了
    //             1. 怎么提取 printf 的第一个参数的字符串
    //             2. 怎么结合 onLever 做进入函数的时候获取 该函数要操作的内存和长度 ，等函数工作完毕，提取该数据
    //             其他API 用法
    //             https://frida.re/docs/javascript-api/
    //             */
    //             onEnter: function (args) {
    //                 try {
    //                     console.log(`${target} - onEnter`);
    //                     console.log('[+] Called targetAddr:' + targetAddr);
    //                     // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
    //                     // console.log('arg0:', readStdString(args[0]))
    //                     console.log('[+] Argv0: ', args[0])
    //                     try {
                                
    //                         const a1 = args[0].readPointer()
    //                     } catch (error) {
    //                         const a1 = args[0].readInt()
    //                         console.log('a1 try to read int:', a1)
    //                     }
    //                     try {
                                
    //                         const a2 = args[1].readPointer()
    //                         console.log('a2:', a2.readUtf8String())
    //                     } catch (error) {
    //                         const a2 = args[1].readInt()
    //                         console.log('a2 try to read int:', a2)
    //                     }
    //                     try {
    //                         const a3 = args[2].readPointer()
    //                         console.log('a3:', a3.readUtf8String())
    //                     }
    //                     catch(e) {
    //                         const a3 = args[2].readInt()
    //                         console.log('a3 try to read int:', a3)
    //                     }
    //                     try {
    //                         const a4 = args[3].readPointer()
    //                         console.log('a4:', a4.readUtf8String())
    //                     }catch(e) {
    //                         const a4 = args[3].readInt()
    //                         console.log('a4 try to read int:', a4)
    //                     }
    //                     try {
    //                         const a5 = args[4].readPointer()
    //                         console.log('a5:', a5.readUtf8String())
    //                     }catch(e) {
    //                         const a5 = args[4].readInt()
    //                         console.log('a45try to read int:', a5)
    //                     }
    //                     try {
    //                         const a6 = args[5].readPointer()
    //                         console.log('a6:', a6.readUtf8String())
    //                     }catch(e) {
    //                         const a6 = args[5].readInt()
    //                         console.log('a6 try to read int:', a6)
    //                     }
    //                     try {
    //                         const a7 = args[6].readPointer()
    //                         console.log('a7:', a7.readUtf8String())
    //                     }catch(e) {
    //                         const a7 = args[6].readInt()
    //                         console.log('a7 try to read int:', a7)
    //                     }
    //                 }
    //                 catch (error) {
    //                     console.log('error:', error)
    //                 }
                    
    //                 /*
    //                 dumpAddr('Input', args[0], args[3].toInt32());
    //                 this.outptr = args[1]; // Store arg2 and arg3 in order to see when we leave the function
    //                 this.outsize = args[2].toInt32();
    //                 */
    //             },

    //             // When function is finished
    //             onLeave: function (retval) {
    //                 /*
    //                 dumpAddr('Output', this.outptr, this.outsize); // Print out data array, which will contain de/encrypted data as output
    //                 console.log('[+] Returned from SomeFunc: ' + retval);
    //                 */
    //             //    console.log('retval:', new StdString(retval).toString())
    //                 console.log(`${target} - onLeave\n\n`);
    //             }
    //         });
    //     }
    // }
}