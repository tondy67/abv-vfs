/**
 * Test FS
 */
"use strict";

const log = console.log.bind(console);
const assert = require('assert');
const fs = require('../index.js');

const $psw = '32bytes-67VC61jmV54rIYu1545x4TlY';
const $iv = 'tondy';

const $body = "In the cicada's cry There's no sign that can foretell How soon it must die! Нищо в гласа на щуреца не показва кога ще умре!";
//const out = f.pack($psw,$iv);
//fs.writeFileSync(__dirname+'/out.abv',Buffer.from(out));
//f.unpack(out,$psw,$iv);
let $out;

describe('File', () => {
	describe('pack()', () => {
		it('to...', () => {
			const f = fs.File('test.txt', $body);
			$out = f.pack($psw,$iv);//
			assert.equal($out.byteLength, 440, 'return> true');
	  	});
	});

	describe('unpack()', () => {
		it('from...', () => {
			const f = fs.File();
			f.unpack($out,$psw,$iv);
			assert.equal(f.body, $body, 'return> true');
	  	});
	});


});
