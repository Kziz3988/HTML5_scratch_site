document.write(
    `<div>
        <nav class="top">
			<ul>
                <li>
                    <a id="backtoindex" style="background-image:url('/frontend/img/favicon.ico');background-size:30%;background-repeat:no-repeat;"></a>
				</li>
				<li style="background-color:#3C57C4;width:50%;">
				</li>
                <li style="background-color:#3C57C4;width:30%;">
					<input id="searchbar" placeholder="搜索作品">
				</li>
                <li>
					<a id="my" style="color:white">我的</a>
				</li>
			</ul>
		</nav>
        <nav class="right" id="online">
			<ul>
				<li>
                    <a href="/editor">开始创作</a>
				</li>
                <li>
					<a href="/myprojects">我的作品</a>
				</li>
                <li>
					<a id="logout" href="/">登出账号</a>
				</li>
			</ul>
		</nav>
        <nav class="right" id="offline">
			<ul>
                <li>
					<a id="login" style="color:white">登录账号</a>
				</li>
				<li>
                    <a id="register" style="color:white">加入我们</a>
				</li>
			</ul>
		</nav>
        <div id="registerbox" style="display:none">
            <h2 id="boxtitle" style="display:block;height:15%;padding:0 0 0 0;color:white;">注册账号<br></h2>
            <div id="regspan" class="inp">
                <span>用户名：</span>
                <span>密码：</span>
                <span>确认密码：</span>
            </div>
			<div id="logspan" class="inp">
                <span>用户名：</span>
                <span>密码：</span>
            </div>
            <div id="reginput" class="inp">
                <input id="uname" type="text" placeholder="请输入用户名">
                <input id="upass" type="password" placeholder="请输入密码">
                <input id="cpass" type="password" placeholder="请确认密码">
            </div>
			<div id="loginput" class="inp">
                <input id="lname" type="text" placeholder="请输入用户名">
                <input id="lpass" type="password" placeholder="请输入密码">
            </div>
            <button id="confirm">确认</button>
            <button id="cancel">取消</button>
            <span id="err"></span>
        </div>
		<div id="overlay"></div>
    </div>`
);