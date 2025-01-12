//获取所有符合搜索结果的公开作品和自己的私有作品
async function GetIndexFiles(username, search) {
    let response = await fetch(`${ip}:${port}/searchfile?username=${username}&search=${search}`, {headers: reqHeader});
    let projects = response.json();
    return projects;
}

let search = localStorage.getItem("search");
var projects = GetIndexFiles(page.user, search);