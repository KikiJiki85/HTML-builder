const path = require('path');
const fs = require('fs');
const { stdin, stdout, exit } = process;

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);

stdout.write('*** Welcome, please enter text: ***\n');

stdin.on('data', (data) => {
  const someText = String(data).trim();
  if (someText.indexOf('exit') === -1) writeStream.write(data);
  else forceExit();
});

const forceExit = () => {
  stdout.write('*** See you later! ***\n');
  exit();
};

process.on('SIGINT', forceExit);
