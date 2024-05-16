class StoreBuffer {
    constructor(key, busy, address, V, Q) {
        this.key = key;
        this.busy = busy;
        this.address = address;
        this.V = V;
        this.Q = Q;
    }
}
module.exports = StoreBuffer;