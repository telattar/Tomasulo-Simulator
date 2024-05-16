function ALU(input1, input2, operation) {
    switch (operation) {
        case "ADD.D": {
            return input1 + input2;
        }
        case "SUB.D": {
            return input1 - input2;
        }
        case "MUL.D": {
            return input1 * input2;
        }
        case "DIV.D": {
            return input1 / input2;
        }
    }
}

module.exports = ALU;