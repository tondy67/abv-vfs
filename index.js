/**
 * https://github.com/tondy67/abv-vfs
 */
"use strict";

const ts = require('abv-ts')('abv:vfs');
const FS = require('./FS.js');

const fs = new FS();

if (ts.isBrowser){
	window.ts = ts;
	if (window.abv) window.abv.fs = fs;
	else window.abv = {fs: fs}
}

module.exports = fs;
