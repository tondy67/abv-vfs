/**
 * Write stream
 */
"use strict";

const ts = require('abv-ts')('abv:vfs.TStream');
const Transform = require('stream').Transform;

class TStream extends Transform
{
	constructor(owner, meta, opt)
	{
		if (!owner) throw new Error('owner?');
		if (typeof owner._write !== ts.FN) throw new TypeError('owner._write()?');
		super(opt);
		this.meta = meta ? meta : {}; 
		this.owner = owner;
	}
	
	_transform(chunk, encoding, callback) 
	{
		this.owner._write(this.meta, chunk);
		callback();
	}

	_flush(callback) 
	{
		this.meta.end = true;
		this.owner._write(this.meta, null);
		callback();		
	}

}

module.exports = TStream;
