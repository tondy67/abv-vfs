/**
 * FS
 */
"use strict";

const ts = require('abv-ts')('abv:vfs.FS');
const pjson = require('./package.json');
const MFS = require('./lib/MFS.js');
const LSFS = require('./lib/LSFS.js');
const fs = ts.isBrowser ? new LSFS('nfs') : require('fs');
const TStream = require('./lib/TStream.js');
const RStream = require('./lib/RStream.js');
const WStream = require('./lib/WStream.js');
const mime = require('./mimetype.js');
const File = require('./File.js');
const { Wallet, Crypto, Pack, XmlParser, Zip } = require('abv-core');
const ips = ts.isBrowser ? [] : require('./lib/IPs.js');

const $root = new Map();

// namespace
let $ns = 'nfs';
const $max_file_size = 4194304; // 4 MB

class FS
{
	constructor()
	{
		this.mount(fs);
		this.fs = fs;
		this.name = 'afs';
		this._cache = {m: null, max: 0, timeout: 0};
	}

// namespace	
	get ns() { return $ns; }

	set ns(name) 
	{ 
		if (!$root.has(name)) throw new Error('fs? ' + name);
		$ns = name;
		this.fs = $root.get(name);
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

	cache(max=32, timeout=60000) // 32 MB, 60 sec.
	{
		if (!this._cache.m){
			this._cache.m = new Wallet(this.name, max, timeout);
			this._cache.max = max;
			this._cache.timeout = timeout;
		}
	}
	
	stat() 
	{ 
		return Wallet.i(this.name); 
	}
	
	unlinkSync(path)
	{
		fs.unlinkSync(path);
	}
	
	existsSync(path) 
	{ 
		return this.fs.existsSync(path); 
	}
	
	readFileSync(path, opt, timeout=0) 
	{ 
		let f = null;
		if (this._cache.m){
			f = this._cache.m.get(path);
			if (f) return f.file;
		}
		const stat = fs.lstatSync(path); 
		f = this.fs.readFileSync(path, opt);
		if (f && (stat.size < $max_file_size) && (timeout > 0)){
			this._cache.m.set(path, {file: f, size: stat.size}, timeout);
		}		
		return f; 
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

	rebuildAbv(path)
	{
		const files = [];
		let file;
		const d = this.readdirAbv(path);
		for (let f of d){
			file = this.readFileAbv(path +'/' + f);
			if (file !== null){
				if (!file.sort){
				}else if (Number.isInteger(file.sort)) files[file.sort] = file;
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
		try{ 
			const m = JSON.parse(require(path +'/meta.js')); 
			r = new File(m.name);
			r.desc = m.desc;
			r.tags = m.tags;
			r.logo = {name: m.logo};
	// FIXME: rest props
			r.price = m.price; 
			r.sort = m.sort; 
		}catch(e){}
		return r; 
	}
	
	IPs() { return ips; }
	
	get MAX_FILE_SIZE(){ return $max_file_size; } 

// Shortcuts
	Wallet(name, max=32, timeout=60000)
	{
		return new Wallet(name, max, timeout);
	}
	
	MFS(name='mfs')
	{
		return new MFS(name);
	}

	File(name='', body='')
	{
		return new File(name, body);
	}
	
	Crypto(curve='secp256k1')
	{
		return new Crypto(curve);
	}

	Pack(limit=2097152)
	{
		return new Pack(limit);
	}

	XmlParser()
	{
		return new XmlParser();
	}

	Zip()
	{
		return new Zip();
	}
	
}


module.exports = FS;
