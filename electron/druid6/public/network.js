const network = (event,hostInfo,privateKeyPath) => {
    const Client = require('electron-ssh2').Client;
    const conn = new Client();
    let today= new Date();
    let year = today.getFullYear();
    let month = today.getMonth()+1;
    if(month<10)month='0'+month;
    conn.on('ready', () => {
      setTimeout(function (){
        conn.exec(`vnstat -d | grep ${year}-${month} | awk '{print $1,$2,$3,$5,$6}'`
        , (err, stream) => {
          if (err) throw err;
          stream.on('close', (code, signal) => {
          }).on('data', (data) => {
            event.reply('networkDays',data.toString());
          }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
          });
        });
      },0)
    
      setTimeout(function (){
        conn.exec(`vnstat -l -i eth0`
        , (err, stream) => {
          if (err) throw err;
          stream.on('close', (code, signal) => {
          }).on('data', (data) => {           
            event.reply('networkRealTime',data.toString());
          }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
          });
        });
      },0)
      
    }).connect({
    host: hostInfo.hostname,
    port: 22,
    username: hostInfo.username,
    privateKey: require('fs').readFileSync(privateKeyPath)
  });
}

module.exports = network;
