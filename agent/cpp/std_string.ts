
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
 * 总24字节
 * 前8个字节
 * 00 00 00 00, 00 00 00 00, 00 00 00 00
 * 前四个字节地址，四个字节长度，四个字节容量
 */
export const STD_STRING_BUF_SIZE = 4;

export class StdString {
    private addr
	constructor(addr: NativePointer) {
		this.addr = addr;
	}

	get bufAddr() {
		return this.addr.readPointer();
		// if(this.reservedSize.compare(16) > 0) {
		// 	return this.addr.readPointer();
		// } else {
		// 	return this.addr;
		// }
	}

	get size() {
		return this.addr.add(4).readU32();
	}

	get reservedSize() {
		return this.addr.add(STD_STRING_BUF_SIZE).add(Process.pointerSize).readU32();
	}

	toString() {
		const size = this.size;
		if(size == 0) {
			return "<EMPTY std::string>";
		}
		const addr = this.bufAddr
		try {
			return addr.readUtf8String(size);
		} catch (error) {
			return addr.readUtf8String(size - 1);
		}
	}
}