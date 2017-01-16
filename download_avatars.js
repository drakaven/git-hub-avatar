//get avatar images from user contributins to specificed github repo

//does not return paginated results
//does not create a folder
//hard coded folder

//get command line args owener and name
require('dotenv').config();

var repoOwner = process.argv[2];
var repoName = process.argv[3];
if (!repoName) {
  console.log("User AND Repo Name required. Exiting")
  process.exit()
} ;
var request = require('request');
var fs = require('fs');
var GITHUB_USER = process.env.TOKENUSER;
var GITHUB_TOKEN = process.env.TOKEN;
console.log('Welcome to the GitHub Avatar Downloader!');


const getRepoContributors = function(repoOwner, repoName, callback) {
  //construct url format for api
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  // add required user-agent
  options = {
    url: requestURL,
    headers: {
      'User-Agent': 'drakaven'
    }
  };
  //send request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      //call back to process the parsed body
      callback(error, JSON.parse(body));
    }
  })
}

//given an image url get image and write to filepath
// hardcoded directory, will fail if dir does not exist
const downloadImageByURL = function(url, filePath) {
  request.get(url)
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(response) {
      console.log('Downloading image...');
      console.log(filePath += response.headers['content-type'].replace('image/', '.'));
    })
    .pipe(fs.createWriteStream('./avatars/' + filePath))
    .on('finish', function() {
      console.log('Downloading Complete');
    });
}

//call the function
getRepoContributors(repoOwner, repoName, function(err, result) {
  //passed in as the callback runs downloadImage of each user in body json
  result.forEach((user) => {
    downloadImageByURL(user.avatar_url, user.login);
  });
});