/**
 * Read stream
 */
"use strict";

const ts = require('abv-ts')('abv:vfs.RStream');
const Readable = require('stream').Readable;

class RStream extends Readable
{
	// TODO: body = ArrayBuffer, 20180204
	constructor(owner, body, opt)
	{
		if (!owner) throw new Error('owner?');
		if (typeof owner._read !== ts.FN) throw new TypeError('owner._read()?');
		super(opt);
		this.owner = owner;
		this.body = body ? Buffer.from(body) : null;
		this.ext = this.body ? true : false;
	}
	
	_read(size) 
	{
		if (this.body){
			this.push(this.body.slice(0, size));
			this.body = this.body.slice(size);//ts.error('push');
		}else if (this.ext){  
			this.push(null); //ts.error('end');
		}else ts.error(29,'???');
	}

}

module.exports = RStream;
