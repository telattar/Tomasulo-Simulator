class TableRow {
    constructor(iteration, instruction, destinationReg, j, k, issue, execComplete, writeResult) {
        this.iteration = iteration;
        this.instruction = instruction;
        this.destinationReg = destinationReg;
        this.j = j;
        this.k = k;
        this.issue = issue;
        this.execComplete = execComplete;
        this.writeResult = writeResult;
    }
}
module.exports = TableRow;