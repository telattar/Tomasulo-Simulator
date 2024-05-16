class LoadBuffer {
    constructor(key, busy, address) {
        this.key = key;
        this.busy = busy;
        this.address = address;
    }
}
module.exports = LoadBuffer;