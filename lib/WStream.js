/**
 * Write stream
 */
"use strict";

const ts = require('abv-ts')('abv:vfs.WStream');
const Writable = require('stream').Writable;

class WStream extends Writable
{
	constructor(owner, meta, opt)
	{
		if (!owner) throw new Error('owner?');
		if (typeof owner._write !== ts.FN) throw new TypeError('owner._write()?');
		super(opt);
		this.meta = meta ? meta : {}; 
		this.owner = owner;
		this.on('finish', () => {
			this.meta.end = true;
			this.owner._write(this.meta, null);
			});
	}
	
	_write(chunk, encoding, callback) 
	{
		this.meta.type = encoding; 
		this.owner._write(this.meta, chunk);
		callback();
	}

}

module.exports = WStream;
