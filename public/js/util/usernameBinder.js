
$(function() {
	
	var user = JSON.parse($.cookie('user'));
	var userName;
	if (!user) {
		userName = 'no name';
		$('login-username').text(userName);
		return;
	}

	userName = !user.userName ? 'no name' : user.userName;
	$('login-username').text(userName);
});
