/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * MachineTable Class, which can create an instance of the table under machine tab
 *
 * This class inherits the Table class.
 */

/**
 * MachineTable Constructor
 *
 * @class MachineTable
 * @superclass Table
 * @param tabName {string} Tab name
 * @param tableElem {string|element} A table element, table element string,
 *   or jquery element of a table
 */
function MachineTable(tabName, tableElem) {
    this.apiName = 'resourceViews';
    // vRA API ODATA parameter: include extended data
    this.withExtendedData = true;
    // vRA API ODATA parameter: list all the available actions api links
    this.withOperations = true;
    // vRA API ODATA parameter: list virtual machine items by the current user only
    this.filters = [
        "resourceType+eq+'Infrastructure.Virtual'",
        "owners/ref+eq+'" + app.username + "'"
    ];
    this.searchProp = 'name';
    this.sortProp = 'name';
    this.sortDesc = false;

    Table.call(this, tabName, tableElem);
}
MachineTable.prototype = Object.create(Table.prototype);

/**
 * Generate machine table row element, and bind MachineItem instance to the
 * element
 *
 * @param itemInfo {object} The machine item infomation in the list from provisioned
 *   item list api
 * @return {element} A jquery element of a table row
 */
MachineTable.prototype.generateRowElem = function (itemInfo) {
    var htmlStr = '<tr data-toggle="modal" data-target="#machineDetail">' +
                  '<td>' + itemInfo.name + '</td>' +
                  '<td>' + itemInfo.status + '</td>' +
                  '<td>' + (itemInfo.description || '') + '</td>' +
                  '<td>' + (new Date(itemInfo.dateCreated)).toLocaleString() + '</td>' +
                  '</tr>';

    var elem = $(htmlStr),
        itemInstance = new MachineItem(elem, itemInfo);

    return elem.data('itemInstance', itemInstance);
};
