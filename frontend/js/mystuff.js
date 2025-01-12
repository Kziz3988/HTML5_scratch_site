//获取所有自己的作品
async function GetUserFiles(username) {
    let response = await fetch(`${ip}:${port}/mystuff?username=${username}`, {headers: reqHeader});
    let projects = response.json();
    return projects;
}

var projects = GetUserFiles(page.user);