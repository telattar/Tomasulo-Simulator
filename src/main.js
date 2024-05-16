const ALU = require('./classes/ALU');


var LatencyAdd=0;
var LatencySub=0;
var LatencyMul=0;
var LatencyDiv=0;
var LatencyLoad=0;
var LatencyStore=0;

const final = [];

var LoadBuffer1 = [];
var ALUresult = [];
var StoreBuffer1 = [];
var Table = [];
var Registers = [];
var AddReservationS = [];
var MulReservationS = [];
var Memory = [];
var stalledBy = -1;
var cycle = 0;

for (var i = 0; i < 100; i++)
    Memory.push(1);

for (var i = 1; i <= 32; i++) {
    var key = "F" + i;
    let reg = {
        key,
        Qi: 0,
        value: 2
    };
    Registers.push(reg);
}
for (var i = 0; i < 3; i++) {
    AddReservationS.push({
        key: 'A' + (i + 1),
        op: null,
        Vj: null,
        Vk: null,
        Qj: null,
        Qk: null,
        busy: 0
    })
    MulReservationS.push({
        key: 'M' + (i + 1),
        op: null,
        Vj: null,
        Vk: null,
        Qj: null,
        Qk: null,
        busy: 0
    })
    LoadBuffer1.push({
        key: 'L' + (i + 1),
        busy: 0,
        address: null
    })
    StoreBuffer1.push({
        key: 'S' + (i + 1),
        busy: 0,
        address: null,
        Q: null,
        V: null
    })
}

for (var i = 1; i <= 3; i++)
    ALUresult.push({
        tag: 'A' + i,
        result: 0,
        cycle: 0
    })

for (var i = 1; i <= 3; i++)
    ALUresult.push({
        tag: 'M' + i,
        result: 0,
        cycle: 0
    })

for (var i = 1; i <= 3; i++)
    ALUresult.push({
        tag: 'S' + i,
        result: 0,
        cycle: 0
    })

for (var i = 1; i <= 3; i++)
    ALUresult.push({
        tag: 'L' + i,
        result: 0,
        cycle: 0
    })



