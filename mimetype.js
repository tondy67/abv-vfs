/** 
 * Mimetypes
 */
'use strict';

const ts = require('abv-ts')('abv:vfs.mime');
const Path = require('path');

const $txt = ['htm','html','shtm','shtml','xhtml','css','js','svg','txt',
	'xml','json','xslt','xsl','hx'];
	
const mime = new Map();

mime.set('html','text/html');
mime.set('htm','text/html');
mime.set('xhtml','application/xhtml+xml');
mime.set('shtm','text/html');
mime.set('shtml','text/html');
mime.set('css','text/css');
mime.set('js','application/x-javascript');
mime.set('ico','image/x-icon');
mime.set('gif','image/gif');
mime.set('jpg','image/jpeg');
mime.set('jpeg','image/jpeg');
mime.set('png','image/png');
mime.set('bmp','image/bmp');
mime.set('svg','image/svg+xml');
mime.set('txt','text/plain');
mime.set('torrent','application/x-bittorrent');
mime.set('wav','audio/x-wav');
mime.set('mp3','audio/x-mp3');
mime.set('mid','audio/mid');
mime.set('m3u','audio/x-mpegurl');
mime.set('ogg','audio/ogg');
mime.set('ram','audio/x-pn-realaudio');
mime.set('xml','text/xml');
mime.set('json','text/json');
mime.set('xslt','application/xml');
mime.set('xsl','application/xml');
mime.set('ra','audio/x-pn-realaudio');
mime.set('doc','application/msword');
mime.set('exe','application/octet-stream');
mime.set('bin','application/octet-stream');
mime.set('zip','application/x-zip-compressed');
mime.set('7z','application/x-7z-compressed');
mime.set('xls','application/excel');
mime.set('tgz','application/x-tar-gz');
mime.set('tar','application/x-tar');
mime.set('gz','application/x-gunzip');
mime.set('arj','application/x-arj-compressed');
mime.set('rar','application/x-arj-compressed');
mime.set('rtf','application/rtf');
mime.set('pdf','application/pdf');
mime.set('swf','application/x-shockwave-flash');
mime.set('mpg','video/mpeg');
mime.set('webm','video/webm');
mime.set('mpeg','video/mpeg');
mime.set('mov','video/quicktime');
mime.set('mp4','video/mp4');
mime.set('m4v','video/x-m4v');
mime.set('asf','video/x-ms-asf');
mime.set('avi','video/x-msvideo');
mime.set('hx','text/plain');
mime.set('n','application/octet-stream');
mime.set('ttf','application/x-font-ttf');
mime.set('post-url','application/x-www-form-urlencoded');
mime.set('post-dat','multipart/form-data');
mime.set('post-mix','multipart/mixed');

const mimetype = (path, body='') => {
	let r = '';
	const ext = Path.extname(path).substr(1).toLowerCase();
	if (mime.has(ext)) r = mime.get(ext);	

	if (!body || (body === '')) return r;
	
	const buf = Buffer.from(body);
	let bin;
	try{
		bin = Buffer.from(v).includes('000','hex');
	}catch(e){
		bin = [...buf].toString().includes('0,0,0,');
	}

	if (r !== ''){
		if ($txt.includes(ext)){
			if (bin) r = mime.get('bin');
		}else{
			if (!bin) r = mime.get('txt');
		}
	}else if (bin){
		r = mime.get('bin');
	}else{
		if (body && body.includes('</html>','utf8')) r = mime.get('htm');
		else r = mime.get('txt');
	}
	if (!bin) r += '; charset=utf-8';
	return r;
};

module.exports = mimetype;
