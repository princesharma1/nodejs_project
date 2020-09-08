const port=1400;
const USER_FILE="users.json";
var express = require("express"), app=express();
var fs = require("fs");
var bodyParser = require('body-parser');

app.use('/assets/*', express.static(__dirname+ '/assets'))
app.use('/css', express.static(__dirname+ '/css'));
app.use('/js', express.static(__dirname+ '/js'))
app.use(bodyParser.urlencoded({
   extended: false
}));

app.get("/checkuser",function(req,res){
	var userid=req.query.userid;
  fs.readFile(USER_FILE, function(err, data) {
    var msg={};
	var status=false;
	if(data==null || data=="" || data==undefined){
	}else{
	var uid=JSON.parse(data);
	for(i=0;i<uid.users.length;i++){
		//a.push(uid.users[i].EmailAddress);
		if(userid===uid.users[i].EmailAddress){
			status=true;

		}
	}
	}
	if(status==true){
		msg.message="Username not available";
	}
	else{
	msg.message="Username Available";	
	}
	res.write(JSON.stringify(msg));
	//res.write(msg);
    return res.end();
  });
})

app.listen(port);
console.log("App listening on http://localhost:" +port );