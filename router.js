const express = require('express')
const connection = require('./model/sql')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const router = express.Router()

//登录
router.get('/search', (req, res) => {
    let sql = 'select * from user';
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//文章查询
router.post('/searchPaper', jsonParser, (req, res) => {
    const ids = req.body.id
    const page = req.body.page ? req.body.page : 0
    let sql = ''
    if (req.body = {} && !req.body.id) {
        sql = `select * from paper limit ${page*6},6`;
        let totalSql = 'select * from paper'
        connection.query(totalSql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                let num = result.length
                let allData = result
                connection.query(sql, (err, result) => {
                    if (err) {
                        console.log('错误', err)
                    } else {
                        res.send({
                            allData: allData,
                            total: num,
                            data: result
                        })
                    }
                });
            }

        })
    } else {
        // let { id } = ids
        sql = `select * from paper where id = ${ids}`;
        connection.query(sql, (err, result) => {
            if (err) {
                console.log('错误', err)
            } else {
                res.send({
                    total: result.length,
                    data: result
                })
            }
        });
    }
})


//注册
router.post('/add', jsonParser, (req, res, next) => {
    let { name, region, imgUrl } = req.body
    let sql = `insert into user (name,region, imgUrl) values('${name}','${region}','${imgUrl}')`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//发布文章
router.post('/newPaper', jsonParser, (req, res, next) => {
    let { name, title, content, imgUrl, createTime, titleKey, titleImgUrl,autherId } = req.body
    let sql = `insert into paper (auther,title,content,imgUrl,createTime,titleKey,titleImgUrl,autherId) values('${name}','${title}','${content}','${imgUrl}','${createTime}','${titleKey}','${titleImgUrl}','${autherId}')`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//清空浏览记录
router.get('/deleteWatch', (req, res) => {
    let sql = 'truncate table watch';
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//录入浏览记录
router.post('/watch', jsonParser, (req, res, next) => {
    let { lookId, paperId, caseStatus,likeStatus } = req.body
    console.log(req.body);
    let sql = `insert into watch (lookId,paperId, caseStatus,likeStatus) values('${lookId}','${paperId}','${caseStatus}','${likeStatus}')`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            console.log(result,'result');
            res.json(result)
        }
    });
})
//浏览记录
router.get('/watchInfo', (req, res) => {
    let sql = `SELECT b.* FROM watch a JOIN paper b ON a.paperId = b.id `;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//查询该记录是否存在
router.post('/isWatch', jsonParser, (req, res, next) => {
    let { paperId } = req.body
    console.log(req.body);
    let sql = `select * from watch where paperId = ${paperId}`
    connection.query(sql, (err, result) => {
        if (err) {
            res.send({
                status: 500,
            })
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//修改喜欢
router.post('/changeLikeStatus', jsonParser, (req, res) => {
    let {lookId, paperId,likeStatus} = req.body
    let sql = `update watch set likeStatus='${likeStatus}' where lookId = ${lookId} && paperId = ${paperId}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//修改喜欢
router.post('/changeCaseStatus', jsonParser, (req, res) => {
    let {lookId, paperId,caseStatus} = req.body
    let sql = `update watch set caseStatus='${caseStatus}' where lookId = ${lookId} && paperId = ${paperId}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//修改用户积分
router.post('/changeIntegral', jsonParser, (req, res) => {
    let { id, integral,type } = req.body
    let sql = `update user set integral='${type? integral + 1 : integral - 1}' where id=${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//通过id查询当前用户积分
router.post('/searchIntegral', jsonParser, (req, res) => {
    let { id } = req.body
    let sql = `select integral from user where id=${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//修改文章likes
router.post('/changeLikes', jsonParser, (req, res) => {
    let { id, likes,type } = req.body
    let sql = `update paper set likes='${type? likes + 1 : likes - 1}' where id=${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//通过id查询当前文章喜欢数
router.post('/searchLikes', jsonParser, (req, res) => {
    let { id } = req.body
    let sql = `select likes from paper where id=${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//查询积分排名前三的作者
router.get('/searchAuther', (req, res) => {
    let sql = 'SELECT * FROM user ORDER BY integral DESC LIMIT 3';
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//查询点赞排名前6的文章
router.get('/searchSixPage', (req, res) => {
    let sql = 'SELECT * FROM paper ORDER BY likes DESC LIMIT 6';
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//查询点赞排名前9的文章
router.get('/searchNinePage', (req, res) => {
    let sql = 'SELECT * FROM paper ORDER BY likes DESC LIMIT 9';
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//查询点赞排名前1的文章
router.get('/searchOnePage', (req, res) => {
    let sql = 'SELECT * FROM paper ORDER BY likes DESC LIMIT 1';
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})


//增加留言
router.post('/addinput', jsonParser, (req, res, next) => {
    let { paperId,userId,userName,content,createTime,imgUrl } = req.body
    let sql = `insert into input (paperId,userId,userName,content,createTime,imgUrl) values('${paperId}','${userId}','${userName}','${content}','${createTime}','${imgUrl}')`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//查询留言
router.post('/searchInput', jsonParser, (req, res, next) => {
    let { paperId } = req.body
    let sql = `select * from input where paperId=${paperId}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//修改用户信息
router.post('/change', jsonParser, (req, res) => {
    let { id, name, region} = req.body
    let sql = `update user set name='${name}',region='${region}' where id=${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//后台修改用户
router.post('/changeuser', jsonParser, (req, res) => {
    //通过id修改name和age属性值
    let { id, username, password, rootId, email, address, birth } = req.body
    let sql = `update user set username='${username}',password='${password}',rootId='${rootId}',email='${email}',address='${address}',birth='${birth}' where id=${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//后台修改用户积分
router.post('/changePoint', jsonParser, (req, res) => {
    //通过id修改name和age属性值
    let { id, integral } = req.body
    let sql = `update user set integral='${integral}' where id=${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//后台修改用户权限
router.post('/changeuserRoot', jsonParser, (req, res) => {
    let { id,root } = req.body
    let sql = `update user set root='${root}' where id=${id}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//后台删除用户
router.post('/deluser', jsonParser, (req, res) => {
    let { id } = req.body
    let sql = `delete from user where id=${id}`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})

//后台删除留言
router.post('/delinput', jsonParser, (req, res) => {
    let { id } = req.body
    let sql = `delete from input where id=${id}`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//前台查询展示公告
router.get('/searchHomeMsg', (req, res) => {
    let sql = `select * from message where isShow = 1`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//查询所有公告
router.get('/searchMsg', (req, res) => {
    let sql = 'SELECT * FROM message';
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//新增公告
router.post('/addMsg', jsonParser, (req, res, next) => {
    let { userId,userName,content,createTime } = req.body
    let sql = `insert into message (userId,userName,content,createTime) values('${userId}','${userName}','${content}','${createTime}')`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//后台修改公告是否显示
router.post('/changeMsg', jsonParser, (req, res) => {
    let { msgId,content,isShow } = req.body
    let sql = `update message set content='${content}',isShow='${isShow}' where msgId=${msgId}`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//查询所有公告
router.get('/changeAllMsg', (req, res) => {
    let sql = `update message set isShow='${0}' where isShow='${1}'`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//后台删除公告
router.post('/delMsg', jsonParser, (req, res) => {
    let { id } = req.body
    let sql = `delete from message where msgId=${id}`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//后台删除评论
router.post('/deleteInput', jsonParser, (req, res) => {
    let { id } = req.body
    let sql = `delete from input where id=${id}`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
//后台查询所有评论
router.get('/searchAllInput', (req, res) => {
    let sql = `select * from input`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('错误', err)
        } else {
            res.json(result)
        }
    });
})
module.exports = router