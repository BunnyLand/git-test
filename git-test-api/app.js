// BASE SETUP
// =============================================================================

// packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8085;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

var token = 'Basic cnVwZW5kcmFfc2hhcm1hOmdocF9tZ3BJZDFiMWRhZVdISzZpYnZvMjdPOU5lSWgzaFkzTGwyM2s=';
var acceptType = 'application/vnd.github.luke-cage-preview';
var contentType = 'application/json';
var user = 'rupendra-sharma';
/*
 * Receive GitHub webhook response
 * Execute repository protection usingGitHub repository api
 * Write a notifaction for GitHub branch protected
 */
router.route('/webhook-respnose')
.post(function(req, res, next){
	
	//Read webhook respnose:
	
	//Filter data from webhook response
	//var fullName = req.body.repository.full_name;
	var url = req.body.repository.url;
	var masterBranch = req.body.master_branch
	//var branchUrl = req.body.repository.branches_url;
	var token = 'Basic cnVwZW5kcmFfc2hhcm1hOmdocF9tZ3BJZDFiMWRhZVdISzZpYnZvMjdPOU5lSWgzaFkzTGwyM2s=';
	var masterBranchUrl =  url + '/branches/' + masterBranch + '/protection';
	
	console.log("master branch url= " + masterBranchUrl);
	
	//console.log("fullName=" + fullName + "url " + url + " masterBranch " + masterBranch + " branchUrl " + branchUrl);

	//********** Enable master branch protection for the repository
	var request = require('request');
	var options = {
	  'method': 'PUT',
	  'url': masterBranchUrl,
	  'headers': {
	    'Accept': 'application/vnd.github.luke-cage-preview',
	    'Content-Type': 'application/json',
	    'Authorization': token,
	    'Cookie': '_octo=GH1.1.695315816.1625648407; logged_in=no',
	    'User-Agent': 'git-service'
	  },
	  body: JSON.stringify({
	    "required_status_checks": {
	      "strict": true,
	      "contexts": [
	        "contexts"
	      ]
	    },
	    "enforce_admins": true,
	    "required_pull_request_reviews": {
	      "dismissal_restrictions": {
	        "users": [
	          "rupendra_sharma"
	        ],
	        "teams": [
	          "oweners"
	        ]
	      },
	      "dismiss_stale_reviews": true,
	      "require_code_owner_reviews": true,
	      "required_approving_review_count": 5
	    },
	    "restrictions": {
	      "users": [
	        "rupendrasharma"
	      ],
	      "teams": [
	        "developers"
	      ]
	    }
	  })

	};
	request(options, function (error, response) {
	  
	  console.log("enable master branch protection request: " + response.body);
	  
	  if (error) throw new Error(error);
	  else {
		  //Master branch protection was enabled
		  //Create an issue in the repository and notify to self
		  var request = require('request');
		  var options = {
		    'method': 'POST',
		    'url': url + '/issues',
		    'headers': {
		      'Accept': 'application/vnd.github.v3+json',
		      'Authorization': token,
		      'Content-Type': 'text/plain',
		      'Cookie': '_octo=GH1.1.695315816.1625648407; logged_in=no',
		      'User-Agent': 'git-service'
		    },
		    body: '{\n    "title":"Master branch protection was no enabled", \n    "body": "@rupendra-sharma, the master branch of the repository was unprotected.",\n    "assignee": "rupendra-sharma"\n\n}'

		  };
		  request(options, function (error, response) {
			console.log("create issue on repository and assign to self request: " + response.body);
		    if (error) throw new Error(error);
		    console.log(response.body);
		  });
		  
	  }
	});


});

//REGISTER OUR ROUTES -------------------------------
//all of our routes will be prefixed with /api
app.use('/api', router);

//START THE SERVER
//=============================================================================
app.listen(port);
console.log('git api started at port:  ' + port);