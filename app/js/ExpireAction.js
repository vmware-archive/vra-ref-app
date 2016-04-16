/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * ExpireAction Class
 *
 * This class inherits the Action class
 */

/**
 * ExpireAction Constructor
 *
 * @class ExpireAction
 * @superclass Action
 * @param name {string} The action name
 * @param templateApi {string} The vRA action request template API
 */
function ExpireAction(name, templateApi) {
    this.iconClassName = 'glyphicon-ban-circle';

    Action.call(this, name, templateApi);

    this.message = "Expire request has been submitted!";
}
ExpireAction.prototype = Object.create(Action.prototype);
