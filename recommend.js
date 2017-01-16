var dotenv = require('dotenv').config();
//get command line args owener and name
var repoOwner = process.argv[2];
var repoName = process.argv[3];
// if (!repoName) {
//   console.log("User AND Repo Name required. Exiting")
//   process.exit()
// } ;
var request = require('request');
var fs = require('fs');
var GITHUB_USER = dotenv.parsed.TOKENUSER;
var GITHUB_TOKEN = dotenv.parsed.TOKEN;

var starCount = {};


console.log('Welcome to the GitHub Avatar Downloader!');


const getRepoContributors = function(repoOwner, repoName, callback) {
  //construct url format for api
  //var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/jquery/jquery/contributors';
  // add required user-agent
  options = {
    url: requestURL,
    headers: {
      'User-Agent': 'drakaven'
    }
  };
  //send request
  request.get(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      //call back to process the parsed body
      callback(error, JSON.parse(body));
    }
  })
}

const getStarred = function(user){
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/users/' + user +'/starred'
    options = {
    url: requestURL,
    headers: {
      'User-Agent': 'drakaven'
    }
  }
    //console.log(requestURL.substring(0, requestURL.indexOf('{')));
    request.get(options, function(error, response, body) {
      parsedBody = JSON.parse(body);
      parsedBody.forEach((item) => {
        (starCount.hasOwnProperty(item.full_name)) ? starCount[item.full_name] ++ : starCount[item.full_name] = 1;
      });
      console.log(starCount);
  });
}

getRepoContributors(repoOwner, repoName, function(err, result) {
  //passed in as the callback runs downloadImage of each user in body json
  result.forEach((user) => {
    getStarred(user.login);
  });
});