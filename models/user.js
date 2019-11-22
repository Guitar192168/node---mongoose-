var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 连接数据库
mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true });

var userSchema = new Schema({
	email:{
		type:String,
		required: true,
	},
	nickname:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	created_time:{
		type:Date,
		// 注意：这里不要写Data.now()因为会即刻调用
		// 这里直接给了一份方法 ：Data.now方法
		// 当你去 new Model 的时候，如果你没有传递create_time ，则mongoose就会调用指定default指定的Date.now
		// 方法，使用其返回值作为默认值
		default:Date.now
	},
	last_modified_time:{
		type:Date,
		default:Date.now
	},
	avatar:{
		type:String,
		default:'/public/img/avatar-defalut.png'
	},
	bio:{
		type:String,
		default:''
	},
	gender:{
		type:Number,
		enum:[-1, 0, 1], //保密
		default:-1
	},
	birthday:{
		type:Date
	},
	status:{
		type:Number,
		// 0  没有权限评论
		// 1 不可以评论
		// 2 不可以登录
		enum:[0, 1, 2],
		default:0
	}

})


module.exports = mongoose.model('User',userSchema)