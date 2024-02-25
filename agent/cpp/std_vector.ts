
// std::vector of MSVC 120 (2013)

import { StdString } from "./std_string.js"

/*
pointer _Myfirst;	// pointer to beginning of array
pointer _Mylast;	// pointer to current end of sequence
pointer _Myend;		// pointer to end of array
*/

export interface StdVectorOption {
    elementSize: number
    introspectElement: (p: NativePointer) => any
}

export default class StdVector {
    private addr
    private elementSize
    private introspectElement
	constructor(addr: NativePointer, options: StdVectorOption) {
		this.addr = addr;
		this.elementSize = options.elementSize ? options.elementSize : Process.pointerSize;
		this.introspectElement = options.introspectElement;
        // console.log('init ptr:', addr)
	}

	get myfirst() {
        // console.log('myfirst:', this.addr)
		return this.addr.readPointer();
	}

	get mylast() {
        // console.log('mylast')
		return this.addr.add(Process.pointerSize).readPointer();
	}

	get myend() {
        // console.log('myend')
		return this.addr.add(2 * Process.pointerSize).readPointer();
	}

	countBetween(begin: NativePointer, end: NativePointer) {
		if(begin.isNull()) {
			return 0;
		}
		const delta = end.sub(begin);
		return delta.toInt32() / this.elementSize;
	}

	get size() {
		return this.countBetween(this.myfirst, this.mylast);
	}

	get capacity() {
		return this.countBetween(this.myfirst, this.myend);
	}
	toJSON() {
		const result: Record<string, any> = {
			type: 'std::vector',
			first: this.myfirst,
			last: this.mylast,
			end: this.myend,
			size: this.size,
			capacity: this.capacity,
			data: []
		}
		const first = this.myfirst
		if(!first.isNull()) {
			const last = this.mylast;
			for(let p = first; p.compare(last) < 0; p = p.add(this.elementSize)) {
				result.data.push(this.introspectElement(p));
			}
		}
		return result
	}
	toString() {
		let r = "std::vector(" + this.myfirst + ", " + this.mylast + ", " + this.myend + ")";
		r += "{ size: " + this.size + ", capacity: " + this.capacity;
		if(this.introspectElement) {
			r += ", content: [";
			const first = this.myfirst
			if(!first.isNull()) {
				const last = this.mylast;
				for(let p = first; p.compare(last) < 0; p = p.add(this.elementSize)) {
					if(p.compare(first) > 0) {
						r += ", ";
					}
					r += this.introspectElement(p);
				}
			}
			r += "]";
		}
		r += " }";
		return r;
	}
}

export const stdVectorStringParse = (p: NativePointer) => {
	return new StdVector(p, {
		introspectElement(p) {
			return new StdString(p).toString() || 'empty'
		},
		elementSize: 24,
	}).toString()
}
export const stdVectorStringParseJSON = (p: NativePointer) => {
	return new StdVector(p, {
		introspectElement(p) {
			return new StdString(p).toString() || 'empty'
		},
		elementSize: 24,
	}).toJSON()
}