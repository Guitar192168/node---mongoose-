var express = require('express')
var User = require('./models/user')
var md5  = require('blueimp-md5')



var router = express.Router()

router.get('/',function(req,res){
	// console.log(req.session.user)
	res.render('index.html',{
		user:req.session.user
	})
})


router.get('/login',function(req,res){
	res.render('login.html')
})

router.post('/login',function(req,res){
	// 1.获取表单数据
	// 2.查询数据库 用户名，密码是否正确
	// 3.发送响应数据
	// console.log(req.body)
	var body = req.body

	User.findOne({
		email:body.email,
		password:md5(md5(body.password))
	},function(err, user){
		if(err){
			return res.status(500).json({
				err_code:500,
				message:err.message
			})
		}

		if(!user){
			return res.status(200).json({
				err_code:1,
				message:'Email or password is invalid'
			})
		}

		// 用户存在，登陆成功，通过Session记录登陆状态
		res.session.user = user
		res.status(200).json({
			err_code:0,
			message:'ok'
		})
	})
})

router.get('/register',function(req,res){
	res.render('register.html')
})


router.post('/register',function(req,res){
	// 1.获取表单提交的数据
	//   req.body
	// 2.操作数据库
	// 判断该用户是否存在，如果已存在，不允许注册
	// 如果不存在，注册新建用户
	// 3.发送响应

	// 用find查，即便只有一个，也给存在数组里
	var body = req.body
	User.findOne({
		$or:[
		{
			email:body.email
		},
		{
			nickname:body.nickname
		}
		]
	},function(err, data){
		if(err){
			return res.status(500).json({
				success:false,
				message:'服务端错误'
			})
		}
		// console.log(data)
		if(data){
			// 邮箱或者昵称已存在
			// return res.status(200).json({
			// 	err_code:1,
			// 	message:'Email or nickname already exists.'
			// })
			return res.render('register.html',{
				err_message:'邮箱或密码已存在',
				form:body
			})
		}

		// 对密码进行 md5 重复加密
		body.password = md5(md5(body.password))

		new User(body).save(function(err,user){
			if(err){
				return res.status(500),json({
					err_code:500,
					message:'Internal error'
				})
			}

			// 注册成功，使用Session记录用户的登陆状态
			req.session.user = user

			// json格式的字符串
			// express 提供了一个响应方法：json
			// 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
			res.status(200).json({
				err_code:0,
				message:'ok'
			})
		})

		// 服务端重定向只针对同步请求有效，异步请求无效

		// console.log('ok')

		
	})
})

router.get('/logout',function(req,res){
	// 清除登陆状态
	// 重定向到登录页
	req.session.user = null

	res.redirect('/login')
})


module.exports  = router