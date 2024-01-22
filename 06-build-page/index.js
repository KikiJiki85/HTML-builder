const path = require('path');
const fs = require('fs').promises;

const templateFilePath = path.join(__dirname, 'template.html');
const stylesFolderPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');
const componentsFolderPath = path.join(__dirname, 'components');
const projectDistPath = path.join(__dirname, 'project-dist');

async function buildPage() {
  const template = await fs.readFile(templateFilePath, 'utf8');

  const componentNames = template
    .match(/{{\w+}}/g)
    .map((tag) => tag.slice(2, -2));

  let html = template;
  for (const name of componentNames) {
    const componentContent = await fs.readFile(
      `${componentsFolderPath}/${name}.html`,
      'utf8',
    );
    html = html.replace(new RegExp(`{{${name}}}`, 'g'), componentContent);
  }

  await fs.rm(projectDistPath, { recursive: true, force: true });
  await fs.mkdir(projectDistPath, { recursive: true });
  await fs.writeFile(`${projectDistPath}/index.html`, html);

  mergeStyles(stylesFolderPath, `${projectDistPath}/style.css`);

  copyDirectory(assetsFolderPath, `${projectDistPath}/assets`);
}

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

async function copyDirectory(source, destination) {
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

buildPage().catch(console.error);
