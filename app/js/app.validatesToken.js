/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * This file adds a method in the app object, that can check if the current token
 * is still valid.
 */

/**
 * Validates if vra.userToken is not expired
 *
 * @param resolve {function} Callback for a valid token
 * @param reject {function} Callback for an invalid token
 */
app.validatesToken = function (resolve, reject) {
    if (!vra.userToken) {
        reject();
    } else {
        vra.api.tokensWithId.head({
            tokenId: vra.userToken
        }, function () {
            resolve();
        }, function () {
            document.cookie = 'usertoken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
            reject();
        });
    }
};
