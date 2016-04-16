/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * This is a simple factory pattern that helps to generate javascript client wrapper for
 * vRA APIs with aliases, and store them under global object method vra.api
 *
 * For a registered POST methods, pass parameters, payload, success handler, error handler
 * For other registered methods, pass parameters, success handler, error handler
 *
 * In order to use the vRA APIs, a vRA server is required.
 *
 * Example:
 *
 *   ...
 *
 *   vra.registerServer('vcac-be.eng.vmware.com');
 *
 *   vra.registerApi('subtenants', '/identity/api/tenants/{tenantId}/subtenants', 'GET');
 *
 *   vra.api.subtenants.get({
 *     tenantId: 'qe',
 *     filters: ["name+eq+'Develpment'"],
 *     limit: 5
 *   }, function (res) {
 *     console.log(res);
 *   }, function (xhr) {
 *     console.log(xhr);
 *   });
 *
 *   ...
 *
 * Note:
 *
 *   If there are parameters in the path, use braces to wrap them when calling registerApi
 *   method, and pass the value when calling that api method, just like the {tenantId}
 *   in the example above. If the value is not passed as a parameter, it will be
 *   replaced by an empty string.
 *
 *   ex: tenantId is required, so the following api will not work
 *
 *   /identity/api/tenants/{tenantId}/subtenants -> /identity/api/tenants//subtenants
 *
 *   ex: tokenId is not required on POST, so the following api will work when requesting for a token
 *
 *   /identity/api/tokens/{tokenId} -> /identity/api/tokens/
 *
 * Reference: vRA API documentation and ODATA
 *
 *   https://YOUR_VRA_DOMAIN/component-registry/services/docs
 *   https://YOUR_VRA_DOMAIN/component-registry/services/docs/odata.html
 *
 */

var vra = (function () {
    /**
     * A vRA server
     *
     * Example: vcac-be.eng.vmware.com
     *
     * @private
     */
    var server;

    /**
     * Api Constructor
     *
     * @class Api
     *
     * @param apiName {string} An api alias, ex: 'tokens'
     * @param apiString {string} An api string, ex: '/identity/api/tokens'
     * @private
     */
    function Api(apiName, apiString) {
        this.name = apiName;
        this.apiString = apiString;
        this.urlProto = 'https://' + server + apiString;
    }

    /**
     * Add an http method to this instance
     *
     * @param httpMethod {string} An http method, ex: 'POST'
     * @private
     */
    Api.prototype.addMethod = function (httpMethod) {
        var that = this;
        var method = httpMethod.toLowerCase();

        if (this[method]) return;

        if (method == 'post') {
            /**
             * POST method
             *
             * @param params {object} An object that wraps the following defulat
             *   vRA API parameters and parameters in the braces in the api string
             *
             *     withExtendedData {boolean} With extended data or not
             *     withOperations {boolean} With operations data or not
             *     filter {array} An array of OData filter strings
             *     searchProp {string} Search for this property name
             *     sortProp {string} Sort by this property name
             *     sortDesc {boolean} Sort by desc or not
             *
             * @param payload {object} POST request payload
             * @param handleSuccess {function} Handler for success
             * @param handleError {function} Handler for error
             * @return {object} A jQuery deferred object
             */
            this[method] = function (params, payload, handleSuccess, handleError) {
                return $.ajax({
                    method: method,
                    url: that.createApiString(params),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + vra.userToken
                    },
                    data: JSON.stringify(payload),
                    success: handleSuccess,
                    error: handleError
                });
            };
        } else {
            /**
             * GET, HEAD, DELETE, and other method
             *
             * @param params {object} An object that wraps the following defulat
             *   vRA API parameters and parameters in the braces in the api string
             *
             *     withExtendedData {boolean} With extended data or not
             *     withOperations {boolean} With operations data or not
             *     filter {array} An array of OData filter strings
             *     searchProp {string} Search for this property name
             *     sortProp {string} Sort by this property name
             *     sortDesc {boolean} Sort by desc or not
             *
             * @param handleSuccess {function} Handler for success
             * @param handleError {function} Handler for error
             * @return {object} A jQuery deferred object
             */
            this[method] = function (params, handleSuccess, handleError) {
                return $.ajax({
                    method: method,
                    url: that.createApiString(params),
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + vra.userToken
                    },
                    success: handleSuccess,
                    error: handleError
                });
            };
        }
    };

    /**
     * Create custom api string with parameters
     *
     * @param params {object} Parameters that will be added into the api string
     * @return {string} A string of vRA API url with parameters
     * @private
     */
    Api.prototype.createApiString = function (params) {
        var url = this.urlProto;

        if (!params || Object.keys(params).length == 0)
                return url.replace(/\{(\w*)\}/g, '');

        // Replaces the params in the path
        url = url.replace(/\{(\w*)\}/g, function (a, b) {
            return params[b] ? params[b] : '';
        });


        // Adds params in query
        return url + '?' +

               // withExtendedData, true will populate resources' extended data by calling their provider
               (params.withExtendedData ? 'withExtendedData=true&' : '') +

               // withOperations, true will populate resources' operations attribute by calling the provider
               (params.withOperations? 'withOperations=true&' : '') +

               // $filter, group of boolean expressions that filter out the entries in the response,
               // ex: $filter=name+eq+'foo'+and+description+eq+'bar', this query will includes object that has
               // name equals to 'foo' and description not equals to 'bar' only
               ((Array.isArray(params.filters) && params.filters.length) ? ('$filter=' + params.filters.join('+and+') + '&') : '') +

               // $orderby, sort the data, ex: $orderby=name+desc
               (params.sortProp ? ('$orderby=' + params.sortProp + (params.sortDesc ? '+desc&' : '&')) : '') +

               // limit, number of entries per page, default value is 20, ex: limit=10
               (params.limit ? ('limit=' + params.limit + '&') : '') +

               // page, page number, default value is 1, ex: page=3
               (params.pageNumber ? ('page=' + params.pageNumber) : '');
    };

    return {
        /**
         * User token id, grab it from cookie; if it's empty that means user need to login
         */
        userToken: document.cookie.replace(/(?:(?:^|.*;\s*)usertoken\s*\=\s*([^;]*).*$)|^.*$/, "$1") || null,

        /**
         * Hosts all registered Api instances
         */
        api: {},

        /**
         * Registers api
         *
         * @param apiName {string} The alias of Api instance stored under vra.api
         * @param apiString {string} The vRA API string. If there is parameters
         *   in the path, use braces to wrap them, ex: /identity/api/tokens/{tokenId}
         * @param httpMethod {string} An http method, ex: 'POST'
         */
        registerApi: function (apiName, apiString, httpMethod) {
            if (!server) {
                console.error('Server is not registered yet');
                return;
            }

            var api = this.api[apiName];

            if (!api) {
                this.api[apiName] = new Api(apiName, apiString);
            } else {
                if (apiString && apiString != api.apiString) {
                    console.error(apiName + ' had been registered with ' + api.apiString);
                    return;
                } else if (api[httpMethod]) {
                    console.error(apiName + '.' + httpMethod.toLowerCase() + ' had been registered');
                    return;
                }
            }

            this.api[apiName].addMethod(httpMethod);
        },

        /**
         * Registers server
         *
         * @param vraServer {string} A vRA server, ex: 'vcac-be.eng.vmware.com'
         */
        registerServer: function (vraServer) {
            server = vraServer;
        }
    };
})();
