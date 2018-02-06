//
"use strict";

const ts = require('abv-ts')('abv:vfs.File');
const mimetype = require('./mimetype.js');

class File
{
	constructor(name='', body='')
	{
		this._name = name;
		this._size = 0;
		this._type = '';
		this._time = ts.now;
		this.bin = false;
		this.body = body;
	}

	get name() { return this._name; }

	get body(){ return this._body; }
	
	set body(v)
	{
		if (!(ts.is(v,Buffer) || ts.is(v,String) || ts.is(v,ArrayBuffer))){
			ts.error(26,'type?');
			this._body = '';
			return;
		}
		
		const buf = Buffer.from(v);

		try{
			this.bin = Buffer.from(v).includes('000','hex');
		}catch(e){
			this.bin = [...buf].toString().includes('0,0,0,');
		}
		if (ts.isBrowser){
			this._type = mimetype(this._name); 
		}else{
			this._type = mimetype(this._name, v);
		}
		this._body = this.bin ? v : v.toString();
		this._size = Buffer.byteLength(this._body);
	}

	get size() { return this._size; }		

	set size(v) 
	{ 
		if (v >= 0) this._size = v; 
	}

	get time() { return this._time; }		

	set time(v) 
	{ 
		if (v >= 0) this._time = v; 
	}

	get type() { return this._type; }

	slice(start, end, contentType) 
	{
		return this._body;
	}

	get webkitRelativePath() { return ''; }

	get lastModified() { return this.time; }

	get lastModifiedDate() { return new Date(this.time).toUTCString(); }  

}

module.exports = File;
