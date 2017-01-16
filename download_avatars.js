var request = require('request');
var fs = require('fs');
var GITHUB_USER = "drakaven";
var GITHUB_TOKEN = "e40639e04429fc58aa5b981d58f243e0dcde314d";
console.log('Welcome to the GitHub Avatar Downloader!');

const getRepoContributors = function(repoOwner, repoName, cb) {
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  options = {
    url: requestURL,
    headers: {
      'User-Agent': 'drakaven'
    }
  };
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      cb(error, JSON.parse(body));
    }
  })
}

getRepoContributors("jquery", "jquery", function(err, result) {
  result.forEach((user) => {
    downloadImageByURL(user.avatar_url, user.login);
  });
});

function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(err) {
    throw err;
  })
  .on('response', function(response) {
    console.log('Downloading image...');
    console.log('Response', response.statusCode, response.headers['content-type']);
  })
  .pipe(fs.createWriteStream('./avatars/' + filePath))
  .on('finish', function() {
    console.log('Downloading Complete');
  });
}