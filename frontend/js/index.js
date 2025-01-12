class WebPage {
    constructor(ip, port) {
        this.my = document.getElementById("my");
        this.onbar = document.getElementById("online");
        this.offbar = document.getElementById("offline");
        this.overlay = document.getElementById("overlay");
        this.onbar.style.display="none";
        this.offbar.style.display="none";
        this.overlay.style.display="none";
        this.login = document.getElementById("login");
        this.logout = document.getElementById("logout");
        this.reg = document.getElementById("register");
        this.regbox = document.getElementById("registerbox");
        this.regspan = document.getElementById("regspan");
        this.reginput = document.getElementById("reginput");
        this.logspan = document.getElementById("logspan");
        this.loginput = document.getElementById("loginput");
        this.conf = document.getElementById("confirm");
        this.canc = document.getElementById("cancel");
        this.err = document.getElementById("err");
        this.back = document.getElementById("backtoindex");
        this.user = localStorage.getItem("username");
        this.logtype = 0;

        this.back.addEventListener("click", () => {
            localStorage.removeItem("editno");
            window.location.href = "/";
        });

        if(this.user === null) {
            this.my.innerHTML = "账号";
        }else {
            this.my.innerHTML = "我的";
        }

        this.my.addEventListener("mouseover", () => {
            if(this.user === null) {
                this.my.innerHTML = "账号";
                this.offbar.style.display = "block";
            }else {
                this.my.innerHTML = "我的";
                this.onbar.style.display = "block";
            }
        });
        window.addEventListener("click", () => {
            if(this.user === null){
                this.my.innerHTML = "账号";
                this.offbar.style.display = "none";
            }else{
                this.my.innerHTML = "我的";
                this.onbar.style.display = "none";
            }
        });
        this.conf.onclick = () => {
            if(this.logtype == 0) {
                var uname = document.getElementById("uname").value;
                var upass = document.getElementById("upass").value;
                var cpass = document.getElementById("cpass").value;
                if(upass != cpass) {
                    this.err.innerHTML = "确认密码错误";
                }else if(uname.length == 0) {
                    this.err.innerHTML = "用户名不能为空";
                }else if(upass.length == 0) {
                    this.err.innerHTML = "密码不能为空";
                }else {
                    fetch(`${ip}:${port}/register?username=${uname}&password=${upass}`, {headers: reqHeader}).then((response) => {
                        response.text().then((msg) => {
                            if (msg == "账号注册成功！") {
                                this.err.innerHTML = msg;
                                localStorage.setItem("username", uname);
                                setTimeout(() => {
                                    localStorage.removeItem("editno");
                                    this.regbox.style.display = "none";
                                    window.location.href = window.location.href;
                                }, 1000);
                            }
                            else {
                                this.err.innerHTML = msg;
                            }
                        }); 
                    });
                }
            }else {
                var lname = document.getElementById("lname").value;
                var lpass = document.getElementById("lpass").value;
                fetch(`${ip}:${port}/login?username=${lname}&password=${lpass}`, {headers: reqHeader}).then((response) => {
                    response.text().then((msg) => {
                        if (msg == "账号登录成功！") {
                            this.err.innerHTML = msg;
                            localStorage.setItem("username", lname);
                            setTimeout(() => {
                                localStorage.removeItem("editno");
                                this.regbox.style.display = "none";
                                window.location.href = window.location.href;
                            }, 1000);
                        }
                        else {
                            this.err.innerHTML = msg;
                        }
                    }); 
                });
            }
            
        }
        this.reg.onclick = () => {
            this.logtype = 0;
            this.regbox.style.display = "block";
            this.overlay.style.display = "block";
            document.getElementById("boxtitle").innerHTML = "注册账号";
            document.getElementById("regspan").style.display = "inline";
            document.getElementById("reginput").style.display = "inline";
            document.getElementById("logspan").style.display = "none";
            document.getElementById("loginput").style.display = "none";
            document.getElementById("uname").value = null;
            document.getElementById("upass").value = null;
            document.getElementById("cpass").value = null;
            this.err.innerHTML = "";
        }
        this.canc.onclick = () => {
            this.regbox.style.display = "none";
            this.overlay.style.display = "none";
        }
        this.login.onclick = () => {
            this.logtype = 1;
            this.regbox.style.display = "block";
            this.overlay.style.display = "block";
            document.getElementById("boxtitle").innerHTML = "登录账号";
            document.getElementById("regspan").style.display = "none";
            document.getElementById("reginput").style.display = "none";
            document.getElementById("logspan").style.display = "inline";
            document.getElementById("loginput").style.display = "inline";
            document.getElementById("lname").value = null;
            document.getElementById("lpass").value = null;
            this.err.innerHTML = "";
        }
        this.logout.onclick = () => {
            localStorage.removeItem("editno");
            localStorage.removeItem("username");
            window.location.href = "/";
        }
        document.addEventListener('keyup', (event) => {
            if(event.key == 'Enter' && event.target.id == "searchbar") {
                localStorage.setItem("search", document.getElementById("searchbar").value);
                localStorage.removeItem("editno");
                window.location.href = "/search";
            }
        });
    }
};

var page = new WebPage(ip, port);