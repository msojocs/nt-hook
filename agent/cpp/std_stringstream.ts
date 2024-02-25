
// std::string of MSVC 120 (2013)

/*
union
{
	value_type _Buf[_BUF_SIZE];
	pointer _Ptr;
};
size_type _Mysize;	// current length of string
size_type _Myres;	// current storage reserved for string
*/
/**
 * 
 */

export class StdStringStream {
    private addr: NativePointer
	constructor(addr: NativePointer) {
		this.addr = addr;
	}
    get start() {
        return this.addr.add(20).readPointer()
    }
    get end() {
        return this.addr.add(24).readPointer()
    }
	toJSON() {
		return {
			addr: [
				this.addr.readPointer(),
				this.addr.add(4).readPointer(),
				this.addr.add(8).readPointer(),
				this.addr.add(12).readPointer(),
				this.addr.add(16).readPointer(),
				this.addr.add(20).readPointer(),
			],
			start: this.start,
			end: this.end,
			length: this.end.sub(this.start).toUInt32(),
			content: this.start.readUtf8String(this.end.sub(this.start).toUInt32()),
		}
	}
	toString() {
		return this.start.readUtf8String(this.end.sub(this.start).toUInt32());
	}
}