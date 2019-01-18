'use strict'

const multihashing = require('multihashing-async')
const pify = require('pify')
const CID = require('cids')
const defaultHashAlg = 'sha2-256'

// 'use strict'

// const ImmutableDB = require('./immutabledb-interface')

const defaultFormat = { format: 'dag-cbor', hashAlg: 'sha2-256' }
//
// /* ImmutableDB using IPLD (through IPFS) */
// class IPLDStore {
//   constructor (ipfs) {
//     // super()
//     this._ipfs = ipfs
//   }
//
//   async put (value) {
//     const cid = await this._ipfs.dag.put(value, defaultFormat)
//     return cid.toBaseEncodedString()
//   }
//
//   async get (key) {
//     const result = await this._ipfs.dag.get(key)
//     return result.value
//   }
// }

const createMultihash = pify(multihashing)

// const LRU = require('lru')
// const ImmutableDB = require('./immutabledb-interface')
// const createMultihash = require('./create-multihash')

/* Memory store using an LRU cache */
class MemStore {
  constructor () {
    this._store = {}//new LRU(1000)
  }

  async put (value) {
    const data = Buffer.isBuffer(value) ? value : Buffer.from(JSON.stringify(value))
    const multihash = await createMultihash(data, 'sha2-256')
    const cid = new CID(1, 'dag-cbor', multihash)
    const hash = cid.toBaseEncodedString()
    console.log("HASH", hash)
    // this._store.set(hash, data)
    if (!this._store) this._store = {}
    // console.log(this._store)
    // console.log(hash, data)
    this._store[hash] = data
    // return hash
    return {
      toBaseEncodedString: () => hash
    }
  }

  async get (key) {
    // const data = this._store.get(key)
    const data = this._store[key]

    // if (data) {
    //   const value = JSON.parse(data)
    //   return value
    // }

    // return data
    // return {
    //   toJSON: () => {
    //     return {
    //       data: this._store[key],
    //       multihash: key,
    //     }
    //   }
    // }
    return {
      value: data
    }
  }
}


module.exports = MemStore
