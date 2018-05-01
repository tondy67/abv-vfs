//
"use strict";

const ts = require('abv-ts')('abv:vfs.File');
const pjson = require('./package.json');
const mimetype = require('./mimetype.js');
const { Crypto, Pack, Zip } = require('abv-core');
const $crypto = new Crypto();
const $pack = new Pack(16777216); // 16 MB limit

class File
{
	constructor(name='', body='', zip=false)
	{
		this._name = String(name);
		this.desc = '';
		this.logo = null;
		this.tags = [];
		this.words = [];
		this._size = 0;
		this._type = '';
		this._time = ts.now;
		this.bin = false;
		this.body = body;
		this.$ = null; // custom props
		this.zip = zip;
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
		if (Number.isInteger(v) && (v >= 0)) this._size = v; 
	}

	get time() { return this._time; }		

	set time(v) 
	{ 
		if (Number.isInteger(v) && (v >= 0)) this._time = v; 
	}

	get type() { return this._type; }

	slice(start, end, contentType) 
	{
		return this._body;
	}

	pack(psw, iv)
	{// TODO: big file
		const r = {
			v: pjson.version,
			n: this.name,
			d: this.desc,
			t: this.tags,
			w: this.words,
			s: this.size,
			m: this.type,
			h: this.time,
			x: this.bin,
			b: this.body
		};

		if (this.logo && this.logo.name && this.logo.body){
			r.f = [this.logo.name];
			r.f0 = this.logo.body;
		}
		
		if (this.zip){
			// TODO: zip body
		}
		
		if (psw && iv){
			const enc = $crypto.encrypt(r.b, psw, iv);
			r.b = enc.enc;
			r.a = enc.tag;
		}
	
		return $pack.encode(r);
	}
	
	unpack(buf, psw, iv)
	{
		const r = $pack.decode(buf);
		if (!r) throw new Error('Invalid AbvFile');
		if (r.a && psw && iv){
			r.b = $crypto.decrypt({enc:r.b,tag:r.a}, psw, iv);
			if (!r.x) r.b = r.b.toString();
			delete(r.a);
		}
		
		if (r.n) this._name = r.n;
		if (r.d) this.desc = r.d;
		if (r.t) this.tags = r.t;
		if (r.w) this.words = r.w;
		if (r.h) this.time = r.h;
		if (r.b) this.body = r.b;
		if (r.f && r.f[0] && r.f0){
			this.logo = {name: r.f[0], body: r.f0};
		}
		return this;
	}
	
	get webkitRelativePath() { return ''; }

	get lastModified() { return this.time; }

	get lastModifiedDate() { return new Date(this.time).toUTCString(); }  

}

module.exports = File;
