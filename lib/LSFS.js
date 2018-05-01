/**
 * Browser LocalStorage FS
 */
"use strict";

const ts = require('abv-ts')('abv:vfs.LSFS');
const BFS = require('./BFS.js');
const File = require('../File.js');

class LSFS extends BFS
{
	constructor(name='lsfs') 
	{ 
		super(name);
		if (!window.localStorage) throw new Error('localStorage?');
		this.ls = window.localStorage;
	}
	
	existsSync(path) 
	{ 
		return this.ls.getItem(path) !== null;
	}
	
	mkdirSync(path, mode) 
	{ 
		
	}
	
	readFileSync(path, opt) 
	{ 
		let r = null;
		return r;
	}
	
	writeFileSync(path, data, opt) 
	{ 
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
/*		let f;
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

	}*/
}

module.exports = LSFS;
