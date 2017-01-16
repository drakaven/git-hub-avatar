var request = require('request');
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
      console.log(body);
    }
  })

}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});