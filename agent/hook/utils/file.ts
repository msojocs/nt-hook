
import BaseAddr from "./addr.js"

export const hookReadFile = (baseAddr: BaseAddr) => {

    {
        // ReadFile(char *FileName, int a2)
        let fileContentPtr: NativePointer | null
        const targetAddr = baseAddr.resolveAddress('0x11fe480')
        // ReadFile
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
                        
                        console.log('ReadFile - onEnter');
                        console.log('[+] Called targetAddr:' + targetAddr);
                        // console.log('[+] Ctx: ' + args[-1]);
                        // console.log('[+] FormatString: ' + Memory.readAnsiString(args[0])); // Plaintext
                        // console.log('arg0:', readStdString(args[0]))
                        console.log('[+] Argv0: ', args[0])
                        console.log('[+] Argv1: ' + args[1]); // This pointer will store the de/encrypted data
                        fileContentPtr = args[1]
                        // console.log('[+] Argv2: ' + args[2]); // Length of data to en/decrypt
                        // console.log('[+] Argv3: ' + args[3]); // Length of data to en/decrypt
                        // const stdString = args[0]
                        // console.log(stdString.add(0 * Process.pointerSize).readPointer())
                        // console.log(stdString.add(1 * Process.pointerSize).readPointer())
                        // console.log(stdString.add(2 * Process.pointerSize).readPointer())
                        // console.log(stdString.add(3 * Process.pointerSize).readPointer())
                        // console.log('[*] Intercepted printRef() with string length:', StdString.length(args[0]));
                        console.log('arg0:', args[0].readUtf8String())
                        // console.log('test read:', readStdString(ptr('0x00f7fcf0')))
                    } catch (error) {
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
                    console.log('prt:', fileContentPtr)
                }
            });
        }
    }
}