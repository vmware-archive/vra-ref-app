/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * This file initializes app.messageToast, in both main application page and login page
 */

$(function () {
    // Create a MessageToast instance and save it in the global variable, app
    app.messageToast = new MessageToast($('#messageToast'));
});
