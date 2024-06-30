const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const logFilePath = path.join(__dirname, 'activityMonitor.log');

function getTopProcess(callback) {
    const platform = os.platform();
    let command;

    if (platform === 'linux' || platform === 'darwin') {
       
        command = 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';
    } else if (platform === 'win32') {
       
        command = 'powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + \\" \\" + $_.CPU + \\" \\" + $_.WorkingSet }"';
    } else {
        callback(new Error(`Unsupported platform: ${platform}`), null);
        return;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            callback(error, null);
            return;
        }
        if (stderr) {
            callback(new Error(stderr), null);
            return;
        }
        callback(null, stdout.trim());
    });
}

function logProcessInfo(processInfo) {
    const timestamp = Math.floor(Date.now() / 1000);
    const logEntry = `${timestamp} : ${processInfo}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
}

function main() {
    let lastLogTime = Date.now();

    setInterval(() => {
        getTopProcess((error, processInfo) => {
            if (error) {
                console.error('Failed to get top process:', error);
                return;
            }

            process.stdout.write(`\r${processInfo}`);

            const currentTime = Date.now();
            if (currentTime - lastLogTime >= 60000) {
                logProcessInfo(processInfo);
                lastLogTime = currentTime;
            }
        });
    }, 100);
}

main();