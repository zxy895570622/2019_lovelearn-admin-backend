const Koa = require('koa')
const app = new Koa()
const Router =require('koa-router')
const router=new Router()
const koas = require('koa2-cors')
const env = 'axx-czlq6'
const koaBody = require('koa-body')
//跨域
app.use(koas({
    origin:['http://localhost:9528'],
    credentials:true

}))
//接收post参数解析
app.use(koaBody({
    multipart:true
}))
app.use(async (ctx,next) => {
    console.log('全局中间件')
    ctx.state.env= env
    await next()
})
//引入
const videolist =require('./controller/videolist.js')
const swiper = require('./controller/swiper.js')
const blog = require('./controller/blog.js')
//注册中间件
router.use('/videolist',videolist.routes()) 
router.use('/swiper',swiper.routes())
router.use('/blog',blog.routes())  
app.use(router.routes())
app.use(router.allowedMethods())



app.listen(3000, () => {
    console.log('服务开启在3000端口')
})

//MVC M模型(和数据库交互) V视图(前端项目) C控制器(控制跳转)