/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * Validates token in login page and determine if user is going to be staying
 * in the current page or redirected to the homepage
 */
app.validatesToken(function () {
    // If token exists and is not expired, redirect to app homepage
    location.pathname = '/index.html';
}, function () {
    // Otherwise, setup login form onsubmit handler
    $(function () {
        $('#loginForm').submit(function(event) {
            event.preventDefault();

            // Show loading animation icon
            $('legend .loading-icon', event.target).addClass('loading');

            // POST request payload
            var payload = {
                tenant: $('input[name=tenant]').val(),
                username: $('input[name=username]').val(),
                password: $('input[name=password]').val(),
            };

            // Send the request for the access token and save it in cookie, then
            // redirect to homepage
            vra.api.tokens.post(null, payload, function (res) {
                document.cookie = 'usertoken=' + res.id;
                location.pathname = '/index.html';
            }, function (xhr) {
                // Hide loading animation icon
                $('legend .loading-icon', event.target).removeClass('loading');

                app.messageToast.castMessage(xhr.responseJSON.errors[0].message, 'danger', 'Error');
            });
        });
    });
});
