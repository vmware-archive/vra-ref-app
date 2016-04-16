/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * This file helps to fetch the current vra version and initialize the footer text
 * in both main application page and login page
 */

$.ajax({
    method: 'GET',
    url: 'https://' + conf.vraDomain + '/vcac/services/api/version',
    success: function (res) {
        var replacement = {
                APP_VERSION: app.version,
                VRA_VERSION: res.currentVersion
            };

        $('footer .version').text(function (idx, text) {
            return text.replace(/APP_VERSION|VRA_VERSION/g, function (a) {
                return replacement[a];
            });
        });
    }
});
