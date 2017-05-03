import fs from 'fs';
import path from 'path';
import child from 'child_process';

export function start () { // eslint-disable-line
  const dataFolder = path.join(__dirname, 'data');
  const fileList = getAllFiles(dataFolder);
  load(fileList);
}

export function load (countryFilesList) {
  const children = {};
  for (const countryCode of countryFilesList) {
    const childArgs = [countryCode];
    children[countryCode] = child.fork(`${__dirname}/importCountry`, childArgs);
    children[countryCode].on('message', (msg) => {
      console.log(msg);
    });
  }
}

export function getAllFiles (folder) {
  return fs.readdirSync(folder).map(file => path.join(folder, file));
}
