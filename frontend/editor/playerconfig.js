function Init(data) {
    var no = localStorage.getItem("viewing-id");
    var user = localStorage.getItem("username");
    if(no !== null) {
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
    else {
        var project = "frontend/editor/static/project.sb3";
    }
    window.scratchConfig = {
        stageArea:{
            scale: window.innerWidth / 480,
            width: 480,
            height: 360,
            showControl: true, //是否显示舞台区控制按钮
            showLoading: false, //是否显示Loading
            fullscreenButton:{ //全屏按钮
                show: true,
                handleBeforeSetStageUnFull(){ //退出全屏前的操作
                    return true
                },
                handleBeforeSetStageFull(){ //全屏前的操作
                    return true
                }
            },
            startButton:{ //开始按钮
                show: true,
                handleBeforeStart(){ //开始前的操作
                    return true
                }
            },
            stopButton:{ // 停止按钮
                show: true,
                handleBeforeStop(){ //停止前的操作
                    return true
                }
            }
        },
        handleVmInitialized: (vm) => {
            window.vm = vm
            console.log("VM初始化完毕")
        },
        handleProjectLoaded:() => {
            console.log("作品载入完毕")
        },
        handleDefaultProjectLoaded:() => {
            //默认作品加载完毕，一般在这里控制项目加载
        },
        //默认项目地址,不需要修请删除本配置项
        defaultProjectURL: project,
    }
}
  
projects.then((data) => {
    Init(data);
    let lib = document.createElement('script');
    lib.src = "frontend/editor/lib.min.js";
    document.body.appendChild(lib);
    let player = document.createElement('script');
    player.src = "frontend/editor/chunks/player.js";
    document.body.appendChild(player);
});