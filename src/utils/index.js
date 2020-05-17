//const IPFS = require("ipfs");
var collection, aviondb, ipfs;
export const getAvionDBCollection = async (options, callback) => {
  switch (window.location.pathname) {
    case "/":
      if (!collection && !ipfs && !aviondb) {
        ipfs = await window.Ipfs.create({
          relay: { enabled: true, hop: { enabled: true, active: true } },
        });
        window.ipfs = ipfs;
        await ipfs.swarm.connect(
          "/dnsaddr/node1.dappkit.io/tcp/6969/wss/p2p/QmfLwmXF25u1n5pD8yXcbmZew3td66qPU1FroWNrkxS4bt"
          //"/ip4/3.16.114.163/tcp/4003/ws/p2p/QmfLwmXF25u1n5pD8yXcbmZew3td66qPU1FroWNrkxS4bt"
        );
        aviondb = await window.AvionDB.init("database-test-3", ipfs);
        collection = await aviondb.initCollection("collection-test-3");
        window.collection = collection;
        startPublish(ipfs, aviondb.id, collection.dbname);
        return { collection, aviondb, ipfs };
      } else {
        return { collection, aviondb, ipfs };
      }
    case "/sync":
      ipfs = await window.Ipfs.create({
        relay: { enabled: true, hop: { enabled: true, active: true } },
      });
      window.ipfs = ipfs;
      let id = await ipfs.id();
      await ipfs.swarm.connect(
        "/dnsaddr/node1.dappkit.io/tcp/6969/wss/p2p/QmfLwmXF25u1n5pD8yXcbmZew3td66qPU1FroWNrkxS4bt"
        //"/ip4/3.16.114.163/tcp/4003/ws/p2p/QmfLwmXF25u1n5pD8yXcbmZew3td66qPU1FroWNrkxS4bt"
      );
      syncDatabase(ipfs, options, callback);
  }
};

const syncDatabase = async (ipfs, options, callback) => {
  var multiAddr = options.multiAddr;
  var ipfsId = options.multiAddr.split("/").pop();

  await ipfs.pubsub.subscribe(ipfsId, async (msg) => {
    //console.log("MESSAGE RECIEVED");
    const info = JSON.parse(msg.data.toString());
    //console.log(info);
    aviondb = await window.AvionDB.open(info.dbAddr, ipfs);
    collection = await aviondb.initCollection(info.collectionName);
    window.collection = collection;
    callback({ collection, aviondb, ipfs });
  });
  setTimeout(async () => {
    //console.log("Connecting....");
    //console.log(ipfsId);
    let peer = await ipfs.swarm.connect(multiAddr);
    //console.log("CONNECTED");
    //console.log(peer);
  }, 1000);
};

const startPublish = (ipfs, dbAddr, collectionName) => {
  //console.log({
  //  dbAddr: dbAddr,
  //  collectionName: collectionName,
  //});
  setInterval(async () => {
    const id = await ipfs.id();
    await ipfs.pubsub.publish(
      id.id,
      Buffer.from(
        JSON.stringify({
          dbAddr: dbAddr,
          collectionName: collectionName,
        })
      )
    );
  }, 500);
  ipfs.libp2p.on("peer:connect", (ipfsPeer) => {
    //console.log("Connected: ", ipfsPeer.id._idB58String);
  });
};
