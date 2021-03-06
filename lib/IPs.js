/*
 * Local IPs
 */

const os = require('os');

const ips = () => {
		const ifaces = os.networkInterfaces();
		const r = new Set();
		Object.keys(ifaces).forEach((ifname) => {
			let alias = 0;

			ifaces[ifname].forEach((iface) => {
				if ('IPv4' !== iface.family || iface.internal !== false) return;
				r.add(iface.address);
				++alias;
			});
		});
		
		return r.size > 0 ? Array.from(r) : ['localhost'];
	};
	
module.exports = ips();

