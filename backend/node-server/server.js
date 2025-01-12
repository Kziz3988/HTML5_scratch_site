const express = require('express');
const path = require('path');
const sqlite = require('sqlite3').verbose();
const fs = require('fs');
const bodyParser = require('body-parser');
const mp = require('multiparty');

const ip = 'http://127.0.0.1';
const port = 3000;
const token = 'frontend';

function ResolvePath(subdir) {
    return path.join(path.dirname(path.dirname(__dirname)), subdir);
};

class Database {
    constructor(path) {
        this.db = new sqlite.Database(path);
    }
    
    Register(username, password) { //注册
        return new Promise((resolve) => {
            this.db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, username, password, (err) => {
                if(err) {
                    resolve("用户名已存在");
                }
                else {
                    console.log(`A new user has registered: username = ${username}, password = ${password}`);
                    resolve("账号注册成功！");
                }
            });
        });
    }

    Login(username, password) { //登录
        return new Promise((resolve) => {
            this.db.get(`SELECT password FROM users WHERE username = ?`, username, (err, row) => {
                if(err) {
                    resolve("无法登录");
                }
                else if(row === null || row === undefined) {
                    resolve("用户不存在");
                }
                else if(row.password != password) {
                    resolve("密码错误");
                }
                else {
                    console.log(`A user has logged in: username = ${username}`);
                    resolve("账号登录成功！");
                }
            });
        });  
    }

    CreateProject(username, title, type) { //新建作品
        return new Promise((resolve) => {
            this.db.run(`INSERT INTO projects (title, author, is_private) VALUES(?, ?, ?)`, title, username, type, (err) => {
                if(err) {
                    resolve(false);
                }
                else {
                    console.log(`A new project has been created: title = ${title}, author = ${username}`);
                    resolve(true);
                }
            });
        });
    }

    SaveProject(id) { //保存作品
        return new Promise((resolve) => {
            this.db.run(`UPDATE projects SET private_ver = private_ver + 1 WHERE id = ?`, id, (err) => {
                if(err) {
                    resolve(false);
                }
                else {
                    console.log(`A project has been released: id = ${id}`);
                    resolve(true);
                }
            });
        });
    }

    ReleaseProject(id) { //发布作品
        return new Promise((resolve) => {
            this.db.run(`UPDATE projects SET is_private = 0, public_ver = private_ver WHERE id = ?`, id, (err) => {
                if(err) {
                    resolve(false);
                }
                else {
                    console.log(`A project has been released: id = ${id}`);
                    resolve(true);
                }
            });
        });
    }

    UpdateProjectInfo(id, views, likes) { //更新作品信息
        return new Promise((resolve) => {
            this.db.run(`UPDATE projects SET views = views + ?, likes = likes + ? WHERE id = ?`, views, likes, id, (err) => {
                if(err) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }

    GetProjectById(id) { //根据id查找作品
        return new Promise((resolve) => {
            this.db.get(`SELECT * FROM projects WHERE id = ?`, id, (err, row) => {
                if (err) {
                    resolve(null);
                }
                else {
                    resolve(row);
                }
            });
        });
    }

    GetVisibleProjects(username) { //查找指定用户可访问的作品
        return new Promise((resolve) => {
            this.db.all(`SELECT * FROM projects WHERE is_private = 0 OR author = ?`, username, (err, rows) => {
                if (err) {
                    resolve([]);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }

    DeleteProject(id) { //删除作品
        return new Promise((resolve) => {
            this.db.run(`DELETE FROM projects WHERE id = ?`, id, (err) => {
                if (err) {
                    resolve("该作品不存在");
                }
                else {
                    resolve("成功删除该作品");
                }
            });
        });
    }

    GetSequenceId(name) { //查询自增计数器，用来获取当前用户或作品的id
        return new Promise((resolve) => {
            this.db.get(`SELECT seq FROM sqlite_sequence WHERE name = ?`, name, (err, row) => {
                if (err) {
                    resolve(null);
                }
                else {
                    resolve(row);
                }
            });
        });
    }
};

class Server {
    constructor(ip, port) {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use((req, res, next) => {
            const referer = req.get('Referer');
            if(referer && (referer.includes('Scratch3.0') || referer.includes('player'))) { //处理来自编辑器的请求
                this.app.use(express.static(ResolvePath('frontend/editor')));
            }
            else {
                this.app.use(express.static(ResolvePath('')));
            }
            next();
        });
        this.db = new Database(path.join(ResolvePath('backend/sqlite-db'), 'site.db'));
        this.app.post('/create', (req, res) => { //将前端发送的blob保存为作品文件
            const reqToken = req.get('Authorization');
            if(!reqToken || reqToken !== token) { //权限不足，返回403错误
                res.status(403);
                res.send('404 Forbidden');
            }
            else {
                let form = new mp.Form();
                form.parse(req, function(err, data, file) {
                    let project = file.file[0];
                    const reader = fs.createReadStream(project.path);
                    const fileStream = fs.createWriteStream(path.join(ResolvePath('backend/projects'), data.filename[0]));
                    reader.pipe(fileStream);
                    res.status(200);
                    res.send('成功创建作品文件');
                });
            }
        });
        this.app.get('/', (req, res) => { //主页
            res.status(200);
            res.sendFile(path.join(ResolvePath('frontend/html'), 'index.html'));
        });
        this.app.get('/project/:id', async (req, res) => { //作品页
            res.status(200);
            res.sendFile(path.join(ResolvePath('frontend/html'), 'project.html'));
        });
        this.app.get('/:link', async (req, res) => {
            const page = req.params.link;
            if(page == 'search') { //搜索页
                res.status(200);
                res.sendFile(path.join(ResolvePath('frontend/html'), 'search.html'));
            }
            else if(page == 'myprojects') { //我的作品
                res.status(200);
                res.sendFile(path.join(ResolvePath('frontend/html'), 'myprojects.html'));
            }
            else if(page == 'editor') { //编辑作品
                res.status(200);
                res.sendFile(path.join(ResolvePath('frontend/html'), 'editor.html'));
            }
            else if(page == 'Scratch3.0') { //编辑器
                res.status(200);
                res.sendFile(path.join(ResolvePath('frontend/editor'), 'index.html'));
            }
            else if(page == 'player') { //播放器
                res.status(200);
                res.sendFile(path.join(ResolvePath('frontend/editor'), 'player.html'));
            }
            else { //网页跳转以外的请求，需要验证
                const reqToken = req.get('Authorization');
                if(!reqToken) { //认为请求来自浏览器导航栏，返回404错误
                    res.status(404);
                    res.send('404 Page Not Found');
                }
                else if(reqToken !== token) { //验证失败，返回403错误
                    res.status(403);
                    res.send('403 Forbidden');
                }
                else { //验证成功
                    if(page == 'login') { //登录
                        let username = req.query.username;
                        let password = req.query.password;
                        let msg = await this.db.Login(username, password);
                        res.status(200);
                        res.send(msg);
                    }
                    else if(page == 'register') { //注册
                        let username = req.query.username;
                        let password = req.query.password;
                        let msg = await this.db.Register(username, password);
                        res.status(200);
                        res.send(msg);
                    }
                    else if(page == 'file') { //获取可访问的作品
                        let username = req.query.username;
                        let msg = await this.db.GetVisibleProjects(username);
                        res.status(200);
                        res.send(msg);
                    }
                    else if(page == 'mystuff') { //获取我的作品
                        let username = req.query.username;
                        let msg = await this.db.GetVisibleProjects(username);
                        msg = msg.filter(item => (item.author == username));
                        res.status(200);
                        res.send(msg);
                    }
                    else if(page == 'project') { //获取作品信息
                        let id = req.query.id;
                        let user = req.query.username;
                        let msg = await this.db.GetProjectById(id);
                        if(msg) { //作品存在
                            if(msg.is_private == 0 || msg.author == user) { //作品可以查看
                                res.status(200);
                                res.send(msg);
                            }
                            else { //作品不可查看
                                res.status(403);
                                res.send('403 Forbidden'); 
                            }
                        }
                        else { //作品不存在
                            res.status(404);
                            res.send('404 Page Not Found');
                        }
                    }
                    else if(page == 'searchfile') { //搜索作品
                        let username = req.query.username;
                        let search = req.query.search;
                        let msg = await this.db.GetVisibleProjects(username);
                        msg = msg.filter(item => (item.title.search(search) != -1 || item.author.search(search) != -1)); //作品标题或作者用户名包含查询字符串
                        res.status(200);
                        res.send(msg);
                    }
                    else if(page == 'update') { //更新作品信息
                        let id = req.query.id;
                        let views = +req.query.views;
                        let likes = +req.query.likes;
                        let success = await this.db.UpdateProjectInfo(id, views, likes);
                        if(success) {
                            let msg = await this.db.GetProjectById(id);
                            res.status(200);
                            res.send(msg);
                        }
                        else {
                            res.status(200);
                            res.send(null);
                        }
                    }
                    else if(page == 'upload') { //新建作品
                        let user = req.query.username;
                        let title = req.query.title;
                        let type = req.query.savetype;
                        let msg = await this.db.CreateProject(user, title, type);
                        res.status(200);
                        res.send(msg);
                    }
                    else if(page == 'release') { //发布作品
                        let id = req.query.id;
                        let update = req.query.update;
                        if(update == 1) { //更新并发布（在编辑器页）
                            let msg = await this.db.SaveProject(id);
                            if(msg == '作品已保存') {
                                msg = await this.db.ReleaseProject(id);
                                res.status(200);
                                res.send(msg);
                            }
                            else {
                                res.status(200);
                                res.send(msg);
                            }
                        }
                        else { //直接发布（在作品页）
                            let msg = await this.db.ReleaseProject(id);
                            res.status(200);
                            res.send(msg);
                        }
                    }
                    else if(page == 'save') { //保存作品
                        let id = req.query.id;
                        let msg = await this.db.SaveProject(id);
                        res.status(200);
                        res.send(msg);
                    }
                    else if(page == 'delete') { //删除作品
                        let id = req.query.id;
                        let msg = await this.db.DeleteProject(id);
                        //删除所有版本的文件
                        fs.readdir(ResolvePath('backend/projects'), (err, files) => {
                            if(err) {
                                return err;
                            }
                            else {
                                files.forEach((file) => {
                                    let filename = path.basename(file);
                                    let no = filename.split('_');
                                    if(no[0] == id) {
                                        fs.unlink(path.join(ResolvePath('backend/projects'), file), ()=> {});
                                    }
                                });
                            }
                        });
                        res.status(200);
                        res.send(msg);
                    }
                    else if(page == 'id') { //查询id
                        let name = req.query.name;
                        let msg = await this.db.GetSequenceId(name);
                        console.log(msg);
                        res.status(200);
                        res.send(msg);
                    }
                    else { //请求无法解析，返回400错误
                        res.status(400);
                        res.send('400 Bad Request');
                    }
                }
            }
                
        });

        this.server = this.app.listen(port, function() {
            console.log(`Server is running on ${ip}:${port}`);
        });
    }
};

const server = new Server(ip, port);