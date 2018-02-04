/**
 * Memory FS
 */
"use strict";

const ts = require('abv-ts')('abv:vfs.MFS');
const BFS = require('./BFS.js');
const Wallet = require('abv-wallet');
const File = require('../File.js');

class MFS extends BFS
{
	constructor(name) 
	{ 
		super(name);
		this.cache = new Wallet(name);
	}
	
	existsSync(path) 
	{ 
		return this.cache.has(path);
	}
	
	mkdirSync(path, mode) 
	{ 
		
	}
	
	readFileSync(path, opt) 
	{ 
		let r = null;
		const f = this.cache.get(path);
		if (f) r = new Uint8Array([...f.body]).buffer;
		return r;
	}
	
	writeFileSync(path, data, opt) 
	{ 
		const f = new File(path,data);
		return this.cache.set(path, f);
	}
	
	createReadStream(path, opt) 
	{ 
		return this.createRStream(this, path, opt);
	}

	createWriteStream(path, opt, meta) 
	{
		return this.createWStream(this, meta, opt);
	}

	_write(meta, chunk) 
	{
		let f;
		const name = meta.n;

		if (!this.cache.has(name)){
			f = new File(name, chunk); //ts.debug(f.size);
			this.cache.set(name, f);
			return;
		}

		f = this.cache.get(name);

		if(chunk){
			const total = f.body.byteLength + chunk.byteLength;
			f.body = Buffer.concat([f.body, chunk], total);
		}

	}
}

module.exports = MFS;
