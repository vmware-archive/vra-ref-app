/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * SuspendAction Class
 *
 * This class inherits the Action class
 */

/**
 * SuspendAction Constructor
 *
 * @class SuspendAction
 * @superclass Action
 * @param name {string} The action name
 * @param templateApi {string} The vRA action request template API
 */
function SuspendAction(name, templateApi) {
    this.iconClassName = 'glyphicon-pause';

    Action.call(this, name, templateApi);

    this.message = 'Suspend request has been submitted!';
}
SuspendAction.prototype = Object.create(Action.prototype);
