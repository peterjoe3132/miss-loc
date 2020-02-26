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

var code_to_be_send;
var id;

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

		var resp={"key": "",
		'user_id': ""};

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
				 
				resp={"key":"0030",
				user_id:result[0].id};
				res.send(resp);
			}
			else{

				//passwords dont match	
				 resp={"key":"0020"}
				 res.send(JSON.stringify(resp));
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

	app.post('/forgotemail',function(req,res){
		var email=req.body.email;
	    code_to_be_send = Math.floor((Math.random() * 1000000) + 1);
		var resp={'key': ""}
		if(check==1){
			var sql='select id,username,email from user where email=?'
			connection.query(sql,email,function(err,result){
				if(err) throw err;

				if(result.length <1 ){
					//email doesn't exist
					resp={'key': "0060" };
					res.send(resp);
				}
				else{
					//email exists.
					id=result[0].id;
					resp={'key': "0070" }
					var mailOptions={
						from: "peterjoep@yahoo.com",
						to:result[0].email,
						subject:'Password Reset Request for username-'+result[0].username,
						text:'Please enter the code on the Forgot Password Page '+ code_to_be_send
					}

					transporter.sendMail(mailOptions,function(error,info){
						if(error){
							console.log("error at email "+error);
						}
						else{
							console.log('Email Sent'+info.response);
							res.send(resp);
						}
					});
				}
			})
		}
	})

	app.post('/forgotcode',function(req,res){
		var code=req.body.code;
		var resp={'key': "" }
		console.log(code +"  "+code_to_be_send)
		if(code==code_to_be_send){
			//code matches
			resp={'key': "0080" }
			res.send(resp);
		}else{
			//invalid code
			resp={'key': "0090" }
			res.send(resp);
		}

	})

	app.post('/forgotpassword',function(req,res){
		var password=req.body.password;
		var resp={'key': "" }
		var pass=bcrypt.hashSync(password,5);
		var sql='UPDATE user SET password=? WHERE id=?'
		connection.query(sql,[pass,id],function(err,result){
			if(err) throw err;

			if(result.affectedRows>0){
				//update successful
				resp={'key': "0100" }
				res.send(resp);
			}
			else{
				resp={'key': "0200" }
				res.send(resp);
			}
		})
	})
app.post('/signin/newsearch',function(req,res){
	var resp={'key': ""};
	var name=req.body.name;
	var age=req.body.age;
	var gender=req.body.gender;
	var image=req.body.image;
	var description=req.body.description;
	var address=req.body.address;
	var user_id=req.body.user_id;
	console.log(req.body);

	var sql='INSERT INTO lost_person_details(lost_name,lost_age,user_id,lost_gender,lost_address,lost_image,lost_description) VALUES(?,?,?,?,?,?,?)'
	connection.query(sql,[name,age,user_id,gender,address,image,description],function(err,result){
		if(err) throw err;
		console.log(result.insertId);
		if(result.insertId>0){
			//successful insertion
			resp={"key": "0300"}
			res.send(resp);
		}
	})


})



app.listen(port,()=>console.log(`Example app listening on port ${port}!`));