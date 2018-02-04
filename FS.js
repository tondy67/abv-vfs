/**
 * FS
 */
"use strict";

const ts = require('abv-ts')('abv:vfs.FS');
const MFS = require('./lib/MFS.js');
const fs = ts.isBrowser ? new MFS('nfs') : require('fs');
const TStream = require('./lib/TStream.js');
const RStream = require('./lib/RStream.js');
const WStream = require('./lib/WStream.js');
const mime = require('./mimetype.js');
const File = require('./File.js');
const ips = ts.isBrowser ? [] : require('./lib/IPs.js');

const $root = new Map();

// namespace
let $ns = 'nfs';

class FS
{
	constructor() 
	{
		this.mount(fs);
		this.fs = fs;
	}

// namespace	
	get ns() { return $ns; }

	set ns(n) 
	{ 
		let r = false;
		if ($root.has(n)){
			$ns = n;
			this.fs = $root.get(n);
			r = true;
		}
		return r; 
	}
	
	mimetype(path, body)
	{
		return mime(path, body); 
	}
	
	mount(fs)
	{
		if (!fs) return;
		const name = fs.name ? fs.name : $ns;
		$root.set(name, fs);
	}
	
	umount(name)
	{
		if (!name) return;
		$root.delete(name);
	}
	
	existsSync(path) 
	{ 
		return this.fs.existsSync(path); 
	}
	
	realpathSync(path)
	{
		return this.fs.realpathSync(path);
	}
	
	lstatSync(path)
	{
		return this.fs.lstatSync(path);
	}
	
	mkdirSync(path, mode) 
	{ 
		this.fs.mkdirSync(path, mode); 
	}
	
	readdirSync(path)
	{
		return this.fs.readdirSync(path);
	}
	
	readFileSync(path, opt) 
	{ 
		return this.fs.readFileSync(path, opt); 
	}
	
	writeFileSync(path, data, opt) 
	{ 
		this.fs.writeFileSync(path, data, opt); 
	}
	
	createReadStream(path, opt) 
	{ 
		return this.fs.createReadStream(path, opt);
	}

	createWriteStream(path, opt, meta) 
	{ 
		return this.fs.createWriteStream(path, opt, meta); 
	}

	createTStream(owner, meta, opt)
	{ 
		return new TStream(owner, meta, opt);
	}

	createWStream(owner, meta, opt)
	{ 
		return new WStream(owner, meta, opt);
	}

	createRStream(owner, body, opt)
	{ 
		return new RStream(owner, body, opt);
	}

	IPs() { return ips; }
	
}


module.exports = FS;
