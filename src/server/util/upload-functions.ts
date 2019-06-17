// -----------------------------------
// Helper functions for file uploading.
// -----------------------------------

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const fsPromise = fs.promises;

interface MulterUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  fileName?: string;
  filePath?: string;
}
// Process -> use muter to write file to buffer.
// Check magic number are match .pdf image
// If magic number match buffer -> write to file system
// Convert to magic numbers

// hex buffer removes the spacing // 25 50 44 66 for .pdf
const MAGIC_NUMBER = {
  pdf: '25504446'
};

const MIME_TYPE = {
  pdf: 'application/pdf'
};

export function checkUploadedFile(file: MulterUpload) {
  return new Promise((resolve, reject) => {
    const mimetype = file.mimetype;

    // Get the magic numbers from the uploaded buffer
    const magic = file.buffer.toString('hex', 0, 4);

    // Check the magin numbers and mimetype match
    if (magic === MAGIC_NUMBER.pdf && mimetype === MIME_TYPE.pdf) {
      // File is a pdf
      // Pass the file buffer onto the next function
      resolve(file);
    } else {
      // File is not a .pdf
      reject(new Error('File is nor a .pdf'));
    }
  });
}

export const verifyMagicNumbers = async (file: MulterUpload) => {
  const mimetype = file.mimetype;

  // Get the magic numbers from the uploaded buffer
  const magicNumber = file.buffer.toString('hex', 0, 4);

  // Check the magin numbers and mimetype match
  if (magicNumber === MAGIC_NUMBER.pdf && mimetype === MIME_TYPE.pdf) {
    // File is a pdf
    // Pass the file buffer onto the next function
    return file;
  } else {
    // File is not a .pdf
    return new Error('File is not compatible');
  }
};

export function saveFileBufferToUploads(file: MulterUpload) {
  return new Promise((resolve, reject) => {
    // Generate a random filename so it does not clash. must be done synchronously
    const fileName = crypto.randomBytes(8).toString('hex') + Date.now();
    const filePath = fileName + path.extname(file.originalname);
    file.fileName = fileName;
    file.filePath = filePath;

    fs.writeFile('./uploads/' + filePath, file.buffer, 'binary', function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(file);
      }
    });
  });
}

export const asyncSaveFileBufferToUploads = async (file: MulterUpload) => {
  try {
    // Generate a random filename so it does not clash. must be done synchronously
    const fileName = crypto.randomBytes(8).toString('hex') + Date.now();
    const filePath = fileName + path.extname(file.originalname);
    file.fileName = fileName;
    file.filePath = filePath;

    await fsPromise.writeFile('./uploads/' + filePath, file.buffer, 'binary');
    return file;
  } catch (err) {
    return err;
  }
};
