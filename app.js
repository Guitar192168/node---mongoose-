var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var router = require('./router')

var app = express()


// 把原来的相对路径改成绝对路径
app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))

app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views/'))//默认就是 ./views/目录

// 配置解析表单请求体插件(注意：一定要在app.use(router))之前
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


// 在Express这个框架照片那个，默认不支持Session和Cookie
// 但是我们可以使用第三方中间件：express-session来解决
// 1. npm install express-session
// 2.配置(一定要在app.use(router)之前)
// 3.使用
// 当把这个插件配置好之后，我们就可以通过req.session来访问和设置Session成员了
// 添加Session数据:req.session.foo ='bar'
// 访问Session数据  res.session.foo

app.use(session({
	//配置加密字符串，它会在原有加密基础之上和这个字符串拼接起来去加密
	// 目的是为了增加安全性，防止客户端恶意伪造
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true  //无论你是否使用Session，我都默认直接给你分配一把钥匙
}))

// 把路由挂载到app中
app.use(router)



app.listen(5000,function(){
	console.log('running...')
})

