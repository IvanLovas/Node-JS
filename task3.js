const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const inputFilePath = path.join(__dirname, './csv/input.csv');
const outputFilePath = path.join(__dirname, './csv/output.txt');

const readStream = fs.createReadStream(inputFilePath);
const writeStream = fs.createWriteStream(outputFilePath);

readStream.pipe(csv())
    .on('data', (row) => {
        const jsonRow = JSON.parse(row);
        writeStream.write(`${JSON.stringify(jsonRow)}\n`);
    })
    .on('end', () => {
        console.log('CSV file successfully processed and written to TXT file.');
    })
    .on('error', (error) => {
        console.error('Error reading the CSV file:', error);
    });

writeStream.on('error', (error) => {
    console.error('Error writing to the TXT file:', error);
});