
// std::deque of MingW 120 (2013)

import { StdString } from "./std_string.js";

/*

	_Map_pointer _M_map;
	size_t _M_map_size;
	iterator _M_start;
	iterator _M_finish;

std::string size 24
*/

export default class StdDeque {
    private addr
    private valueSize
    private introspectElement
	constructor(addr: NativePointer, valueSize: number, introspectElement: (p: NativePointer) => any) {
		this.addr = addr;
		this.valueSize = valueSize;
		this.introspectElement = introspectElement;
	}

	get DEQUESIZ() {
		return this.valueSize <= 1 ? 16
			: this.valueSize <= 2 ? 8
			: this.valueSize <= 4 ? 4
			: this.valueSize <= 8 ? 2
			: 1;
	}

	get containerProxy() {
		return this.addr.readPointer();
	}

	get map() {
		return this.addr.add(Process.pointerSize).readPointer();
	}

	get mapsize() {
		return this.addr.add(Process.pointerSize * 1).readPointer();
	}

	get iteratorStart() {
		return this.addr.add(Process.pointerSize * 2).readPointer();
	}

	get iteratorFinish() {
		return this.addr.add(Process.pointerSize * 6).readPointer();
	}

	get contents() {
		const r: any[] = [];
		const iteratorStart = this.iteratorStart.toInt32();
		const iteratorFinish = this.iteratorFinish.toInt32();
		for(let i = iteratorStart; i < iteratorFinish; i += this.valueSize) {
			const elemAddr = new NativePointer(i)
			let elem;
			if(this.introspectElement) {
				elem = this.introspectElement(elemAddr);
			} else {
				elem = elemAddr.readByteArray(this.valueSize);
			}
			r.push(elem);
		}
		return r;
	}

	toString() {
			return "deque@" + this.addr
				+ "{ map=" + this.map
				+ ", offset=" + this.iteratorStart
				+ ", size=" + this.iteratorFinish
				+ ", contents: " + this.contents + "}";
	}
	
	toJSON() {
		return {
			type: 'std::deque',
			contents: this.contents,
		}
	}
}

export const stdDequeStdStringParse = (p: NativePointer) => {
	/*
	D0 B5 ED 00 10 92 ED 00  E0(起点) EE ED 00 08 00 00 00
	58 B1 ED 00(iteratorStart) 58 B1 ED 00  50 B3 ED 00 EC EE ED 00
	70 B1 ED 00(iteratorFinish) 58 B1 ED 00  50 B3 ED 00 EC EE ED 00
	*/
	return new StdDeque(p, 24, (elePoint) => {
		return new StdString(elePoint).toString() || ''
	})
}