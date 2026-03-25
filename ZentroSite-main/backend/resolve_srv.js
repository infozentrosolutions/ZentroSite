const dns = require('dns');
const fs = require('fs');

dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_mongodb._tcp.cluster0.7cmeihs.mongodb.net', (err, addresses) => {
    if (err) { console.error('SRV Error', err); return; }

    dns.resolveTxt('cluster0.7cmeihs.mongodb.net', (err2, txt) => {
        if (err2) { console.error('TXT Error', err2); return; }

        // Sort addresses by priority/weight, or just by name to match standard format
        addresses.sort((a, b) => a.name.localeCompare(b.name));

        const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
        const options = txt.join('').replace('authSource=admin', 'authSource=admin&retryWrites=true&w=majority&appName=Cluster0');
        // the txt usually gives 'authSource=admin&replicaSet=...'

        const uri = `mongodb://admin:Mukesh356@${hosts}/test?${options}`;
        fs.writeFileSync('resolved_uri.txt', uri);
        console.log("URI written to resolved_uri.txt");
    });
});
