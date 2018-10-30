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

// Creates a client
const storage = new Storage();
const bucketName = 'acs2909fall';
//const srcFilename = '';
const destFilename = Date.now()+".txt";;

const options = {
  // The path to which the file should be downloaded, e.g. "./file.txt"
  destination: destFilename,
};

const app = express();
app.use(bodyParser.text({type:'text/plain'}));
app.use(bodyParser.json());

// [START hello_world]
// Say hello!
app.get('/', (req, res) => {
  const sn = req.query.studentNumber;
  const filename = Date.now()+".txt";
  download(sn, filename).then((err) => {
	  
	  res.status(200).sendFile(path.join(__dirname,filename), () => {
	  
	fs.unlink(path.join(__dirname,filename), (err) => {console.error(err);});
	  });
  }).catch(() => {
	  res.status(500).json({message:"NoStudentNumber"})
  });
});
// [END hello_world]

async function download(sn, filename) {
	await storage.bucket(bucketName).file(sn+".txt").download({destination: filename});
}

app.post('/', (req, res) => {
	const filename = Date.now()+".txt";
	fs.writeFile(path.join(__dirname,filename), req.body, (err) =>{ 
		upload(filename);
		res.status(200).json({message:"Saved"});
	});
});

async function upload(filename) {
	await storage.bucket(bucketName).upload(filename);
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
