//

class Stats 
{
	constructor()
	{
  	this.dev = 65024;
  	this.mode = 33152;
  	this.nlink = 1;
  	this.uid = 10078;
  	this.gid = 10078;
  	this.rdev = 0;
  	this.blksize = 4096;
  	this.ino = 439515;
  	this.size = 0;
  	this.blocks = 8;
  	this.atimeMs = 1516742518740.2861;
  	this.mtimeMs = 1516742518740.2861;
  	this.ctimeMs = 1516742518740.2861;
  	this.birthtimeMs = 1516742518740.2861;
  	this.atime = '2018-01-23T21:21:58.740Z';
  	this.mtime = '2018-01-23T21:21:58.740Z';
  	this.ctime = '2018-01-23T21:21:58.740Z';
  	this.birthtime = '2018-01-23T21:21:58.740Z'; 
  	
  }

	isBlockDevice() { return false; }
	
	isCharacterDevice() { return false; }
	
 	isDirectory() { return false; }
	
	isFIFO() { return false; }
	
	isFile() { return true; }
	
	isSocket() { return false; }
	
	isSymbolicLink() { return false; } 
}

modules.exports = Stats;