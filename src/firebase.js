const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage, getDownloadURL } = require('firebase-admin/storage');

const serviceAccount = require('../firebaseKey.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'carrossel-232fd.appspot.com'
});

const bucket = getStorage().bucket();

module.exports = {bucket, getStorage, getDownloadURL}