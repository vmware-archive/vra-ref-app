/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * Action Class, stores vRA action request template API and action execute API
 * and an action element, also has an execute method which can just call the
 * execute API
 *
 * Note: Since we can find all the available action api urls within a resource item,
 * instead of using the vra.api, sending ajax calls directly would be much easier
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
 * Action Constructor
 *
 * @class Action
 * @param name {string} The action name
 * @param templateApi {string} The vRA action request template API
 * @param actionList {object} The action list that hosts this action
 */
function Action(name, templateApi, actionList) {
    this.actionList = actionList;
    this.name = name;
    this.actionId = templateApi.match(/actions\/([A-Za-z0-9\-]*)\//)[1];
    this.templateApi = templateApi;
    this.template = null;
    this.executeApi = null;
    this.element = this.generateElem();
    this.message = 'Action ' + this.name + ' request has been submitted!';

    this.deferred = this.retrieveTemplate();
}

/**
 * Generate an action element
 *
 * @return {element} A jquery li element
 */
Action.prototype.generateElem = function () {
    var htmlStr = '<li class="action">' +
                  '<span class="glyphicon ' + this.iconClassName + '"></span>' +
                  '<span>' + this.name + '</span>' +
                  '</li>';

    return $(htmlStr).data('actionInstance', this);
};

/**
 * Call the action execute API to submit the execition request
 *
 * @param payload {object} The action request template
 */
Action.prototype.execute = function (payload) {
    var that = this;

    if (confirm('Are you sure you want to send ' + this.name + ' action request?')) {
        $.ajax({
            method: 'POST',
            url: this.executeApi,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + vra.userToken
            },
            data: JSON.stringify(payload || this.template),
            complete: function (res) {
                if (res.status == 201) {
                    app.messageToast.castMessage(that.message, 'success');
                } else {
                    app.messageToast.castMessage(res.responseJSON.errors[0].message, 'danger', 'Error');
                }

                if (that.callback) that.callback(res);
            }
        });
    }
};

/**
 * Call the action request template API to retrieve the template
 */
Action.prototype.retrieveTemplate = function () {
    var that = this;

    return $.ajax({
        method: 'GET',
        url: this.templateApi,
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + vra.userToken
        },
        success: function (res) {
            that.template = res;
        }
    });
};

/**
 * Make a request template object copy
 *
 * @return {object} Request template copy
 */
Action.prototype.cloneTemplate = function () {
    return $.extend(true, {}, this.template);
};
