/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * DeleteSnapshotAction Class
 *
 * This class inherits the FormAction class
 */

/**
 * DeleteSnapshotAction Constructor
 *
 * @class DeleteSnapshotAction
 * @superclass FormAction
 * @param name {string} The action name
 * @param templateApi {string} The vRA action request template API
 * @param actionList {object} The action list that hosts this action
 */
function DeleteSnapshotAction(name, templateApi, actionList) {
    var that = this;

    this.iconClassName = 'glyphicon-fire';

    FormAction.call(this, name, templateApi, actionList);

    this.message = "Delete snapshot request has been submitted! This action might take a while, please refresh the page a couple minutes later to see the updated result";
}
DeleteSnapshotAction.prototype = Object.create(FormAction.prototype);
