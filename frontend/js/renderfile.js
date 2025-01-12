function RenderFile(projects) {
    for(let i = 0; i < projects.length; i++) {
        let project = document.createElement('div');
        project.className = "project";
        project.style.left = i % 5 * 15 + 1 + "vw";
        project.style.top = Math.floor(i / 5) * 25 + 5 + "vw";
        project.onclick = function() {
            localStorage.setItem("viewing-id", projects[i].id);
            window.location.href = `/project/${projects[i].id}`;
        };
        project.addEventListener("mouseover",function() {
            this.className = "project scaled";
        });
        project.addEventListener("mouseout",function() {
            this.className = "project";
        });
        let title = document.createElement('span');
        let author = document.createElement('span');
        let private = document.createElement('span');
        let cover = document.createElement('img');
        let views = document.createElement('span');
        let likes = document.createElement('span');
        title.className = "projectinfo title";
        author.className = "projectinfo author";
        private.className = "projectinfo privateinfo";
        cover.className = "cover";
        views.className = "projectinfo views";
        likes.className = "projectinfo likes";
        title.innerHTML = projects[i].title;
        author.innerHTML = "✏️" + projects[i].author;
        private.innerHTML = "私有作品";
        if(projects[i].is_private == 1) {
            private.style.display = "block";
        }else {
            private.style.display = "none";
        }
        cover.src = "/frontend/img/default-cover.png";
        views.innerHTML = "👁" + projects[i].views;
        likes.innerHTML = "❤" + projects[i].likes;
        document.body.appendChild(project);
        project.appendChild(title);
        project.appendChild(author);
        project.appendChild(private);
        project.appendChild(cover);
        project.appendChild(views);
        project.appendChild(likes);
    }
}

projects.then((data) => {
    RenderFile(data);
});