// const { logger, levels } = require("./logger");

var collection,
  aviondb,
  ipfs,
  eventsAdded = false;
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
        );
        aviondb = await window.AvionDB.init("database-test-108", ipfs);
        collection = await aviondb.initCollection("collection-test-108");
        if (!eventsAdded) {
          window.aviondb = aviondb;
          addEvents(aviondb);
          window.collection = collection;
          addEvents(collection);
          startPublish(ipfs, aviondb.id, collection.dbname);
          eventsAdded = true;
        }
        return { collection, aviondb, ipfs };
      } else {
        if (!eventsAdded) {
          window.aviondb = aviondb;
          console.log(aviondb);
          addEvents(aviondb);
          addEvents(collection);
          eventsAdded = true;
        }
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

const addEvents = (aviondb) => {
  /*
  Emitted after an entry was added locally to the database. hash is the IPFS hash
  of the latest state of the database. entry is the added database op.
  */
  aviondb.events.on("write", (address, entry, heads) => {
    console.log("EVENT: WRITE");
    console.log(address, entry, heads);
    /* logger.log({
      level: "info",
      message: `EVENT: WRITE
      ${(address, entry, heads)}\n
      `,
    }); */
  });
  /*
  Emitted before replicating a part of the database with a peer.
  */
  aviondb.events.on("replicate", (address) => {
    console.log("EVENT: REPLICATE");
    console.log(address);
    /* logger.log({
      level: "info",
      message: `EVENT: REPLICATE
      ${address}\n
      `,
    }); */
  });
  /*
  Emitted while replicating a database. address is id of the database that emitted
  the event. hash is the multihash of the entry that was just loaded. entry is the
  database operation entry. progress is the current progress. have is a map of database
  pieces we have.
  */
  aviondb.events.on(
    "replicate.progress",
    (address, hash, entry, progress, have) => {
      console.log("EVENT: REPLICATE:PROCESS");
      console.log(address, hash, entry, progress, have);
      /* logger.log({
        level: "info",
        message: `EVENT: REPLICATE:PROCESS
      ${(address, hash, entry, progress, have)}\n
      `,
      }); */
    }
  );
  /* Emitted when the database has synced with another peer. This is usually a good
    place to re-query the database for updated results, eg. if a value of a key was
    changed or if there are new events in an event log.
  */
  aviondb.events.on("replicated", (address) => {
    console.log("EVENT: REPLICATED");
    console.log(address);
    /* logger.log({
      level: "info",
      message: `EVENT: REPLICATED
      ${address}\n
      `,
    }); */
  });
  /*
  Emitted before loading the database.
  */
  aviondb.events.on("load", (dbname) => {
    console.log("EVENT: LOAD");
    console.log(dbname);
    /* logger.log({
      level: "info",
      message: `EVENT: LOAD
      ${dbname}\n
      `,
    }); */
  });
  /*
  Emitted while loading the local database, once for each entry. dbname is the name
  of the database that emitted the event. hash is the multihash of the entry that was
  just loaded. entry is the database operation entry. progress is a sequential number
  starting from 0 upon calling load().
  */
  aviondb.events.on(
    "load.progress",
    (address, hash, entry, progress, total) => {
      console.log("EVENT: LOAD:PROGRESS");
      console.log(address, hash, entry, progress, total);
      /* logger.log({
        level: "info",
        message: `EVENT: LOAD:PROGRESS
      ${(address, hash, entry, progress, total)}\n
      `,
      }); */
    }
  );
  /*
  Emitted when a new peer connects via ipfs pubsub. peer is a string containing the id
  of the new peer
  */
  aviondb.events.on("peer", (peer) => {
    console.log("EVENT: PEER");
    console.log(peer);
    /* logger.log({
      level: "info",
      message: `EVENT: PEER
      ${peer}\n
      `,
    }); */
  });
};
