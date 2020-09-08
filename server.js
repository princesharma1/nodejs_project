const port=1300;
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

app.get("/",function(req,res){
	res.redirect("/login");
});
app.get("/login",function(req,res){
	res.sendFile(__dirname+"/login.html");
});
app.get("/register",function(req,res){
	res.sendFile(__dirname+"/register.html");
});
app.get("/allusers",function(req,res){
	var obj;
	fs.readFile(USER_FILE,function(err,data){
		if(err) throw err;
		if(data==null || data=="" || data==undefined){
			obj = {"msg":"Data not found"};
		}else{
			obj = JSON.parse(data);
			
		}
		res.send(obj);
	})
	
})
app.get("/checkuser",function(req,res){
	
	var userid=req.query.userid;
	var status=false;
	var msg;
	fs.readFile(USER_FILE,"utf-8",function(err,d){
	if(err) throw err;
	if(d==null || d=="" || d==undefined){
	}else{
		 var userData=JSON.parse(d);
		 for(i=0;i<userData.users.length;i++){
			 //console.log(userid + " -- " + userData.users[i].EmailAddress);
			 if(userid==userData.users[i].EmailAddress){
				status=true;
			 }
		 }
		//console.log("Status fs 1: " + status) ;
	}
	/*if(status==true){
		msg="Username not available";
	}else {
		msg="Username available";
	}*/
	res.write(JSON.stringify(status));
	return res.end();
	})
	
})
app.post("/auth",function(req,res){
	var userid=req.body.inputEmailAddress;
	var password=req.body.inputPassword;
	
	 console.log("Cred: " + userid + " - " + password);
	 fs.readFile(USER_FILE,"utf-8",function(err,data){
		 if(err){
			throw err;
		 }
		 if(data==null || data=="" || data==undefined){
			  console.log("USer not exist");
		 }else{
			 var userData=JSON.parse(data);
			 if(userid && password){
				 for(i=0;i<userData.users.length;i++){
					 if(userid==userData.users[i].EmailAddress && password==userData.users[i].Password){
						 console.log("User Exist " + userData.users[i].EmailAddress);
						 res.send("Welcome " + userData.users[i].FirstName + " " + userData.users[i].LastName);
					 }else{
						 console.log("Invalid Credentials");
					 }
				 }
			 }
			else{
				 
			 }
		 }
	 })
})
app.post("/register",function(req,res){
	var obj={ users:[]};
	var c;
	var response = {
		FirstName:req.body.inputFirstName,
		LastName:req.body.inputLastName,
		EmailAddress:req.body.inputEmailAddress,
		Password:req.body.inputPassword
	};
	fs.readFile(USER_FILE,function(err,data){
		//console.log("Data: " + data);
		if(err) throw err;
		if(data==null || data=="" || data==undefined){
			response.id=1;
			obj.users.push(response);
			 j = JSON.stringify(obj);
		}else{
			o=JSON.parse(data);
			//console.log(o);
			for(i=0;i<o.users.length;i++){
				console.log(o.users[i].id);
				c=Number(o.users[i].id)+1;
				if(response.EmailAddress==o.users[i].EmailAddress){
					res.send("User AlreadyExist!");
					throw err;
				}
			}
			console.log("generated id: "+c);
			response.id=c;
			o.users.push(response);
			j = JSON.stringify(o);
		}
		fs.writeFile(USER_FILE,j,function(err){
			if(err) throw err;
			console.log("File Write!!");
		});
		res.send(response);
	})
	console.log(response);
	//res.send(response);
})

app.listen(port);
console.log("App listening on http://localhost:" +port );