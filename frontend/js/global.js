const ip = 'http://127.0.0.1';
const port = 3000;

//前端代码默认请求头
const reqHeader = new Headers({
    'Content-type': 'application/json',
    'Authorization': 'frontend'
});

//前端传送blob的请求头
const fileHeader = new Headers({
    'Authorization': 'frontend'
});