class EditorPage {
    async UploadProject(ip, port, user, title, savetype) {
        let type = ['save', 'release'];
        let id = await fetch(`${ip}:${port}/id?name=projects`, {headers: reqHeader});
        id = id.json();
        id.then(async (data) => {
            this.no = data.seq + 1;
            this.iframe.contentWindow.postMessage([type[savetype], this.no], `${ip}:${port}/editor/index.html`);
            let response = await fetch(`${ip}:${port}/upload?username=${user}&title=${title}&savetype=${savetype}`, {headers: reqHeader});
            return response.json();
        });
    }
    async SaveProject(ip, port, id) {
        this.iframe.contentWindow.postMessage(['save', id], `${ip}:${port}/editor/index.html`);
        let response = await fetch(`${ip}:${port}/save?id=${id}`, {headers: reqHeader});
        return response.json();
    }
    async ReleaseProject(ip, port, id) {
        this.iframe.contentWindow.postMessage(['release', id], `${ip}:${port}/editor/index.html`);
        let response = await fetch(`${ip}:${port}/release?id=${id}&update=1`, {headers: reqHeader});
        return response.json();
    }

    constructor(ip, port) {
        this.my = document.getElementById("my");
        this.onbar = document.getElementById("online");
        this.overlay = document.getElementById("overlay");
        this.onbar.style.display="none";
        this.overlay.style.display="none";
        this.logout = document.getElementById("logout");
        this.regbox = document.getElementById("registerbox");
        this.boxtitle = document.getElementById("boxtitle");
        this.logspan = document.getElementById("logspan");
        this.loginput = document.getElementById("loginput");
        this.conf = document.getElementById("confirm");
        this.canc = document.getElementById("cancel");
        this.err = document.getElementById("err");
        this.save = document.getElementById("save");
        this.release = document.getElementById("release");
        this.back = document.getElementById("backtoindex");
        this.user = localStorage.getItem("username");
        if(this.user === null) {
            window.location.href = '/';
        }
        this.no = localStorage.getItem("editno");
        this.savetype = 0;
        this.iframe = document.getElementById("ifra");
        window.addEventListener('message', async function(event) {
            if(event.origin == `${ip}:${port}`){
                let msg = event.data;
                if(msg[0] == "finish") {
                    if(msg[1] == "release") {
                        this.no = localStorage.getItem("editno");
                        localStorage.setItem("viewing-id", this.no);
                        localStorage.removeItem("editno");
                        window.location.href = `/project/${this.no}`;
                    }
                    else {
                        window.location.href = window.location.href;
                    }
                }
            }
        });
        this.back.addEventListener("click", () => {
            localStorage.removeItem("viewing-id");
            localStorage.removeItem("editno");
            window.location.href = "/";
        });
        this.my.addEventListener("mouseover", () => {
            this.my.innerHTML = "我的";
            this.onbar.style.display = "block";
        });
        window.addEventListener("click", () => {
            this.my.innerHTML = "我的";
            this.onbar.style.display = "none";
        });
        this.logout.onclick = () => {
            localStorage.removeItem("viewing-id");
            localStorage.removeItem("editno");
            localStorage.removeItem("username");
            window.location.href = "/";
        }
        this.save.onclick = () => {
            if(this.no === null) { //保存新作品
                this.savetype = 0;
                this.boxtitle.innerHTML = "保存作品";
                this.regbox.style.display = "block";
                this.overlay.style.display = "block";
                document.getElementById("ptitle").value = "";
                this.err.innerHTML = "";
            }else{ //保存新版本
                this.SaveProject(ip, port, this.no);
            }
        }
        this.release.onclick = () => {
            if(this.no === null) { //发布新作品
                this.savetype = 1;
                this.boxtitle.innerHTML = "发布作品";
                this.regbox.style.display = "block";
                this.overlay.style.display = "block";
                document.getElementById("ptitle").value = "";
                this.err.innerHTML = "";
            }else { //发布新版本
                this.ReleaseProject(ip, port, this.no);
            }
        }
        this.conf.onclick = () => {
            var title = document.getElementById("ptitle").value;
            if(title.length == 0) {
                this.err.innerHTML = "作品名不能为空";
            }else {
                if(this.savetype == 0) {
                    this.UploadProject(ip, port, this.user, title, 0).then(() => {
                        this.err.innerHTML = "作品保存成功！";
                        setTimeout(() => {
                            this.regbox.style.display = "none";
                            this.overlay.style.display = "none";
                        }, 1000);
                    });
                }else {
                    this.UploadProject(ip, port, this.user, title, 1).then(() => {
                        err.innerHTML="作品发布成功！"
                        setTimeout(() => {
                            this.regbox.style.display = "none";
                            this.overlay.style.display = "none";
                        }, 1000);
                    });
                }
            }
        }
        this.canc.onclick = () => {
            this.regbox.style.display = "none";
            this.overlay.style.display = "none";
        }
    }
};

var page = new EditorPage(ip, port);