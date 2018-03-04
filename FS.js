/**
 * FS
 */
"use strict";

const ts = require('abv-ts')('abv:vfs.FS');
const pjson = require('./package.json');
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
		this.name = 'afs';
	}

// namespace	
	get ns() { return $ns; }

	set ns(name) 
	{ 
		let r = false;
		if ($root.has(name)){
			$ns = name;
			this.fs = $root.get(name);
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

	rebuildAbv(path)
	{
		const files = [];
		let file;
		const d = this.readdirAbv(path);
		for (let f of d){
			file = this.readFileAbv(path +'/' + f);
			if (file !== null){
				if (Number.isInteger(file.id)) files[file.id] = file;
				else files.push(file);
			}
		}
		const afs = {name: this.name, version: pjson.version, files: files};
		const s = 'const meta = `\n' + JSON.stringify(afs,null,2) + '\n`;';
		this.writeFileSync(path + '/' + this.name + '.js', s, 'utf8');
		return afs;
	}
	
	readdirAbv(path)
	{
		const d = this.fs.readdirSync(path);
		const r = [];
		let stat;
		for (let f of d){
			stat = fs.lstatSync(path + '/' + f); 
			if (stat.isDirectory()) r.push(f);
		}
		return r;
	}
	
	readFileAbv(path) 
	{ 
		let r = null;
		try{ r = JSON.parse(require(path +'/meta.js')); }catch(e){}
		return r; 
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
