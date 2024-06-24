# Tomasulo Architecture Simulator 💻⚙️

This project is a simulator for Tomasulo's Algorithm, which is a computer architecture scheme for dynamic scheduling of instructions, allowing for parallel execution of instructions with different latencies. 

## Overview
The simulator is implemented in JavaScript and aims to demonstrate the functionality and behavior of Tomasulo's Algorithm in a simplified processor architecture. It includes components such as reservation stations for different types of instructions, functional units (such as ALUs), and memory structures (load and store buffers).

## Components
### ALU (Arithmetic Logic Unit)
The ALU is responsible for executing arithmetic and logical operations. It takes input from reservation stations, performs the operation, and produces the result.

### Reservation Stations
There are separate reservation stations for different types of instructions, such as addition, subtraction, multiplication, division, load, and store. These stations hold instructions until their operands are available and then dispatch them to functional units for execution.

### Load and Store Buffers
These buffers handle memory operations. Load instructions fetch data from memory and store it in registers, while store instructions write data from registers to memory.

### Memory
The memory stores program instructions and data that are accessed by load and store instructions.

### Registers
Registers hold data that is used by instructions. They also store the results of completed operations.

### How to Use
Installation: Clone the repository and ensure you have Node.js installed on your system.

Use the `TEST FILE` included to run the app using `main.js`

## Developed by a lovely team of five 💖💖💖💖💖
Tarteel Elattar (Me)

[Dina Ayman](https://github.com/DinaAymann)

[Nora Osama](https://github.com/NoraOsama)

[Bassant Tarek](https://github.com/bassantTarekk)

[Salma Khaled](https://github.com/salmakhaled11234)
