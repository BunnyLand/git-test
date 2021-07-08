# git-test
Git repository containing the web service code for GitHub screening exercise - Part 2
It is a REST api implemented using node.js + express.

Following use case are implemented:

**1. Read webhook respnose:**

The api consumed the webhook respnose trigered on a GitHub repository / branch creation.

**2. Enable protection on the master branch of the newly created Git repository:**

The api uses the webhook data and triggers GitHub "Update branch protection" api to enable the protection on the master branch of newly created repository.

**3. Create an issue about that master branch was not protected on the repository and assign to self.**

Using the GitHub "Create Issue" api



Steps
Note
Only rest api with https support can be deployed behind API/ML, make sure to enable https support in your rest api.
This express app, has https enabled already.

**PART I: Download & Build on local**
  
Method 1: From github
1) **Clone the repository**, install node packages and verify routes locally

//on local

git clone https://github.com/BunnyLand/git-test.git

cd git-test

npm install

npm start

Open your local browser and verify the git-test is working by accessing:

(http://localhost:8085/api/webhook-respnose)

Status:200 OK, can not Get /webhook-respnose

**To test the api using cURL:**
curl --location --request POST 'http://localhost:8085/api/webhook-respnose/' \
--header 'Content-Type: application/json' \
--data-raw '{
  "ref": "main",
  "ref_type": "branch",
  "master_branch": "main",
  "description": "this is test repository for GitHub exercise ",
  "pusher_type": "user",
  "repository": {
    "id": 12345xxx,
    "node_id": "123445xxxxx=",
    "name": "repo-name",
    "full_name": "org-name/repo-name",
    "url": "https://api.github.com/repos/org-name/repo-name",
    "default_branch": "main"
  }
}'


**Transfer project files from local to remote host:**

Note:

a. The node_modules folder will not be transferred, we can do npm install later on remote server itself to pull down required node packages

cd git-test

npm run build

For the next step, ensure that you have node installed on machine and your PATH includes nodejs/bin directory.
