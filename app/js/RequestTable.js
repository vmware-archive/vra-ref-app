/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * RequestTable Class, which can create an instance of the table under request tab
 *
 * This class inherits the Table class.
 */

/**
 * RequestTable Constructor
 *
 * @class RequestTable
 * @superclass Table
 * @param tabName {string} Tab name
 * @param tableElem {string|element} A table element, table element string,
 *   or jquery element of a table
 */
function RequestTable(tabName, tableElem) {
    this.apiName = 'requests';
    // vRA API ODATA parameter: list Blueprint service catalog item requests by the current user only
    this.filters = [
        "catalogItem/providerBinding/provider/providerType+eq+'com.vmware.csp.component.cafe.composition'",
        "requestedBy+eq+'" + app.username + "'"
    ];
    this.searchProp = 'catalogItem/name';
    this.sortProp = 'requestNumber';
    this.sortDesc = true;

    Table.call(this, tabName, tableElem);
}
RequestTable.prototype = Object.create(Table.prototype);

/**
 * Generate request table row element, and bind RequestItem instance to the
 * element
 *
 * @param itemInfo {object} The general item infomation in the list from request
 *   list api
 * @return {element} A jquery element of a table row
 */
RequestTable.prototype.generateRowElem = function (itemInfo) {
    var htmlStr = '<tr data-toggle="modal" data-target="#requestDetail">' +
                  '<td>' + itemInfo.requestNumber + '</td>' +
                  '<td>' + itemInfo.requestedItemName + '</td>' +
                  '<td>' + (new Date(itemInfo.dateSubmitted)).toLocaleString() + '</td>' +
                  '<td>' + itemInfo.stateName + '</td>' +
                  '</tr>';

    var elem = $(htmlStr),
        itemInstance = new RequestItem(elem, itemInfo);

    return elem.data('itemInstance', itemInstance);
};
