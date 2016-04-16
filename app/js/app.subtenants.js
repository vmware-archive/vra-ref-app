/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * This file fetches subtenants that current user belongs to
 *
 * Note: subtenant is just business group
 */

app.subtenants = {};

// Send the request to retrieve subtenants with vRA API and add this
// deferred object to the app
(function () {
    var subtenantDeferredObj = vra.api.subtenantsWithTenantAndUser.get({
        tenantId: app.tenant,
        userId: app.username
    }, function (res) {
        app.subtenants = res.content
    });

    app.addDeferredObj(subtenantDeferredObj);
})();
