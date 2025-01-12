//获取所有公开作品和自己的私有作品
async function GetIndexFiles(username) {
    let response = await fetch(`${ip}:${port}/file?username=${username}`, {headers: reqHeader});
    let projects = response.json();
    return projects;
}

var projects = GetIndexFiles(page.user);