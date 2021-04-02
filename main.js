const fs = require('fs');

//have these end with a /
const rootFolder = "F:/org/"; 
const targetFolder = "F:/output/"

let filesToProcess;
let fileCount = 0;
fs.readdir(rootFolder, (err, list) => {
  if(err) return;
  filesToProcess=list.length;
  for (const file of list) {
    processFile(file);
  }
});

function getYearOfFile(path){
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, result) => {
      if(err) return reject(err);
      const date = new Date(result.mtime);
      return resolve(date.getFullYear());
    });
  })
}

function processFile(file){
  const orgPath = rootFolder+file
  getYearOfFile(orgPath).then(year => {
    const newPath = targetFolder+year+"/"+file
    if (!fs.existsSync(targetFolder+year)){
      fs.mkdirSync(targetFolder+year);
    }
    fs.rename(orgPath, newPath, (err) => {
      if(err){
        console.error(err, file);
        return;
      }
      fileCount++;
      console.log((fileCount/filesToProcess*100) + "%");
    });
  })
  .catch(err => console.error(err, file));
}