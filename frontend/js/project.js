class ProjectPage extends WebPage {
    async UpdateInfo(item, view, like) {
        let response = await fetch(`${ip}:${port}/update?id=${item}&views=${view}&likes=${like}`, {headers: reqHeader});
        response = response.json();
        response.then((data) => {
            this.views = data.views;
            this.likes = data.likes;
            document.getElementById("view").innerHTML = "👁" + this.views;
            document.getElementById("like").innerHTML = "❤" + this.likes;
        });
    }

    constructor(ip, port) {
        super(ip, port);
        this.views = 0;
        this.likes = 0;
        async function GetProject(id, user) {
            let project = await fetch(`${ip}:${port}/project?id=${id}&username=${user}`, {headers: reqHeader});
            return project.json();
        }
        let proj = GetProject(window.location.href.split('/').pop(), this.user);
        proj.then((project) => {
            this.viewing = project.id;
            this.title = document.getElementById("project-title");
            this.isPublic = !project.is_private;
            this.title.innerHTML = project.title;
            this.author = project.author;
            this.public_ver = project.public_ver;
            this.private_ver = project.private_ver;
            if(this.isPublic) {
                this.UpdateInfo(this.viewing, 1, 0);
            }
            this.like = document.getElementById("like");
            like.onclick = () => {
                console.log(this.user);
                if(this.isPublic && this.user !== null && this.user != this.author) {
                    this.UpdateInfo(this.viewing, 0, 1);
                }
            }
            this.editorBut = document.getElementById("view-editor");
            this.editorBut.addEventListener("mouseover", function() {
                this.style.backgroundColor = "#3C72C4";
            });
            this.editorBut.addEventListener("mouseout", function() {
                this.style.backgroundColor = "#3C57C4";
            });
            this.editorBut.onclick = () => {
                if(this.author == this.user) {
                    localStorage.setItem("editno", this.viewing); //编辑作品
                }
                else {
                    localStorage.removeItem("editno"); //改编作品
                }
                window.location.href = "/editor";
            }
            this.releaseBut = document.getElementById("release");
            if(this.author == this.user && (!this.isPublic || this.public_ver != this.private_ver)) {
                this.releaseBut.style.display = "block";
                this.releaseBut.addEventListener("mouseover", function() {
                    this.style.backgroundColor = "#22B14C";
                });
                this.releaseBut.addEventListener("mouseout", function() {
                    this.style.backgroundColor = "#1A863A";
                });
            }else {
                this.releaseBut.style.display = "none";
            }
            this.releaseBut.onclick = async () => {
                await fetch(`${ip}:${port}/release?id=${this.viewing}&update=0`, {headers: reqHeader});
                localStorage.removeItem("viewing-id");
                localStorage.removeItem("editno");
                window.location.href = "/";
            }
            this.deleteBut = document.getElementById("delete");
            if(this.author === this.user) {
                this.deleteBut.style.display="block";
                this.deleteBut.addEventListener("mouseover", function() {
                    this.style.backgroundColor = "#ED1C24";
                });
                this.deleteBut.addEventListener("mouseout", function() {
                    this.style.backgroundColor = "#DF111C";
                });
            }else {
                this.deleteBut.style.display = "none";
            }
            this.deleteBut.onclick = async () => {
                await fetch(`${ip}:${port}/delete?id=${this.viewing}`, {headers: reqHeader});
                localStorage.removeItem("viewing-id");
                localStorage.removeItem("editno");
                window.location.href = "/";
            }
        }).catch(() => {
            window.location.href = "/no-such-file";
        });
    }
};

page = new ProjectPage(ip, port);