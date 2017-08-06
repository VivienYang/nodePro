/**
 * Created by PC160502 on 2017/7/27.
 */
const http=require('http');
const url=require('url');
const querystring=require('querystring');

const server=http.createServer();//返回一个新建的http.Server实例
server.listen(8200);//在指定的端口上接受连接

let users = [];
server.on('request',(req,res) => {
    const parseUrl=url.parse(req.url);//query是address=anhui&name=a
    console.log(parseUrl);
    //加个true将query解析成{ address: 'anhui', name: 'a' }
    const parseUrl2=url.parse(req.url,true);
    console.log(parseUrl2);
    //使用querystring方法将query解析
    console.log(querystring.parse(parseUrl.query));

    if(parseUrl.path.indexOf('/user') === -1){
        res.statusCode=403;
        res.end(`${res.statusCode} not allowed`);
        return;
    }
    switch(req.method){
        case 'GET':
            //查某一个特定user的信息
            //根据name查询/user/name
            if(parseUrl.path.indexOf('/user/') > -1){
                let username=parseUrl.path.substring(6,parseUrl.path.length);
                let user=users.find(u=>u.name === username);
                res.statusCode=200;
                res.end(JSON.stringify(user));
            }

            //根据address已经query查询
            let query=parseUrl2.query;
            if(query.address){
                let found = users.filter(u=>u.address === query.address);
                res.end(JSON.stringify(found));
            }else{
                res.statusCode=200;
                res.end(JSON.stringify(users));
            }

            break;
        case 'POST':
            let user='';
            req.on('data',(buffer)=>{
                const userStr = buffer.toString();
                let CT=req.headers['content-type'];
                if(CT === 'application/json'){
                    user = JSON.parse(userStr);
                    users.push(user);
                }
                res.statusCode=201;
            });
            req.on('end',() => {
                res.statusCode=201;
                res.end('Great! User created!')
            });
            break;
        case 'PATCH':
            //console.log(parseUrl);
            console.log(`request params is ${req.params}`);
            let username=parseUrl.path.substring(6,parseUrl.path.length);
            console.log(username);

            req.on('data',(buffer)=>{
                const userStr = buffer.toString();
                let CT=req.headers['content-type'];
                if(CT === 'application/json'){
                    let update=JSON.parse(userStr);
                    console.log(update);
                    let user=users.find(u=>u.name === username);
                    user.address=update.address;
                }
                res.statusCode=201;
            });
            req.on('end',() => {
                res.statusCode=201;
                res.end('Great! User updated!')
            });
            break;
        case 'DELETE':
            if(parseUrl.path.indexOf('/user/') > -1){
                //删除某一个特定user的信息
                let username=parseUrl.path.substring(6,parseUrl.path.length);
                let index=users.findIndex(u=>u.name === username);
                console.log(`index : ${index}`);
                if(index>-1){
                    //可以找到这个user,删了这个user，返回users
                    console.log(`users1 : ${JSON.stringify(users)}`);
                    users.splice(index,1);
                    console.log(`users2 : ${JSON.stringify(users)}`);
                    res.statusCode=200;
                    res.end(JSON.stringify(users));
                }else{
                    //找不到这个user,直接返回users
                    res.statusCode=200;
                    res.end(JSON.stringify(users));
                }
            }else{
                res.statusCode=200;
                res.end(JSON.stringify(users));
            }

            break;
        default :
            users.method='others';
            res.statusCode=200;
            res.end(JSON.stringify(users));
    }
});
