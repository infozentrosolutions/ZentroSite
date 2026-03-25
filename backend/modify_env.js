const fs = require('fs');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_mongodb._tcp.cluster0.7cmeihs.mongodb.net', (err, addresses) => {
    if (err) { console.error('SRV Error', err); return; }

    dns.resolveTxt('cluster0.7cmeihs.mongodb.net', (err2, txt) => {
        if (err2) { console.error('TXT Error', err2); return; }

        addresses.sort((a, b) => a.name.localeCompare(b.name));
        const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
        const options = txt.join('').replace('authSource=admin', 'authSource=admin&retryWrites=true&w=majority&appName=Cluster0');

        const uri = `mongodb://admin:Mukesh356@${hosts}/test?${options}`;

        let envContent = fs.readFileSync('.env', 'utf-8');
        envContent = envContent.replace(/MONGO_URI=.*/, `MONGO_URI=${uri}`);
        fs.writeFileSync('.env', envContent);
        console.log("Updated .env with direct Atlas connection string.");
        console.log("URI: " + uri);
    });
});
