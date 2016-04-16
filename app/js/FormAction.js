/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * FormAction Class
 *
 * This class inherits the Action class
 *
 * This class can be subclassed with an bootstrap icon class name and an action
 * request submit successful message
 *
 * Properties:
 *
 *   this.iconClassName {string}
 *     A bootstrap icon class name
 *
 *   this.message {string}
 *     A message of action request successfully submitted
 */

/**
 * FormAction Constructor
 *
 * @class FormAction
 * @superclass Action
 * @param name {string} The action name
 * @param templateApi {string} The vRA action request template API
 * @param actionList {object} The action list that hosts this action
 */
function FormAction(name, templateApi, actionList) {
    Action.call(this, name, templateApi, actionList);

    this.element
            .addClass('form-action')
            .append('<span class="form-action-icon glyphicon glyphicon-triangle-left"></span>');
}
FormAction.prototype = Object.create(Action.prototype);

/**
 * Get the form for triggering a resource action.
 *
 * @return {object} A jQuery deferred object
 */
FormAction.prototype.retrieveFormRequest = function () {
    return vra.api.resourceActionFormsRequest.get({
        resourceId: this.actionList.machineItem.itemInfo.resourceId,
        resourceActionId: this.actionId
    });
};

/**
 * Retrieves the permissible form request values for the specified field
 *
 * @param elementId {string} The identifier of a target element within the resource action
 * @param requestForm {object} The form that can trigger the action
 * @param associateValue {object} Associate value, for example: a snapshot's parent's
 *   underlying value
 * @return {object} A jQuery deferred object
 */
FormAction.prototype.retrieveFormRequestValues = function (elementId, requestForm, associateValue) {
    var that = this;

    var dependencyValues = requestForm.values;

    dependencyValues.entries.push({
        key: elementId
    });

    return vra.api.resourceActionFormsRequestValues.post({
        resourceId: that.actionList.machineItem.itemInfo.resourceId,
        resourceActionId: that.actionId,
        elementId: elementId
    }, {
        dependencyValues: dependencyValues,
        pagingInfo: {
            offset:0,
            count:20
        },
        associateValue: associateValue ? associateValue : null
    });
};
