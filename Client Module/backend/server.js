const express=require('express')
const app=express()
const port=8080;
const bcrypt=require('bcrypt');
const session=require('express-session');


var mysql=require('mysql');
var cors=require('cors');
var bodyParser=require('body-parser');
var nodemailer=require('nodemailer');

var connection=mysql.createConnection({
	host	:'localhost',
	user	:'root',
	password:'sharpedges',
	database:'project',
	port:'3306'
});

app.use(cors());
app.options('*', cors());  // enable pre-flight

app.use( bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
	'secret': "81379984948137998494", 
}))

var transporter=nodemailer.createTransport({
	service:'yahoo',
	newline: 'unix',
    path: '/usr/sbin/sendmail',	
	auth: {
		user:'peterjoep@yahoo.com',
		pass:'yzhb ivzo enrd mzfv'
	} 
});

var mailOptions={
	from: "peterjoep@yahoo.com",
	to:"joannpelza0@gmail.com",
	subject:'Password Reset Request for username-',
	text:'Njan oru sambhavam aanu ' 
}

app.get('/',function(req,res){
	connection.query('select 1+1 AS Solution',function(err,result,fields){
		if(err) throw err;

		console.log("Solution is "+result[0].Solution);
	})
	res.send('hello');
})

app.post('/signin',function(req,res){
	// console.log(req.body);
	var responseData=req.body;
	var username=responseData.username;
	var password=responseData.password;
	var sql1="SELECT id,password FROM user WHERE username=?";
	// var sql1="insert into user(username,password) values('joe','"+bcrypt.hashSync("sharp",5)+"');"

	connection.query(sql1,username,function(err,result){
		if(err) throw err;

		var resp={"key": "" };

		if(result[0]==undefined){
			//username doesnt exist
			resp={"key": "0010"};
			res.send(resp);
		}else
			if(bcrypt.compareSync(password,result[0].password)){
				console.log("passwords match");
			
				// req.session.user{
				// 	username:username ,
				// 	userid:result[0].id 
				// };
			
				// req.session.user.expires=new Date(
				// 	Date.now()+3*24*3600*1000;
				// 	);

				//successful login
				resp={"key":" 0030"};
				res.send(resp);
			}
			else{

				//passwords dont match	
				 resp={"key":"0020"};
				 res.send(resp);
			}
		})

	})

	app.post('/signup',function(req,res){
		var username=req.body.username;
		var fullname=req.body.fullname;
		var email=req.body.email;
		var password=req.body.password;
		var resp={"key": ""}

		var sql="SELECT id FROM user WHERE username=?";
		connection.query(sql,username,function(err,result){

			if(result.length>0){
				//Username exists
				resp={"key": "0040" }


// -------------------------------------------------------------------------------------
//SENDING EMAIL
				// transporter.sendMail(mailOptions,function(error,info){
				// 	if(error){
				// 		console.log("error at email "+error);
				// 	}
				// 	else{
				// 		console.log('Email Sent'+info.response);
				// 	}
				// });


				res.send(resp);

			}
			else{
				var pass=bcrypt.hashSync(password,5);
				var sql1="INSERT INTO user(username,password,email,fullname) VALUES(?,?,?,?)"
				connection.query(sql1,[username,pass,email,fullname],function(err,result){
					if(err) throw err;
					// User successfully created
					resp={
						"key": "0050"
					}
					res.send(resp);
				})
			}
		})
	})

app.listen(port,()=>console.log(`Example app listening on port ${port}!`));