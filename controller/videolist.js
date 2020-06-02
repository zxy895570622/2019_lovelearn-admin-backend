const Router = require("koa-router");
const router = new Router()
const getAccessToken = require('../utils/getAccessToken.js')
const env = 'axx-czlq6'
const rp = require('request-promise')
const callCloudDB = require('../utils/callCloudDB.js')

//get(取数据) post(提交数据)
router.get('/list', async (ctx, next) => {
    const access_token = await getAccessToken()
    //查询视频单列表
    url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${env}&name=video`
    const options = {
        method: 'POST',
        uri: url,
        body: {
            $url: 'videolist',
            start: 0,
            count: 50
        },
        json: true // Automatically stringifies the body to JSON
    };

    const data = await rp(options)
        .then((res) => {
            //console.log(res)
            return JSON.parse(res.resp_data).data
        })
        .catch(function (err) {
            // POST failed...
        })
    ctx.body = {
        data,
        code: 20000
    }

})

router.get('/getById', async (ctx, next) => {
    const query = `db.collection('videolist').doc('${ctx.request.query.id}').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body = {
        code: 20000,
        data: JSON.parse(res.data)
    }
})
router.post('/updateVideolist',async(ctx,next)=>{
    const params = ctx.request.body
    const query = `
        db.collection('videolist').doc('${params._id}').update({
            data:{
                name: '${params.name}',
                copywriter:'${params.copywriter}'
            }
        })
    `
    const res=await callCloudDB(ctx,'databaseupdate',query)
    ctx.body={
        code:20000,
        data:res
    }
})
router.get('/del',async(ctx,next)=>{
    const params = ctx.request.query
    const query = `db.collection('videolist').doc('${params.id}').remove()`
    const res =await callCloudDB(ctx,'databasedelete',query)
    console.log(res) 
    ctx.body={
        code: 20000,
        data: res
    }
})


module.exports = router