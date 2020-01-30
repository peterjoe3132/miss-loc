const express=require('express')
const app=express()
const port=8080;
const bcrypt=require('bcrypt');
const session=require('express-session');


var mysql=require('mysql')
var cors=require('cors')
var bodyParser=require('body-parser');

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

app.get('/',function(req,res){
	connection.query('select 1+1 AS Solution',function(err,result,fields){
		if(err) throw err;

		console.log("Solution is "+result[0].Solution);
	})
	res.send('hello');
})

app.post('/signin',function(req,res){
	console.log(req.body);
	var responseData=req.body;
	var username=responseData.username;
	var password=responseData.password;
	var sql1="SELECT id,password FROM user WHERE username=?";
	// var sql1="insert into user(username,password) values('joe','"+bcrypt.hashSync("sharp",5)+"');"

	connection.query(sql1,username,function(err,result){
		if(err) throw err;


		var resp={"key": "" };

		if(result[0]==undefined){
			resp={"key": "username doesn't exist "};
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
				resp={"key":"You are logged in , Welcome ! "};
				res.send(resp);
			}
			else{
				 resp={"key":" Incorrect password"};
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

		console.log('new user')
		var sql="SELECT id FROM user WHERE username=?";
		connection.query(sql,username,function(err,result){

			if(result.length>0){
				resp={"key": "Username Exists" }
				res.send(resp);
			}
			else{
						console.log('new user')

				var pass=bcrypt.hashSync(password,5);
				var sql1="INSERT INTO user(username,password,email,fullname) VALUES(?,?,?,?)"
				connection.query(sql1,[username,pass,email,fullname],function(err,result){
					if(err) throw err;
					// console.log("number of affected rows-"+result.affectedRows);
					resp={
						"key": "User successfully created"
					}
					res.send(resp);
				})
			}
		})
	})

app.listen(port,()=>console.log(`Example app listening on port ${port}!`));