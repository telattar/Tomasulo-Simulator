class Reservation {
    constructor(op, Vj, Vk, Qj, Qk, busy) {
        this.op = op;
        this.Vj = Vj;
        this.Vk = Vk;
        this.Qj = Qj;
        this.Qk = Qk;
        this.busy = busy;
    }
}
module.exports = Reservation;