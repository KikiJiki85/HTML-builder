const path = require('path');
const fs = require('fs');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Error try again later:', err);
    process.exit();
  }
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileName = path.parse(filePath).name;
      const fileExtension = path.parse(filePath).ext.slice(1);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error try again later:', err);
          process.exit();
        }
        const fileSizeInKB = stats.size / 1024;
        console.log(
          `${fileName}-${fileExtension}-${fileSizeInKB.toFixed(3)}kb`,
        );
      });
    }
  });
});
