/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * CatalogTable Class, which can create an instance of the table under catalog tab
 *
 * This class inherits the Table class.
 */

/**
 * CatalogTable Constructor
 *
 * @class CatalogTable
 * @superclass Table
 * @param tabName {string} Tab name
 * @param tableElem {string|element} A table element, table element string,
 *   or jquery element of a table
 * @param tableOptions {object} An object that includes businessgroupId
 */
function CatalogTable(tabName, tableElem, tableOptions) {
    this.apiName = 'entitledCatalogItems';
    // vRA API ODATA parameter: list Blueprint service catalog items only
    this.filters = [
        "catalogItemType/name+eq+'Composite Blueprint'"
    ];
    this.sortProp = 'name';
    this.sortDesc = false;
    this.searchProp = 'name';

    Table.call(this, tabName, tableElem);

    this.businessgroupId = tableOptions.businessgroupId;
    this.addBusinessgroupFilter();
}
CatalogTable.prototype = Object.create(Table.prototype);

/**
 * Generate catalog table row element, and bind CatalogItem instance to the
 * element
 *
 * @param itemInfo {object} The general item infomation in the list from entitled
 *   catalog item list api
 * @return {element} A jquery element of a table row
 */
CatalogTable.prototype.generateRowElem = function (itemInfo) {
    itemInfo.businessgroupId = this.businessgroupId;

    var htmlStr = '<tr data-toggle="modal" data-target="#catalogitemDetail">' +
                  '<td>' + itemInfo.catalogItem.name + '</td>' +
                  '<td>' + itemInfo.catalogItem.description + '</td>' +
                  '</tr>';

    var elem = $(htmlStr),
        itemInstance = new CatalogItem(elem, itemInfo);

    return elem.data('itemInstance', itemInstance);
};

/**
 * Add a task that can filter out the catalog items by business group to the RowProcesser
 */
CatalogTable.prototype.addBusinessgroupFilter = function () {
    var that = this;

    this.rowProcesser.addTask(function (rows) {
        return rows.filter(function (row) {
            for (var i = 0; i < row.entitledOrganizations.length; i++) {
                if (row.entitledOrganizations[i].subtenantRef == that.businessgroupId) return true;
            }

            return false;
        });
    });
};

/**
 * Set the business group for this table by assigning the businessgroupId
 *
 * @param businessgroupId {string} The business group/subtenant id
 */
CatalogTable.prototype.setBusinessgroup = function (businessgroupId) {
    this.businessgroupId = businessgroupId;
};

/**
 * Re-generate the row elements with a business group
 *
 * @param businessgroupId {string} The business group/subtenant id
 */
CatalogTable.prototype.filterByBusinessgroup = function (businessgroupId) {
    this.setBusinessgroup(businessgroupId);
    this.listRows();
};
