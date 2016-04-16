/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * You Cloud app global object, hosts parameters and methods in the global scope so
 * they can be accessed/invoked by any local scripts
 */

var app = (function () {
    /**
     * An array that hosts jQuery deferred objects that need to be done before
     * executing any callback registered by app.ready
     *
     * @private
     */
    var appDeferredObjs = [];

    /**
     * A queue that hosts some callbacks that will be executed when app is ready
     *
     * @private
     */
    var appReadyCallbackQueue = [];

    var app = {
        /**
         * App version
         */
        version: '1.0.0',

        /**
         * User name
         *
         * @getter username
         */
        get username () {
            return vra.userToken ? atob(vra.userToken).match(/username\:(.*)expiration/)[1] : null;
        },

        /**
         * Tenant
         *
         * @getter tenant
         */
        get tenant () {
            return vra.userToken ? atob(vra.userToken).match(/tenant\:(.*)username/)[1] : null;
        },

        /**
         * Cache the MessageToast instance which can cast a message of user action status
         */
        messageToast: null,

        /**
         * Add a deferred object
         *
         * @param {object} A jQuery deferred object that needs to be done before app ready
         */
        addDeferredObj: function (deferredObj) {
            appDeferredObjs.push(deferredObj);
        },

        /**
         * Add a function to the callback queue, and bind the thisArg to app
         *
         * @param {function} A callback that will be executed when app is ready
         */
        ready: function (fn) {
            appReadyCallbackQueue.push(fn.bind(this));
        }
    };

    // When all the deferred objects are done, execute app ready callbacks
    // To make sure there is no more deferred objects, do this on document ready
    $(function () {
        $.when.apply(app, appDeferredObjs).done(function () {
            while (appReadyCallbackQueue.length) {
                appReadyCallbackQueue.shift()();
            }
        });
    });

    return app;
})();