function main(input, LA, LS, LM, LD, LL, LST) {
    LatencyAdd = LA-1;
    LatencySub = LS-1;
    LatencyMul = LM -1;
    LatencyDiv = LD-1;
    LatencyLoad = LL -1;
    LatencyStore = LST -1;

    //each line has an instruction
    const instructions = input.split('\r\n');

    var i = 0;
    var writebacks1 = 0;
    while (writebacks1 < instructions.length) {
        let incremented = false;
        let op;
        let regs;
        let dest, reg1, reg2;
        console.log(stalledBy)
        if (stalledBy != -1) {
            console.log("stalled")
            cycle++;
            incremented = true;
        }
        else if (i < instructions.length) {
            cycle++;
            incremented = true;
            const splitted = instructions[i].split(' ');
            op = splitted[0];
            regs = splitted[1];

            const regsSplit = regs.split(',');

            if (regsSplit.length === 2) {
                //load or store operation
                dest = regsSplit[1];
                //dest has address
                reg1 = regsSplit[0];
            }

            else if (regsSplit.length === 3) {
                //alu op
                dest = regsSplit[0];
                reg1 = regsSplit[1];
                reg2 = regsSplit[2];
            }

            //ISSUING
            switch (op) {
                case "ADD.D":
                    var stalled = AddReservationS[0].busy === 1 && AddReservationS[1].busy === 1 && AddReservationS[2].busy === 1;
                    if (stalled) {
                        stalledBy = 1;
                        i--;
                    }
                    else {
                        const register1 = Registers.filter(r => r.key === reg1)[0];
                        const register2 = Registers.filter(r => r.key === reg2)[0];
                        const destination = Registers.filter(r => r.key === dest)[0];

                        var x;
                        for (x = 0; x < AddReservationS.length; x++) {
                            if (AddReservationS[x].busy === 0) {
                                AddReservationS[x] = {
                                    key: AddReservationS[x].key,
                                    op,
                                    Vj: register1.Qi === 0 ? register1.value : null,
                                    Vk: register2.Qi === 0 ? register2.value : null,
                                    Qj: register1.Qi !== 0 ? register1.Qi : null,
                                    Qk: register2.Qi !== 0 ? register2.Qi : null,
                                    busy: 1
                                };
                                break;
                            }
                        }

                        Registers.map((reg) => {
                            if (reg.key === destination.key) {
                                reg.Qi = 'A' + (x + 1);
                            }
                        })



                        if (AddReservationS[x].Vj !== null && AddReservationS[x].Vk !== null) {
                            Table.push({
                                tag: AddReservationS[x].key,
                                instruction: op,
                                dest,
                                reg1,
                                reg2,
                                issue: cycle,
                                execution: (cycle + 1) + '...' + (cycle + 1 + LatencyAdd),
                                writeback: (cycle + 1 + LatencyAdd + 1)
                            })

                            //should start executing in cycle+1

                        }
                        else {
                            Table.push({
                                tag: AddReservationS[x].key,
                                instruction: op,
                                dest,
                                reg1,
                                reg2,
                                issue: cycle,
                                execution: null,
                                writeback: null
                            })


                        }


                    }
                    break;


                case "S.D":
                    var stalled = StoreBuffer1[0].busy === 1 && StoreBuffer1[1].busy === 1 && StoreBuffer1[2].busy === 1;
                    if (stalled) {
                        stalledBy = 3;
                        i--;
                    }
                    else {
                        const register1 = Registers.filter(r => r.key === reg1)[0];

                        var x;
                        for (x = 0; x < StoreBuffer1.length; x++) {
                            if (StoreBuffer1[x].busy === 0) {
                                StoreBuffer1[x] = {
                                    key: StoreBuffer1[x].key,
                                    busy: 1,
                                    address: dest,
                                    Q: register1.Qi !== 0 ? register1.Qi : null,
                                    V: register1.Qi === 0 ? register1.value : null
                                };
                                break;
                            }
                        }

                        if (StoreBuffer1[x].V !== null) {
                            Table.push({
                                tag: StoreBuffer1[x].key,
                                instruction: op,
                                dest,
                                reg1,
                                reg2: null,
                                issue: cycle,
                                execution: (cycle + 1) + '...' + (cycle + 1 + LatencyStore),
                                writeback: (cycle + 1 + LatencyStore + 1)
                            })
                        }
                        else {
                            Table.push({
                                tag: StoreBuffer1[x].key,
                                instruction: op,
                                dest,
                                reg1,
                                reg2: null,
                                issue: cycle,
                                execution: null,
                                writeback: null
                            })


                        }
                    }
                    break;

                case "L.D":
                    var stalled = LoadBuffer1[0].busy === 1 && LoadBuffer1[1].busy === 1 && LoadBuffer1[2].busy === 1;
                    if (stalled) {
                        stalledBy = 4;
                        i--;
                    }
                    else {
                        const register1 = Registers.filter(r => r.key === reg1)[0];

                        var x;
                        for (x = 0; x < LoadBuffer1.length; x++) {
                            if (LoadBuffer1[x].busy === 0) {
                                LoadBuffer1[x] = {
                                    key: LoadBuffer1[x].key,
                                    address: dest,
                                    busy: 1
                                };
                                break;
                            }
                        }

                        Registers.map((reg) => {
                            if (reg.key === register1.key) {
                                reg.Qi = 'L' + (x + 1);
                            }
                        })



                        Table.push({
                            tag: LoadBuffer1[x].key,
                            instruction: op,
                            dest,
                            reg1,
                            reg2:null,
                            issue: cycle,
                            execution: (cycle + 1) + '...' + (cycle + 1 + LatencyLoad),
                            writeback: (cycle + 1 + LatencyLoad + 1)
                        })

                        //should start executing in cycle+1

                    }
                    break;

                case "SUB.D":
                        var stalled = AddReservationS[0].busy === 1 && AddReservationS[1].busy === 1 && AddReservationS[2].busy === 1;
                        if (stalled) {
                            stalledBy = 1;
                            i--;
                        }
                        else {
                            const register1 = Registers.filter(r => r.key === reg1)[0];
                            const register2 = Registers.filter(r => r.key === reg2)[0];
                            const destination = Registers.filter(r => r.key === dest)[0];
    
                            var x;
                            for (x = 0; x < AddReservationS.length; x++) {
                                if (AddReservationS[x].busy === 0) {
                                    AddReservationS[x] = {
                                        key: AddReservationS[x].key,
                                        op,
                                        Vj: register1.Qi === 0 ? register1.value : null,
                                        Vk: register2.Qi === 0 ? register2.value : null,
                                        Qj: register1.Qi !== 0 ? register1.Qi : null,
                                        Qk: register2.Qi !== 0 ? register2.Qi : null,
                                        busy: 1
                                    };
                                    break;
                                }
                            }
    
                            Registers.map((reg) => {
                                if (reg.key === destination.key) {
                                    reg.Qi = 'A' + (x + 1);
                                }
                            })
    
    
    
                            if (AddReservationS[x].Vj !== null && AddReservationS[x].Vk !== null) {
                                Table.push({
                                    tag: AddReservationS[x].key,
                                    instruction: op,
                                    dest,
                                    reg1,
                                    reg2,
                                    issue: cycle,
                                    execution: (cycle + 1) + '...' + (cycle + 1 + LatencyAdd),
                                    writeback: (cycle + 1 + LatencyAdd + 1)
                                })
    
                                //should start executing in cycle+1
    
                            }
                            else {
                                Table.push({
                                    tag: AddReservationS[x].key,
                                    instruction: op,
                                    dest,
                                    reg1,
                                    reg2,
                                    issue: cycle,
                                    execution: null,
                                    writeback: null
                                })
    
    
                            }
    
    
                        }
                        break;
            
                case "MUL.D":
                            var stalled = MulReservationS[0].busy === 1 && MulReservationS[1].busy === 1 && MulReservationS[2].busy === 1;
                            if (stalled) {
                                stalledBy = 2;
                                i--;
                            }
                            else {
                                const register1 = Registers.filter(r => r.key === reg1)[0];
                                const register2 = Registers.filter(r => r.key === reg2)[0];
                                const destination = Registers.filter(r => r.key === dest)[0];
        
                                var x;
                                for (x = 0; x < MulReservationS.length; x++) {
                                    if (MulReservationS[x].busy === 0) {
                                        MulReservationS[x] = {
                                            key: MulReservationS[x].key,
                                            op,
                                            Vj: register1.Qi === 0 ? register1.value : null,
                                            Vk: register2.Qi === 0 ? register2.value : null,
                                            Qj: register1.Qi !== 0 ? register1.Qi : null,
                                            Qk: register2.Qi !== 0 ? register2.Qi : null,
                                            busy: 1
                                        };
                                        break;
                                    }
                                }
        
                                Registers.map((reg) => {
                                    if (reg.key === destination.key) {
                                        reg.Qi = 'M' + (x + 1);
                                    }
                                })
        
        
        
                                if (MulReservationS[x].Vj !== null && MulReservationS[x].Vk !== null) {
                                    Table.push({
                                        tag: MulReservationS[x].key,
                                        instruction: op,
                                        dest,
                                        reg1,
                                        reg2,
                                        issue: cycle,
                                        execution: (cycle + 1) + '...' + (cycle + 1 + LatencyMul),
                                        writeback: (cycle + 1 + LatencyMul + 1)
                                    })
        
                                    //should start executing in cycle+1
        
                                }
                                else {
                                    Table.push({
                                        tag: MulReservationS[x].key,
                                        instruction: op,
                                        dest,
                                        reg1,
                                        reg2,
                                        issue: cycle,
                                        execution: null,
                                        writeback: null
                                    })
        
        
                                }
        
        
                            }
                            break;
                
                case "DIV.D": 

                var stalled = MulReservationS[0].busy === 1 && MulReservationS[1].busy === 1 && MulReservationS[2].busy === 1;
                if (stalled) {
                    stalledBy = 2;
                    i--;
                }
                else {
                    const register1 = Registers.filter(r => r.key === reg1)[0];
                    const register2 = Registers.filter(r => r.key === reg2)[0];
                    const destination = Registers.filter(r => r.key === dest)[0];

                    var x;
                    for (x = 0; x < MulReservationS.length; x++) {
                        if (MulReservationS[x].busy === 0) {
                            MulReservationS[x] = {
                                key: MulReservationS[x].key,
                                op,
                                Vj: register1.Qi === 0 ? register1.value : null,
                                Vk: register2.Qi === 0 ? register2.value : null,
                                Qj: register1.Qi !== 0 ? register1.Qi : null,
                                Qk: register2.Qi !== 0 ? register2.Qi : null,
                                busy: 1
                            };
                            break;
                        }
                    }

                    Registers.map((reg) => {
                        if (reg.key === destination.key) {
                            reg.Qi = 'M' + (x + 1);
                        }
                    })



                    if (MulReservationS[x].Vj !== null && MulReservationS[x].Vk !== null) {
                        Table.push({
                            tag: MulReservationS[x].key,
                            instruction: op,
                            dest,
                            reg1,
                            reg2,
                            issue: cycle,
                            execution: (cycle + 1) + '...' + (cycle + 1 + LatencyDiv),
                            writeback: (cycle + 1 + LatencyDiv + 1)
                        })

                        //should start executing in cycle+1

                    }
                    else {
                        Table.push({
                            tag: MulReservationS[x].key,
                            instruction: op,
                            dest,
                            reg1,
                            reg2,
                            issue: cycle,
                            execution: null,
                            writeback: null
                        })


                    }


                }
                break;           
                        }
            

        i++;
    }

    if (!incremented)
        cycle++;


    let result;

    var writebacks = [];
    Table.forEach(row => {
        //execute
        let end;
        if (row.execution)
            end = parseInt(row.execution.split('...')[1]);

        if (end && cycle === end) {
            const thisTag = row.tag;
            if (thisTag[0] === 'A' ) {
                const input1 = AddReservationS.filter(a => a.key === thisTag)[0].Vj;
                const input2 = AddReservationS.filter(a => a.key === thisTag)[0].Vk;

                result = ALU(input1, input2, row.instruction);

                ALUresult.map(r => {
                    if (r.tag === row.tag) {
                        r.result = result;
                        r.cycle = cycle;
                    }
                })
            }
            else if(thisTag[0] === 'M'){
                const input1 = MulReservationS.filter(a => a.key === thisTag)[0].Vj;
                const input2 = MulReservationS.filter(a => a.key === thisTag)[0].Vk;

                result = ALU(input1, input2, row.instruction);

                ALUresult.map(r => {
                    if (r.tag === row.tag) {
                        r.result = result;
                        r.cycle = cycle;
                    }
                })


            }

        }

        const wb = parseInt(row.writeback);


        if (cycle === wb) {
            writebacks.push(row);
            if (writebacks.length > 1) {
                writebacks[writebacks.length - 1].writeback = writebacks[writebacks.length - 2].writeback + 1;
                row.writeback = writebacks[writebacks.length - 1].writeback;

                //update the alu result
                ALUresult.map(res => {
                    if (res.tag === row.tag)
                        res.cycle = row.writeback - 1;
                })

            }
        }

        if (row.writeback === cycle - 1) {
            //write off the res station entry
            const t = row.tag;
            if (t.includes('A')) {
                AddReservationS.map(reservation => {
                    if (reservation.key == t) {
                        reservation.Qj = null;
                        reservation.Qk = null;
                        reservation.Vj = null;
                        reservation.Vk = null;
                        reservation.busy = 0;
                        reservation.op = null;
                    }
                })

                if (stalledBy === 1)
                    stalledBy = -1;
            }
            if (t.includes('M')) {
                MulReservationS.map(reservation => {
                    if (reservation.key == t) {
                        reservation.Qj = null;
                        reservation.Qk = null;
                        reservation.Vj = null;
                        reservation.Vk = null;
                        reservation.busy = 0;
                        reservation.op = null;
                    }
                })
                if (stalledBy === 2)
                    stalledBy = -1;
            }
            if (t.includes('S')) {
                StoreBuffer1.map(reservation => {
                    if (reservation.key == t) {
                        reservation.Q = null;
                        reservation.V = null;
                        reservation.busy = 0;
                        reservation.address = null;
                    }
                })
                if (stalledBy === 3)
                    stalledBy = -1;
            }
            if (t.includes('L')) {
                LoadBuffer1.map(reservation => {
                    if (reservation.key == t) {
                        reservation.busy = 0;
                        reservation.address = null;
                    }
                })
                if (stalledBy === 4)
                    stalledBy = -1;
            }

        }
    })

    if (writebacks[0]) {
        console.log('anaaaaaa')
        const ctemp = cycle - 1;

        if (writebacks[0].tag.includes('S')) {
            const memaddres = writebacks[0].dest;
            Memory[memaddres] = StoreBuffer1.filter(s => s.key === writebacks[0].tag)[0].V;
        }

        Registers.map(reg => {
            //checks the reservation stations
            AddReservationS.map(addr => {
                if (addr.Qj === writebacks[0].tag) {
                    if (writebacks[0].tag.includes('L'))
                    {
                        const val = Memory[writebacks[0].dest];
                        addr.Vj = val;
                        addr.Qj = null;
                    }

                    else {
                        addr.Vj = ALUresult.filter(r => (r.tag === addr.Qj && ctemp === r.cycle))[0].result;
                        addr.Qj = null;
                    }


                    if (addr.Qj === null && addr.Qk === null) {
                        //now we can execute
                        Table.map(row => {
                            if (row.tag === addr.key) {
                                row.execution = (cycle + 1) + '...' + (cycle + 1 + LatencyAdd)
                                    row.writeback = (cycle + 1 + LatencyAdd + 1)
                            }
                        })
                    }
                }
                if (addr.Qk === writebacks[0].tag) {

                    if (writebacks[0].tag.includes('L'))
                    {
                        const val = Memory[writebacks[0].dest];
                        addr.Vk = val;
                        addr.Qk = null;
                    }

                    else {
                        addr.Vk = ALUresult.filter(r => (r.tag === addr.Qk && ctemp === r.cycle))[0].result;
                        addr.Qk = null;
                    }


                    if (addr.Qj === null && addr.Qk === null) {
                        //now we can execute
                        Table.map(row => {
                            if (row.tag === addr.key) {
                                let latency;
                                if (row.instruction === 'ADD.D')
                                latency = LatencyAdd;
                                else if (row.instruction === 'SUB.D')
                                latency = LatencySub;

                                row.execution = (cycle + 1) + '...' + (cycle + 1 + latency)
                                row.writeback = (cycle + 1 + latency + 1)
                            }
                        })
                    }
                }


            })
            MulReservationS.map(addr => {
                if (addr.Qj === writebacks[0].tag) {

                    if (writebacks[0].tag.includes('L'))
                    {
                        const val = Memory[writebacks[0].dest];
                        addr.Vj = val;
                        addr.Qj = null;
                    }

                    else {
                        addr.Vj = ALUresult.filter(r => (r.tag === addr.Qj && ctemp === r.cycle))[0].result;
                        addr.Qj = null;
                    }

                    if (addr.Qj === null && addr.Qk === null) {
                        //now we can execute
                        Table.map(row => {
                            if (row.tag === addr.key) {
                                let latency;
                                if (row.instruction === 'MUL.D')
                                latency = LatencyMul;
                                else if (row.instruction === 'DIV.D')
                                latency = LatencyDiv;

                                row.execution = (cycle + 1) + '...' + (cycle + 1 + latency)
                                    row.writeback = (cycle + 1 + latency + 1)
                            }
                        })
                    }
                }
                if (addr.Qk === writebacks[0].tag) {
                    if (writebacks[0].tag.includes('L'))
                    {
                        const val = Memory[writebacks[0].dest];
                        addr.Vk = val;
                        addr.Qk = null;
                    }

                    else {
                        addr.Vk = ALUresult.filter(r => (r.tag === addr.Qk && ctemp === r.cycle))[0].result;
                        addr.Qk = null;
                    }
                    if (addr.Qj === null && addr.Qk === null) {
                        //now we can execute
                        Table.map(row => {
                            if (row.tag === addr.key) {
                                let latency;
                                if (row.instruction === 'MUL.D')
                                latency = LatencyMul;
                                else if (row.instruction === 'DIV.D')
                                latency = LatencyDiv;

                                row.execution = (cycle + 1) + '...' + (cycle + 1 + latency)
                                    row.writeback = (cycle + 1 + latency + 1)
                            }
                        })
                    }
                }
            })
            StoreBuffer1.map(addr => {

                if (addr.Q === writebacks[0].tag) {
                    if (writebacks[0].tag.includes('L'))
                    {
                        const val = Memory[writebacks[0].dest];
                        addr.V = val;
                        addr.Q = null;
                    }

                    else {
                        addr.V = ALUresult.filter(r => (r.tag === addr.Q && ctemp === r.cycle))[0].result;
                        addr.Q = null;
                    }

                    if (addr.Q === null) {
                        //now we can execute
                        Table.map(row => {
                            if (row.tag === addr.key) {
                                row.execution = (cycle + 1) + '...' + (cycle + 1 + LatencyStore)
                                    row.writeback = (cycle + 1 + LatencyStore + 1)
                            }
                        })
                    }
                }

            })

            //this updates the register
            if (!writebacks[0].tag.includes('S') && !writebacks[0].tag.includes('L') && reg.Qi === writebacks[0].tag) {
                reg.value = ALUresult.filter(r => (r.tag === reg.Qi && ctemp === r.cycle))[0].result;
                reg.Qi = 0;
            }
            else if (writebacks[0].tag.includes('L') && reg.Qi === writebacks[0].tag) {
                const val = Memory[writebacks[0].dest];
                reg.value = val;
                reg.Qi = 0;
            }
        })
        console.log('writeback bf', writebacks1)
        writebacks1++;
        console.log('writeback after', writebacks1)

    }

    
    let r = {
        cycle,
        Table,
        AddReservationS,
        MulReservationS,
        LoadBuffer1,
        StoreBuffer1,
        Memory,
        Registers
    }
    console.log(r)
    final.push(r);
}

    return final

}


module.exports=  main;


