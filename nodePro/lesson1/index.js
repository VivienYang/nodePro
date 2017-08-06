/**
 * Created by PC160502 on 2017/7/27.
 */
const http=require('http');
const url=require('url');
const querystring=require('querystring');

const server=http.createServer();//����һ���½���http.Serverʵ��
server.listen(8200);//��ָ���Ķ˿��Ͻ�������

let users = [];
server.on('request',(req,res) => {
    const parseUrl=url.parse(req.url);//query��address=anhui&name=a
    console.log(parseUrl);
    //�Ӹ�true��query������{ address: 'anhui', name: 'a' }
    const parseUrl2=url.parse(req.url,true);
    console.log(parseUrl2);
    //ʹ��querystring������query����
    console.log(querystring.parse(parseUrl.query));

    if(parseUrl.path.indexOf('/user') === -1){
        res.statusCode=403;
        res.end(`${res.statusCode} not allowed`);
        return;
    }
    switch(req.method){
        case 'GET':
            //��ĳһ���ض�user����Ϣ
            //����name��ѯ/user/name
            if(parseUrl.path.indexOf('/user/') > -1){
                let username=parseUrl.path.substring(6,parseUrl.path.length);
                let user=users.find(u=>u.name === username);
                res.statusCode=200;
                res.end(JSON.stringify(user));
            }

            //����address�Ѿ�query��ѯ
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
                //ɾ��ĳһ���ض�user����Ϣ
                let username=parseUrl.path.substring(6,parseUrl.path.length);
                let index=users.findIndex(u=>u.name === username);
                console.log(`index : ${index}`);
                if(index>-1){
                    //�����ҵ����user,ɾ�����user������users
                    console.log(`users1 : ${JSON.stringify(users)}`);
                    users.splice(index,1);
                    console.log(`users2 : ${JSON.stringify(users)}`);
                    res.statusCode=200;
                    res.end(JSON.stringify(users));
                }else{
                    //�Ҳ������user,ֱ�ӷ���users
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
