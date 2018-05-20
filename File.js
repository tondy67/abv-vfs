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
	constructor(name='', body=null, type=null, zip=false)
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
		this.aes = null;
		this.sign = null;
		this.__type__ = type;
	}

	get name() { return this._name; }

	get body(){ return this._body; }
	
	set body(v)
	{
		if (!(ts.is(v,Buffer) || ts.is(v,String) || ts.is(v,ArrayBuffer))){
			ts.error(38,'type?');
			this._body = null;
			return;
		}
		
		this._type = mimetype(this._name, v);
		this.bin = this._type.includes('charset=utf-8') ? false : true;

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

	get type() { return this.__type__ || this._type; }

	set type(v) { this.__type__ = v; }

	clone()
	{
		const f = new File();
		Object.keys(this).forEach((key,index) => { 
			f[key] = this[key]; 
		});
		return f;
	}
	
	slice(start, end, contentType) 
	{
		return this._body;
	}

    msg(cmd, to, src='', dst='')
    {
		if (!ts.is(to,String)) to = '';
		this.c = cmd;
		this.f = null; // from
		this.t = to;
		this.s = src;
		this.d = dst;
		this.m = null; // queue
		this.e = null; // error
	}

	encrypt(psw, iv)
	{
		if (!psw || !iv) return ts.error(105,'psw?');
		const enc = $crypto.encrypt(this.body, psw, iv);
		this.body = enc.enc;
		this.aes = enc.tag;
	}
	
	decrypt(psw, iv)
	{
		if (!this.aes) return;
		if (!psw || !iv) return ts.error(114,'psw?');
		this.body = $crypto.decrypt({enc:this.body,tag:this.aes}, psw, iv);
		if (!this.bin) this.body = this.body.toString();
	}
	
	sign(skey)
	{
		this.sign = $crypto.sign(skey, this.body);
	}
	
	verify(pkey)
	{
		return $crypto.verify(pkey, this.body, this.sign);
	}

	pack()
	{// TODO: big file
		const r = {
			v: pjson.version,
			n: this.name,
			j: this.desc,
			g: this.tags,
			w: this.words,
			h: this.time,
			x: this.bin,
			b: this.body,
			z: this.zip,
			a: this.aes,
			y: this.sign
		};

		if (this.c) r.c = this.c;
		if (this.f) r.f = this.f;
		if (this.t) r.t = this.t;
		if (this.s) r.s = this.s;
		if (this.d) r.d = this.d;
		if (this.m) r.m = this.m;
		if (this.e) r.e = this.e;

		if (this.logo && this.logo.name && this.logo.body){
			r.i = [this.logo.name];
			r.i0 = this.logo.body;
		}
		
		if (this.zip){
			// TODO: zip body
		}

		return $pack.encode(r);
	}
	
	unpack(buf)
	{
		const r = $pack.decode(buf);
		if (!r) throw new Error('Invalid AbvFile');

		if (r.y) this.sign = r.y;
		if (r.a) this.aes = r.a;
		if (r.n) this._name = r.n;
		if (r.j) this.desc = r.j;
		if (r.g) this.tags = r.g;
		if (r.w) this.words = r.w;
		if (r.h) this.time = r.h;
		if (r.b) this.body = r.b;
		if (r.i && r.i[0] && r.i0){
			this.logo = {name: r.i[0], body: r.i0};
		}
		if (r.c) this.c = r.c;
		if (r.f) this.f = r.f;
		if (r.t) this.t = r.t;
		if (r.s) this.s = r.s;
		if (r.d) this.d = r.d;
		if (r.m) this.m = r.m;
		if (r.e) this.e = r.e;
		return this;
	}

	get webkitRelativePath() { return ''; }

	get lastModified() { return this.time; }

	get lastModifiedDate() { return new Date(this.time).toUTCString(); }  

}

module.exports = File;
