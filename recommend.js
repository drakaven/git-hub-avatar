var dotenv = require('dotenv').config();
//get command line args owener and name
var repoOwner = process.argv[2];
var repoName = process.argv[3];
if (!repoName) {
  console.log("User AND Repo Name required. Exiting")
  process.exit()
};
var request = require('request');
var fs = require('fs');
var GITHUB_USER = dotenv.parsed.TOKENUSER;
var GITHUB_TOKEN = dotenv.parsed.TOKEN;

var starCount = {};
var responseCount = 0;
var processCount = 0;

console.log('Welcome to the Repo Recommender Downloader!');


const getRepoContributors = function(repoOwner, repoName, callback) {
  //construct url format for api
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  //var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/jquery/jquery/contributors';
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

const getStarred = function(user) {
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/users/' + user + '/starred'
  options = {
    url: requestURL,
    headers: {
      'User-Agent': 'drakaven'
    }
  }

  request.get(options, function(error, response, body) {
    parsedBody = JSON.parse(body);
    //add each repo to an object to keep a counter
    parsedBody.forEach((item) => {
      (starCount.hasOwnProperty(item.full_name)) ? starCount[item.full_name]++: starCount[item.full_name] = 1;
    });
    processCount++;
    //if all files have been processed get topfive
    if (responseCount === processCount) topFive(starCount);
  });
}

//create multi dimensional array to sort by number value
const topFive = function(obj) {
  var arr = [];
  //push all item value into array as two point array
  for (item in obj) {
    arr.push([item, obj[item]]);
  };
  //sort by the second value of each entry
  arr = arr.sort((a, b) => {
    return b[1] - a[1];
  });
  for (var i = 0; i < 5; i++) {
    console.log(`[ ${arr[i][1]} stars] ${arr[i][0]}`);
  }
}

getRepoContributors(repoOwner, repoName, function(err, result) {
  //passed in as the callback runs downloadImage of each user in body json
  responseCount = result.length
  result.forEach((user) => {
    getStarred(user.login);
  });
});