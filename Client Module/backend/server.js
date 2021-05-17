const express=require('express')
const app=express()
const port=8080;
const bcrypt=require('bcrypt');
const session=require('express-session');
const multer=require('multer');
const path = require('path')
const {spawn} = require('child_process')

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

var code_to_be_send;
var id;
var file_name;

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
		pass:'********************'
	} 
});
//initialising the storing directory
const storage=multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'./uploads/');
	},
	filename:function(req,file,cb){
		file_name=Date.now()+"_"+file.originalname;
		cb(null,file_name);
	}
});

const fileFilter=(req,file,cb)=>{
	if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'){
		cb(null,true);
	}
	else{
		cb(null,false);
	}
};

const upload=multer({
	storage:storage,
	limits:{
		fileSize:1024*1024*5
	},
	fileFilter:fileFilter
});



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
app.post('/signin/newsearch',upload.single('image'),function(req,res,next){
	console.log("started");
	var resp={};
	var name=req.body.name;
	var age=req.body.age;
	var gender=req.body.gender;
	var image=req.body.image;
	var description=req.body.description;
	var address=req.body.address;
	var user_id=req.body.user_id;
	// var filename;
	var filename=req.file.originalname;//to be passed to python file
	var sql='INSERT INTO lost_person_details(lost_name,lost_age,user_id,lost_gender,lost_address,lost_image,lost_description) VALUES(?,?,?,?,?,?,?)'

//invoking external python file pytest.py with arguement as image filename
	function runScript(){
	  return spawn('python3', [
	    "-u", 
	    path.join(__dirname, 'eval.py'),
	    "uploads/"+file_name,
	  ]);
	}
	function myFunction(value, index, array) {
  	return value.toString();
	}

	function sendReply(){
			var variable1=variable.map(myFunction);
			var images=[];
			variable1 = variable1.filter(function(entry) { return entry.trim() != '/n'; })
			if(variable1[0][0]=='~'){
				console.log("IMAGE NOT FOUND")
					resp={
						"key": "0300"
					}
				// console.log(JSON.stringify(resp));
				res.send(resp);

			}
			else{



			for(var i=0;i<variable1.length;i++){
				var arr=[];
				var k=0;
				var image={
					name:'',
					datetime:'',
					gps:''
				};
				for(var j=0;j<variable1[i].length;j++){
					if(variable1[i][j]=='#')
						arr[k++]=j;
					else 
					if(variable1[i][j]=='$')
						arr[k++]=j;
					else
					if(variable1[i][j]=='%')
						arr[k++]=j;
				}
				arr[k]=variable1[i].length-1;
				
				var arr1=arr;
					for(var l=0;l<arr1.length-1;l++){
						var ind=arr1[l];
						var current_char=variable1[i][ind];
						if(current_char=='#'){
							image.name=variable1[i].slice(arr1[l]+1,arr1[l+1])
						}
						else 
						 if(current_char=='%'){
							image.gps=variable1[i].slice(arr1[l]+1,arr1[l+1])
						}
						else
						 if(current_char=='$'){
							image.datetime=variable1[i].slice(arr1[l]+1,arr1[l+1])
						}	
						}
				// }
				console.log("Image name "+image.name)
				console.log("Image datetime "+image.datetime)
				if(image.datetime==""){
					image.datetime="No Data Available"
				}
				if(image.gps==""){
					image.gps="No Data Available"
				}
				console.log("Image gps "+image.gps)
				images.push(image);

			}
			resp={
				"key": "0400",
				"image": images
			}
			// console.log(JSON.stringify(resp));
			res.send(resp);


		}

	}
	var variable=[];
	var counter=0;
	const subprocess = runScript()
	// print output of script
	subprocess.stdout.on('data', (data) => {
	  variable[counter++]=data;
	  // console.log("data is "+data);
	});
	subprocess.stderr.on('data', (data) => {
	  console.log(`error:${data}`);
	});
	subprocess.on('close', () => {
	  counter=-1;
	  sendReply();
	  console.log("Closed"+ "counter value ="+counter);


	});


	// connection.query(sql,[name,age,user_id,gender,address,filename,description],function(err,result){
		// if(err) throw err;
		// console.log("Insertion ID "+result.insertId);
		// if(result.insertId>0){

		// 	console.log("if condtn.")
		// 	console.log(variable)
		// 	//successful insertion
		// 	resp={"key": "0300"}
		// 	res.send(resp);
		// }
		// else {
		// 	console.log("false if condition")
		// }
	// })




})



app.listen(port,()=>console.log(`Example app listening on port ${port}!`));
