/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * Validates token in homepage and determine if user is going to be staying
 * in the homepage of redirected to the login page
 */
app.validatesToken(function () {
    // If token exists and is not expired, setup application page header include logout logic
    $(function () {
        // Grab the user name from the token
        var userName = app.username.replace(/\@.*/, '');
        $('header .username').html(userName.charAt(0).toUpperCase() + userName.slice(1));

        // Logout logic
        $('header .logout').click(function (event) {
            event.preventDefault();

            // Delete the token and cookie, then redirect to login page
            vra.api.tokensWithId.delete({
                tokenId: vra.userToken
            }, function (res) {
                document.cookie = 'usertoken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
                location.pathname = 'login.html';
            });
        });
    });
}, function () {
    // Otherwise, redirect to login page
    location.pathname = '/login.html';
});
