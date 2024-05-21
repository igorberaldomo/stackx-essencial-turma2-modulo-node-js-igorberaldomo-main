import { createInterface } from "readline";
import { promises as fs } from "fs";
import { EventEmitter } from "node:events";

console.time("Tempo decorido");

const reader = createInterface({
    input: process.stdin,
    output: process.stdout,
})

const ask = (text) => {
    return new Promise((resolve) =>
        reader.question(text, (res) => resolve(res))
    );
};

const ee = new EventEmitter();

const lineResults = async (answer) => {
    try {
        console.log(`Tem ${answer.numberLinesWithNumber} linhas com somente números e a soma de todos os numeros é ${answer.sumLinesWithNumber}.\nTem ${answer.qtTextLines} linhas com somente texto.`);
    }
    catch (err) {
        console.log("ERROR: lineResults\n" + err);
    }
};

ee.on("finalizado", lineResults);

const parseArchive = async (fileName) => {
    try {
        const data = await fs.readFile(fileName, "utf8");
        var processedData = data.split('\r\n');
        let numberLinesWithNumber = 0;
        let sumLinesWithNumber = 0;
        let qtTextLines = 0;
        for (let i = 0; i < processedData.length; i++) {
            if(processedData[i].trim().length ===0) continue;
            let variable = parseInt(processedData[i]);
            if (variable && variable == processedData[i]) {
                numberLinesWithNumber++;
                sumLinesWithNumber += variable;
            } else {
                qtTextLines++;
            }
        }
        ee.emit("finalizado", { numberLinesWithNumber, sumLinesWithNumber, qtTextLines })
    } catch (err) {
        console.log("ERROR: parseArchive\n" + err)
    }
}

const anotherFile = async () => {
    let doAnother = true;
    while (doAnother) {
        const fileName = await ask('Qual o nome do arquivo? ');
        const sendToProcessing = await parseArchive(fileName);
        const res = await ask("Outro arquivo(S/n)?");
        if(res == "S" || res == "s"){
            doAnother = true
        } else{
            doAnother = false
        }
    }
};


const main = async () => {
    await anotherFile();
    reader.close();
    console.timeEnd("Tempo decorido");
    process.exit(0);
}

main();
