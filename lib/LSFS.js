/**
 * Browser LocalStorage FS
 */
"use strict";

const ts = require('abv-ts')('abv:vfs.LSFS');
const BFS = require('./BFS.js');
const File = require('../File.js');
const Stats = require('./Stats.js');

class LSFS extends BFS
{
	constructor(name='lsfs') 
	{ 
		super(name);
		if (!window.localStorage) throw new Error('localStorage?');
		this.ls = window.localStorage;
	}
	
	unlinkSync(path)
	{
		this.ls.removeItem(path);
	}
	
	existsSync(path) 
	{ 
		return this.ls.getItem(path) !== null;
	}
	
	lstatSync(path)
	{
		return new Stats();
	}

	mkdirSync(path, mode) 
	{ 
		
	}
	
	readdirSync(path)
	{
		const a = [];
		Object.keys(this.ls).forEach((key,index) => {
			if (key.startsWith(path)) a.push(key.replace(path,''));
		});
		return a;
	}

	readFileSync(path, opt) 
	{ 
		let r = null;
		let s = this.ls.getItem(path);
		if (!s) return r;
		try{ r = JSON.parse(s); }catch(e){}
		if (!r) return r;
		
		if (r.t === 'str') return r.b;
		
		if (r.t === 'ab'){
			let a = null;
			try{ a = JSON.parse(r.b); }catch(e){}
			if (Array.isArray(a)) r = new Uint8Array(a).buffer;
		}
		
		return r;
	}
	
	writeFileSync(path, data, opt) 
	{ 
		const f = {t: '', b: null};
		if (ts.is(data, String)){
			f.b = data;
			f.t = 'str';
		}else{
			if (data instanceof Buffer){
				// because of browserify buffer
				data = data.buffer.slice(data.byteOffset, 
					data.byteOffset + data.byteLength);					
			}

			if (data instanceof ArrayBuffer){
				const a = Array.from(new Uint8Array(data));
				f.b = JSON.stringify(a);
				f.t = 'ab';
			}
		}
		
		if (f.b) this.ls.setItem(path, JSON.stringify(f));
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
*/
	}
}

module.exports = LSFS;
