/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * Table Class, helps to create a list of items in the table markup base on the
 * vRA API under each tab.
 *
 * This class needs to be subclassed. Don't make instance directly.
 * When create subclasses, the following methods are required:
 *
 * Methods:
 *
 *   this.generateRowElem
 *     A method which returns a jquery element of table row
 */

/**
 * Table Constructor
 *
 * @class Table
 * @param tabName {string} Tab name
 * @param tableElem {string|element} A table element, table element string,
 *   or jquery element of a table
 */
function Table(tabName, tableElem) {
    this.tabName = tabName;
    this.element = $(tableElem);
    this.searchPattern = null;
    this.limit = 10;
    this.pageNumber = 1;
    this.metadata = null;

    this.rawRows = [];
    this.rowProcesser = new RowProcesser();

    // Initialize
    this.refresh();
}

/**
 * Loads data with vRA API
 */
Table.prototype.refresh = function () {
    var that = this;

    vra.api[this.apiName].get(this.getApiParams(), function (res) {
        that.metadata = res.metadata;
        that.rawRows = res.content;
        that.listRows();

        // Fire a tableready custom event
        that.element.trigger('tableready');

        // Fire a tablerefreshend custom event
        that.element.trigger('tablerefreshend', {tab: that.tabName});
    }, function (xhr) {
        app.messageToast.castMessage(xhr.responseJSON.errors[0].message, 'danger', 'Error');

        // Fire a tablerefreshend custom event
        that.element.trigger('tablerefreshend', {tab: that.tabName});
    });

    // Fire a tablerefreshstart custom event
    that.element.trigger('tablerefreshstart', {tab: that.tabName});
};

/**
 * Lists processed table rows
 */
Table.prototype.listRows = function () {
    var tbody = $('tbody', this.element);

    // Clear current rows
    tbody.empty();

    // Get the processed rows
    var processedRows = this.rowProcesser.execute(this.rawRows);

    for (var i = 0; i < processedRows.length; i++) {
        var itemInfo = processedRows[i];

        // Generate row element and insert it into the table
        this.generateRowElem(itemInfo).appendTo(tbody);
    }
};

/**
 * Wraps up the needed properties as api parameters
 *
 * @return {object} Parameters that can be passed into vra.api methods
 */
Table.prototype.getApiParams = function () {
    var filters = Array.isArray(this.filters) ? this.filters.slice() : [];

    // Adds search pattern as a filter
    if (this.searchPattern) {
        filters.push("substringof('" + this.searchPattern.toLowerCase() + "', tolower(" + this.searchProp + "))");
    }

    return {
        withExtendedData: this.withExtendedData, // boolean, populates resources' extended data
        withOperations: this.withOperations, // boolean, populates resources' operations attribute
        filters: filters, // array, elements will be joined into ODATA $filter string, ex: ["name+eq+'foo'", "description+ne+'bar'"] -> $filter=name+eq+'foo'+and+description+ne+'bar'
        sortProp: this.sortProp, // string, $orderby property name
        sortDesc: this.sortDesc, // boolean, $orderby desc or asc
        limit: this.limit, // number, number of entries per page
        pageNumber: this.pageNumber // number, page number
    };
};

/**
 * Execute search with pattern
 *
 * @param pattern {string} Substring of item name
 */
Table.prototype.search = function (pattern) {
    this.searchPattern = pattern;
    this.pageNumber = 1;
    this.refresh();
};

/**
 * Refresh the table with a page number
 *
 * @param pageNumber {number} Page number
 */
Table.prototype.pagination = function (pageNumber) {
    if (typeof pageNumber !== 'number' || pageNumber % 1 != 0 || pageNumber > this.metadata.totalPages || pageNumber < 1) return;

    this.pageNumber = pageNumber;
    this.refresh();
};

/**
 * Refresh the table with sorting by a property
 *
 * @param sortProp {string} Property name, which will be used with the $orderby in apis
 * @param desc {boolean} Set to true to order by desc, otherwise order by asc
 */
Table.prototype.sort = function (sortProp, desc) {
    this.sortProp = sortProp;
    this.sortDesc = !!desc;
    this.refresh();
};
