const path = require('path');
const fs = require('fs').promises;
const folderPath = path.join(__dirname, 'files');
const folderCopyPath = path.join(__dirname, 'files-copy');

async function copyDirectory(source, destination) {
  await fs.rm(destination, { recursive: true, force: true });
  await fs.mkdir(destination, { recursive: true });
  const records = await fs.readdir(source, { withFileTypes: true });

  for (let record of records) {
    const sourcePath = path.join(source, record.name);
    const destinationPath = path.join(destination, record.name);

    record.isDirectory()
      ? await copyDirectory(sourcePath, destinationPath)
      : await fs.copyFile(sourcePath, destinationPath);
  }
}

copyDirectory(folderPath, folderCopyPath)
  .then(() => console.log('Copying finished successefuly'))
  .catch(console.error);
