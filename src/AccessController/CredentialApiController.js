"use strict";

const EventEmitter = require("events").EventEmitter;
const io = require("orbit-db-io");
/**
 * A Firebase based AccessController for AvionDB & OrbitDB
 *
 * A demo app using CredentialApiController
 * https://github.com/dappkit/aviondb-credential-management-api
 *
 */
class CredentialApiController extends EventEmitter {
  constructor(ipfs, options) {
    super();
    this._ipfs = ipfs;
  }

  /*
    Every AC needs to have a 'Factory' method
    that creates an instance of the AccessController
  */
  static async create(orbitdb, options) {
    return new FirebaseAccessController(orbitdb._ipfs, options);
  }

  /* Return the type for this controller */
  static get type() {
    return "credentials-api-controller";
  }

  /*
    Return the type for this controller
  */
  get type() {
    return this.constructor.type;
  }

  /*
    Called by the databases (the log) to see if entry should
    be allowed in the database. Return true if the entry is allowed,
    false is not allowed
  */
  async canAppend(entry, identityProvider) {
    return new Promise((resolve, reject) => {
      this.firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          // A user is signed in
          const verifiedIdentity = await identityProvider.verifyIdentity(
            entry.identity
          );
          // Allow access if identity verifies
          return resolve(verifiedIdentity);
        } else {
          // No user is signed in
          return resolve(false);
        }
      });
    });
  }

  /* Add access */
  async grant(user) {
    await this.firebase.auth().createUser(user);
  }
  /* Remove access */
  async revoke() {
    await this.firebase.auth().currentUser.delete();
  }

  /* AC creation and loading */
  async load(address) {
    if (address) {
      try {
        if (address.indexOf("/ipfs") === 0) {
          address = address.split("/")[2];
        }
        const access = await io.read(this._ipfs, address);
        this.firebaseConfig = access.firebaseConfig;
      } catch (e) {
        console.log("FirebaseAccessController.load ERROR:", e);
      }
    }
  }
  /* Returns AC manifest parameters object */
  async save() {
    let cid;
    try {
      cid = await io.write(this._ipfs, "dag-cbor", {
        firebaseConfig: this.firebaseConfig,
      });
    } catch (e) {
      console.log("FirebaseAccessController.save ERROR:", e);
    }
    // return the manifest data
    return { address: cid };
  }
}

export default CredentialApiController;
