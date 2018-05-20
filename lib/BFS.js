/**
 * Base FS
 */
"use strict";

const ts = require('abv-ts')('abv:vfs.BFS');
const TStream = require('./TStream.js');
const RStream = require('./RStream.js');
const WStream = require('./WStream.js');

const $throw = (s) => { throw new Error('Override me! "' + s + '"');};

class BFS
{
	constructor(name) 
	{ 
		if (!name) throw new Error(ts.UK);
		this.name = name; 
	}
	
	unlinkSync(path)
	{
		$throw(path);
	}
	
	existsSync(path) 
	{ 
		return $throw(path);
	}
	
	realpathSync(path)
	{
		return $throw(path);
	}
	
	lstatSync(path)
	{
		return $throw(path);
	}
	
	mkdirSync(path, mode) 
	{ 
		return $throw(path);
	}
	
	readdirSync(path)
	{
		return $throw(path);
	}
	
	readFileSync(path, opt) 
	{ 
		return $throw(path);
	}
	
	writeFileSync(path, data, opt) 
	{ 
		return $throw(path);
	}
	
	createReadStream(path, opt) 
	{ 
		return $throw(path);
	}

	createWriteStream(path, opt) 
	{ 
		return $throw(path);
	}
///
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

}


module.exports = BFS;
