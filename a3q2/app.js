// Copyright 2018, Google LLC.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
const path = require('path');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const {Storage} = require('@google-cloud/storage');
const str = require('string-to-stream');

// Creates a client
const storage = new Storage();
const bucketName = 'acs2909fall';

const app = express();
app.use(bodyParser.text({type:'text/plain'}));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  const sn = req.query.studentNumber;
  
  const filename = Date.now()+".txt";
  storage.bucket(bucketName).file(sn+".txt").createReadStream().pipe(res);
});

app.post('/', async (req, res) => {
	const sn = req.query.studentNumber;
  const filename = sn+".txt";
  upload(filename, req.body, (err) => {
    if (err) { res.status(500).json({message:'Failed'}); }
    else { res.status(200).json({message:"Saved"}); }
  });
});

function upload(filename, content, cb) {
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(filename);
  str(content).pipe(file.createWriteStream())
    .on('error', (err)=> { cb(err)})
    .on('finish', () => {
      cb();
    })
}

if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
