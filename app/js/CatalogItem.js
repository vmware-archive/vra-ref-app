/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * CatalogItem Class, which can create an instance of the catalog table item that
 * can store catalog item information and detail including schema and request template
 *
 * Note: In this demo app, we only consider single machine blueprint item; if the
 * blueprint contains multiple machines it will pick the first one
 *
 * This class inherits the Item class.
 */

var CatalogItem = (function () {
    /**
     * Search for derivedValue in a given facets array and return it; if derivedValue
     * doesn't exist, return defaultValue; if defaultValue doesn't exist, return
     * minValue, if minValue doesn't exist; return null.
     *
     * @param facets {array} Facet from a field state
     * @return {number|string} The target value
     * @private
     */
    function findFacetVal(facets) {
        var valueToReturn = null,
            priority = 3;

        // Return value priority: derivedValue > defaultValue > minValue
        // Unless the derivedValue is found, keep search to see if a value that has
        // higher priority existes
        for (var i = 0; i < facets.length; i++) {
            if (facets[i].type == 'derivedValue') {
                return facets[i].value.value.value;
            } else if (facets[i].type == 'defaultValue' && priority > 1) {
                priority = 1;
                valueToReturn = facets[i].value.value.value;
            } else if (facets[i].type == 'minValue' && priority > 2) {
                priority = 2;
                valueToReturn = facets[i].value.value.value;
            }
        }

        return valueToReturn;
    }

    /**
     * Find item detail information from item schema
     *
     * @param schema {object} The catalog item schema
     * @return {object} An object includes blueprintMachineName, cpu,
     *   memory, storage, leaseDays, dailyCost, and schema
     * @private
     */
    function findItemDetail(schema) {
        var detail = {schema: schema};
        var firstBPIsFound = false;

        for (var i = 0; i < schema.fields.length; i++) {
            var field = schema.fields[i];

            // Grab lease days
            if (field.id == '_leaseDays') {
                detail.leaseDays = findFacetVal(field.state.facets);

            // Grab cpu, memory, and storage in the first Blueprint
            } else if (field.dataType.schema && !firstBPIsFound) {
                detail.blueprintMachineName = field.id;

                for (var j = 0; j < field.dataType.schema.fields.length; j++) {
                    var bpField = field.dataType.schema.fields[j];

                    if (bpField.id == 'cpu') {
                        detail.cpu = findFacetVal(bpField.state.facets);
                    } else if (bpField.id == 'memory') {
                        detail.memory = findFacetVal(bpField.state.facets);
                    } else if (bpField.id == 'storage') {
                        detail.storage = findFacetVal(bpField.state.facets);
                    }
                }

                firstBPIsFound = true;
            }
        }

        return detail;
    }

    /**
     * CatalogItem Constructor
     *
     * @class CatalogItem
     * @superclass Item
     * @param rowElem {string|element} A table row element, table row element string
     *   or jquery element of a table row
     * @param itemInfo {object} The general item infomation in the list from entitled
     *   catalog item list api
     */
    function CatalogItem(rowElem, itemInfo) {
        var that = this;

        this.name = itemInfo.catalogItem.name;
        this.blueprintId = itemInfo.catalogItem.providerBinding.bindingId.match(/\!([\w\-]*)$/)[1];
        this.blueprintMachineName = null;
        this.cpu = null;
        this.memory = null;
        this.storage = null;
        this.schema = null;
        this.requestTemplate = null;
        this.dailyCostStr = null;

        Item.call(this, rowElem, itemInfo);

        // Get cost, item schema, request template, and other detail information from them.
        // Save the deferred object that can be chained
        this.deferred = $.when(
            this.getCost(function (res) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].componentId == 'Total') {
                        that.dailyCostStr = res[i].averageDailyPriceInfo.displayString;
                        break;
                    }
                }
            }),
            this.getSchema(),
            this.getRequestTemplate()
        );
    }
    CatalogItem.prototype = Object.create(Item.prototype);

    /**
     * Catalogitem Constructor Help Method
     *
     * Get catalog item schema
     *
     * @param apiParams {object} An object includes catalogId
     * @return {object} A jquery deferred object
     */
    CatalogItem.getSchema = function (apiParams) {
        return vra.api.entitledCatalogRequestSchema.get(apiParams).then(function (res) {
            return findItemDetail(res);
        });
    };

    /**
     * Loads the catalog item request template
     *
     * @return {object} A jQuery deferred object
     */
    CatalogItem.prototype.getRequestTemplate = function () {
        var that = this;

        return vra.api.entitledCatalogRequestTemplate.get(this.getApiParams(), function (res) {
            that.requestTemplate = res;
        }, function (xhr) {
            app.messageToast.castMessage(xhr.responseJSON.errors[0].message, 'danger', 'Error');
        });
    };

    /**
     * Loads the catalog item schema with vRA API and pass the response to this.getSchema callback
     *
     * @return {object} A jQuery deferred object
     */
    CatalogItem.prototype.getSchema = function () {
        var that = this;

        return CatalogItem.getSchema(this.getApiParams()).then(function (detail) {
            $.extend(that, detail);
        }, function (xhr) {
            app.messageToast.castMessage(xhr.responseJSON.errors[0].message, 'danger', 'Error');
        });
    };

    /**
     * Get the cost information of a catalog item with vRA Api
     *
     * Note: _leaseDays is not the only parameter that can be put in the requestData.
     *
     * @param fn {funciton} Callback to handle the response
     * @param leaseDays {number} Lease days, a parameter that can be put into the
     *   requestData, and the total cost will be caculated base on it.
     * @return {object} A jQuery deferred object
     */
    CatalogItem.prototype.getCost = function (fn, leaseDays) {
        var requestData = {entries: []};

        if (typeof leaseDays === 'number') {
            requestData.entries.push({
                key: "_leaseDays",
                value: {type: "integer", value: leaseDays}
            });
        }

        return vra.api.costsUpfront.post({
            blueprintId: this.blueprintId
        }, {
            blueprintId: this.blueprintId,
            requestData: requestData,
            requestedFor: app.username,
            subTenantId: this.itemInfo.businessgroupId
        }, fn, function (xhr) {
            console.warn(xhr.responseJSON.errors[0].systemMessage);
        });
    };

    /**
     * Wraps up the needed properties as api parameters
     *
     * @return {object} Parameters that can be passed into vra.api methods
     */
    CatalogItem.prototype.getApiParams = function () {
        return {
            catalogId: this.itemInfo.catalogItem.id
        };
    };

    return CatalogItem;
})();
