import fs from 'fs';
import os from 'os';
import path from 'path';
import validator from 'validator';
import request from 'request';
import decompress from 'decompress';
import uniqueFilename from 'unique-filename';
import Readline from 'line-by-line';

export default function countries ({ logger }) {
  return {
    downloadAndUnzip: downloadAndUnzip.bind(this, { logger }),
    getFileAndProcess: getFileAndProcess.bind(this, { logger }),
    processFile: processFile.bind(this, { logger }),
    unzipAndProcessFile: unzipAndProcessFile.bind(this, { logger }),
  };
}

async function downloadAndUnzip ({ logger }, countryCode) {
  if (!validator.isAlpha(countryCode)) {
    throw new Error(`Country code is not defined. Current value ${countryCode}`);
  }

  const downloadUrl = `http://download.geonames.org/export/dump/${countryCode}.zip`;
  let rawDataFilePath;
  try {
    const zippedFilePath = await download({ logger }, downloadUrl);
    rawDataFilePath = await unzip({ logger }, zippedFilePath);
    deleteFile(zippedFilePath);
    logger.info(`${zippedFilePath} deleted`);
  } catch (e) {
    throw e;
  }

  return rawDataFilePath;
}

async function processFile ({ logger }, { rawDataFilePath, originalFile }, lineCallback) {
  return new Promise(async (resolve, reject) => {
    const read = new Readline(rawDataFilePath);

    let lineNumber = 0;
    const linesWithError = [];
    const parsedLines = [];

    const lineHandler = (line) => {
      lineNumber++;
      read.pause();
      process.nextTick(async () => {
        try {
          const result = await lineCallback(line);
          parsedLines.push(result);
        } catch (err) {
          linesWithError.push(lineNumber);
        }

        read.resume();
      });
    };

    read
      .on('line', lineHandler)
      .on('error', (e) => {
        reject(e);
      })
      .on('end', async () => {
        deleteFile(rawDataFilePath);
        resolve({ linesWithError, parsedLines, originalFile });
      });
  });
}

async function unzipAndProcessFile ({ logger }, originalFile, lineCallback) {
  let rawDataFilePath;
  try {
    rawDataFilePath = await unzip({ logger }, originalFile);
    return processFile({ logger }, { rawDataFilePath, originalFile }, lineCallback);
  } catch (e) {
    throw e;
  }
}

// callback: function(line, lineCount, byteCount)
async function getFileAndProcess ({ logger }, countryCode, lineCallback) {
  let rawDataFilePath;
  try {
    rawDataFilePath = await downloadAndUnzip({ logger }, countryCode);
    return processFile({ logger }, { rawDataFilePath }, lineCallback);
  } catch (e) {
    throw e;
  }
}

function download ({ logger }, url) {
  return new Promise((resolve, reject) => {
    const outputZipFile = uniqueFilename(os.tmpdir());
    logger.info(`downloading country data from ${url}`);
    request(url)
      .pipe(fs.createWriteStream(outputZipFile))
      .on('error', (err) => {
        reject(err);
      })
      .on('finish', () => {
        logger.info(`country data downloaded from ${url}`);
        resolve(outputZipFile);
      });
  });
}

async function unzip ({ logger }, zippedFile) {
  try {
    const outputPath = os.tmpdir();
    const files = await decompress(zippedFile, outputPath, { file: file => file.path !== 'readme.txt' });
    const outputCountryFile = files.filter(file => file.path !== 'readme.txt')[0];
    const outputCountryFilePath = path.join(outputPath, outputCountryFile.path);
    const readmefile = path.join(outputPath, 'readme.txt');
    deleteFile(readmefile);
    return outputCountryFilePath;
  } catch (e) {
    logger.error('error decompressing files', e);
    throw e;
  }
}

function deleteFile (file) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}
