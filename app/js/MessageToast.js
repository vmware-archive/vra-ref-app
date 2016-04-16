/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * MessageToast Class, which can cast a message of user action in a bootstrap
 * alert component
 *
 * Stylesheet:
 *
 *   css/MessageToast.css
 *
 * Requires:
 *
 *   bootstrap.css
 *
 * Example:
 *
 *   var messageToast = new MessageToast('#messageToastElement');
 *   messageToast.castMessage('Hello, world!', 'success');
 */

var MessageToast = (function ($) {
    /**
     * Save the only MessageToast instance as a singleton
     *
     * @private
     */
    var singleton;

    /**
     * MessageToast Constructor
     *
     * @class MessageToast
     * @param elem {string|element} A message toast dialog element, can be an
     *   element string or a jquery element
     * @param dura {number} Duration of showing the message, milliseconds
     */
    function MessageToast(elem, dura) {
        if (singleton) return singleton;

        this.element = $(elem);
        this.duration = dura || 3000;

        singleton = this;
    }

    /**
     * Set the alert status
     *
     * @param stat {string} Alert status, can be 'success', 'info', warning', or 'danger'
     * @param [statMsg] {string} Alert status message
     */
    MessageToast.prototype.setStatus = function (stat, statMsg) {
        statMsg = statMsg || stat.charAt(0).toUpperCase() + stat.slice(1);

        $('.alert', this.element)[0].className = 'alert alert-' + stat;
        $('.status', this.element).text(statMsg);
    };

    /**
     * Cast a message in an alert dialog
     *
     * @param msg {string} Message that will displayed in the alert
     * @param stat {string} Alert status, can be 'success', 'info', warning', or 'danger'
     * @param [statMsg] {string} Alert status message
     */
    MessageToast.prototype.castMessage = function (msg, stat, statMsg) {
        // If the last message has not dismissed yet, manually remove the job
        // from the thread
        if (this._job) clearTimeout(this._job);

        this.setStatus(stat, statMsg);
        $('.message', this.element).html(msg);

        this.element.removeClass('hiding');

        // Keep the message showing for a duration, and cache the asynchronous
        // job putted in the thread in this._job
        this._job = setTimeout(function () {
            this.element.addClass('hiding');
            delete this._job;
        }.bind(this), this.duration);
    };

    /**
     * Close the dialog
     */
    MessageToast.prototype.closeDialog = function () {
        if (this._job) {
            clearTimeout(this._job);
            this.element.addClass('hiding');
        }
    };

    return MessageToast;
})(jQuery);
