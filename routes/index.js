const express = require('express');
const router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var mysql=require('../config/mysql.js')
var connection=mysql


connection.connect()

/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('select num from num where id = 0',(err,rows)=>{
    if(err){
      res.status(503)
      res.end()
    }
    else{
      let num=rows[0].num
      num++
      console.log(num)
      connection.query('update num set num ='+num+' where id = 0')
      connection.query('INSERT INTO ip (ip) VALUES (?)',[req.ip],(err,rows)=>{
        if(err)throw err
      })
      res.json({id:num})
      // res.render('index', { title: 'Express' });
    }
  })

});

router.get('/info',function (req,res,next) {
  connection.query('select num from num where id = 0', (err, rows) => {

    let numb = rows[0].num
    console.log(numb)
    res.json({num: numb, ip: req.ip})
  })
});

router.post('/upload',multipartMiddleware,function (req,res,next) {
  console.log(req.body)
  let nickname=req.body.nickname
  let msg =req.body.message
  let email=req.body.email
  if(!nickname||!msg||!email){
    res.status(400)
    res.json({code:400,message:'bad request'})
  }else {
    connection.query('INSERT INTO message (`nickname`, `email`, `message`, `ip`) VALUES (?,?,?,?);',
        [nickname,email,msg,req.ip], (err,row) => {
      if (err) {
        res.status(500)
        res.json({err: err})
      } else {
        res.status(200)
        res.json({message:'成功'})
      }
    })
  }

})


module.exports = router;
