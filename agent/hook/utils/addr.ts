

export default class BaseAddr {
    private baseAddr
    private type: 'wrapper'
    private idaBaseMap: Record<'wrapper', string> = {
        wrapper: '0x000000'
    }
    constructor(type: 'wrapper', baseAddr: NativePointer) {
        this.baseAddr = baseAddr
        this.type = type
    }
    resolveAddress(addr: string) {
        if (this.baseAddr == null)
            throw new Error('baseAddr error!')
        var result;
        try {
            var idaBase = ptr(this.idaBaseMap[this.type]); // Enter the base address of jvm.dll as seen in your favorite disassembler (here IDA)
            var offset = ptr(addr).add(idaBase); // Calculate offset in memory from base address in IDA database
            result = this.baseAddr.add(offset); // Add current memory base address to offset of function to monitor
            console.log('[+] New addr=' + result); // Write location of function in memory to console
        } catch (error) {
            console.log(error)
        }
        return result;
    }
}