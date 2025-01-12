function Init(data) {
    var no = localStorage.getItem("editno");
    var user = localStorage.getItem("username");
    var ver = 0;
    if(no !== null){ //编辑已有作品
        var proj = data.filter(item => (item.id == no));
        proj = proj[0];
        if(proj.author == user) { //访问自己的作品，可以查看最新的未发布版本
            ver = proj.private_ver;
        }
        else { //访问其他用户的作品，可以查看最新的已发布版本
            ver = proj.public_ver;
        }
        var project = `backend/projects/${no}_${ver}.sb3`;
        }
        else{ //新建作品，使用默认作品
            var project = "frontend/editor/static/project.sb3";
        }
        window.scratchConfig = {
        logo: {
            show: true,
            url: "frontend/editor/static/logo.png", //logo地址，支持base64图片
            handleClickLogo: () => {
            console.log('点击LOGO');
            }
        },
        menuBar: {
            color: 'hsla(215, 100%, 65%, 1)', //菜单栏颜色
            //新建按钮
            newButton:{
                show: true,
                handleBefore(){
                    return true;
                }
            },
            //从计算机加载按钮
            loadFileButton:{
                show: true,
                handleBefore(){
                    return true;
                }
            },
            //保存到计算机按钮
            saveFileButton:{
                show: true,
                handleBefore(){
                    return true;
                }
            },
            //加速模式按钮
            turboModeButton:{
                show: true
            },
            //教程按钮
            helpButton:{
                show: true
            }
        }, 
        shareButton: {
            show: true,
            buttonName: "分享",
            handleClick: () => {
            //点击分享按钮
                console.log('分享按钮');
                window.scratch.getProjectCover(cover => {
                //TODO 获取到作品截图
                console.log(cover);
                });
                window.scratch.getProjectFile(file => {
                //TODO 获取到项目文件
                console.log(file);
                });
                // 获取到项目名
                var projectName = window.scratch.getProjectName();
                console.log(projectName);
            }
        },
        profileButton: {
            show: true,
            buttonName: "我的作品",
            handleClick:()=>{
                //点击profile按钮
            }
        },
        blocks:{
            scale: 0.8, // 积木大小
        },
        stageArea:{ //舞台设置
            scale: 1,
            width: 480,
            height: 360,
            showControl: false, //是否显示舞台区控制按钮
            showLoading: false, //是否显示Loading
            fullscreenButton:{ //全屏按钮
                show: true,
                handleBeforeSetStageUnFull(){ //退出全屏前的操作
                    return true;
                },
                handleBeforeSetStageFull(){ //全屏前的操作
                    return true;
                }
            },
            startButton:{ //开始按钮
                show: true,
                handleBeforeStart(){ //开始前的操作
                    return true;
                }
            },
            stopButton:{ // 停止按钮
                show: true,
                handleBeforeStop(){ //停止前的操作
                    return true;
                }
            }
        },
        handleVmInitialized: (vm) => {
            window.vm = vm;
            console.log("VM初始化完毕");
        },
        handleProjectLoaded:() => {
            console.log("作品载入完毕："+project);
        },
        handleDefaultProjectLoaded:() => {
            //默认作品加载完毕，一般在这里控制项目加载
        },
        //默认项目地址,不需要修请删除本配置项
        defaultProjectURL: project,
        //若使用官方素材库请删除本配置项, 默认为/static下的素材库
        assetCDN: 'frontend/editor/static'
    }

    window.addEventListener('message', async function(event) {
        if(event.origin == `${ip}:${port}`){
            let msg = event.data;
            if(msg[0] == 'save' || msg[0] == 'release') {
                no = localStorage.getItem("editno");
                var ver = 0;
                if(no !== null) { //新建作品
                    var proj = data.filter(item => (item.id == no));
                    proj = proj[0];
                    ver = proj.private_ver + 1;
                }
                else {
                    no = msg[1];
                    localStorage.setItem("editno", no);
                }
                //创建作品文件
                vm.saveProjectSb3().then(async (result) => {
                    console.log(`${no}_${ver}.sb3`);
                    let form = new FormData();
                    form.append("file", result);
                    form.append("filename", `${no}_${ver}.sb3`);
                    await fetch('/create', {method: 'POST', body: form, headers: fileHeader});
                    window.parent.postMessage(["finish", msg[0]], `${ip}:${port}/editor`);
                });
            }
        }
    });
}

projects.then((data) => {
    Init(data);
    let lib = document.createElement('script');
    lib.src = "frontend/editor/lib.min.js";
    document.body.appendChild(lib);
    let player = document.createElement('script');
    player.src = "frontend/editor/chunks/gui.js";
    document.body.appendChild(player);
});