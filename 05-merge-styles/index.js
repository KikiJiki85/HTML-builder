const path = require('path');
const fs = require('fs').promises;
const sourcePath = path.join(__dirname, 'styles');
const destinationPath = path.join(__dirname, 'project-dist');
const destinationFile = path.join(destinationPath, 'bundle.css');

async function mergeStyles(source, destination) {
  const records = await fs.readdir(source, { withFileTypes: true });
  let styles = '';
  for (let record of records) {
    const sourcePath = path.join(source, record.name);
    if (record.isFile() && path.extname(record.name) === '.css') {
      const style = await fs.readFile(sourcePath, 'utf-8');
      styles += style + '\n';
    }
  }
  await fs.writeFile(destination, styles);
}

mergeStyles(sourcePath, destinationFile)
  .then(() => console.log('Styles bundled successfully'))
  .catch(console.error);
