/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * RequestItem Class, which can create an instance of the request table item that
 * can store request item information and detail
 *
 * This class inherits the Item class.
 */

var RequestItem = (function () {
    /**
     * Find a value in a fake key-value pair array
     *
     * Example:
     *
     *   var arr = [{key: 'foo', value: 'banana'}, {key: 'bar', value: 'gelato'}];
     *
     *   findValueWithKey(arr, 'bar'); // 'gelato'
     *
     * @param arr {array} An array that contains object of {key: ..., value: ...}
     * @param key {string} The key of the target value
     * @return {number|string|object|array} Any kind of value
     * @private
     */
    function findValueWithKey(arr, key) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].key == key) return arr[i].value;
        }

        return null;
    }

    /**
     * Find a property value
     *
     * @param itemInfo {object} The general item infomation in the list from request
     *   list api
     * @param blueprintMachineName {string} Blueprint machine name
     * @param propertyName {string} Target property name
     * @return {number|string} Target property value
     * @private
     */
    function findProperty(itemInfo, blueprintMachineName, propertyName) {
        var machineData = findValueWithKey(
                itemInfo.requestData.entries,
                'provider-' + blueprintMachineName
            );
        var property = machineData ?
                    findValueWithKey(machineData.values.entries, propertyName) :
                    null;

        return property ? property.value : null;
    }

    /**
     * Find the lease days value
     *
     * @param itemInfo {object} The general item infomation in the list from request
     *   list api
     * @return {number} Lease days value
     * @private
     */
    function findLeaseDays(itemInfo) {
        if (!itemInfo.quote.leasePeriod) return null;

        return itemInfo.quote.leasePeriod.amount;
    }

    /**
     * Find the daily cost value
     *
     * @param itemInfo {object} The general item infomation in the list from request
     *   list api
     * @return {string} Daily cost string with a dollar sign
     * @private
     */
    function findDailyCost(itemInfo) {
        if (!itemInfo.quote.leaseRate) return null;

        return '$' + itemInfo.quote.leaseRate.cost.amount;
    }

    /**
     * RequestItem Constructor
     *
     * @class RequestItem
     * @superclass Item
     * @param rowElem {string|element} A table row element, table row element string
     *   or jquery element of a table row
     * @param itemInfo {object} The general item infomation in the list from request
     *   list api
     */
    function RequestItem(rowElem, itemInfo) {
        var that = this;

        this.name = itemInfo.requestedItemName;

        // Get the catalog item schema and some detail information first, and then
        // initialize the RequestItem instance properties
        // Save the deferred object that can be chained
        this.deferred = CatalogItem.getSchema({catalogId: itemInfo.catalogItemRef.id}).then(function (catalogItemDetail) {
            var blueprintMachineName = catalogItemDetail.blueprintMachineName;

            that.cpu = findProperty(itemInfo, blueprintMachineName, 'cpu') || catalogItemDetail.cpu;
            that.memory = findProperty(itemInfo, blueprintMachineName, 'memory') || catalogItemDetail.memory;
            that.storage = findProperty(itemInfo, blueprintMachineName, 'storage') || catalogItemDetail.storage;
            that.costCenter = findProperty(itemInfo, blueprintMachineName, 'cost_center');
            that.leaseDays = findLeaseDays(itemInfo);
            that.dailyCostStr = findDailyCost(itemInfo);
        });

        Item.call(this, rowElem, itemInfo);
    }

    RequestItem.prototype = Object.create(Item.prototype);

    return RequestItem;
})();
