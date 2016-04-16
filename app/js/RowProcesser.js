/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * RowProcesser class, helps to process table rows on client side.
 *
 * Use the addtask method to add function that can do filter, sort, merge rows,
 * or something else
 */

/**
 * RowProcesser Constructor
 *
 * @class RowProcesser
 */
function RowProcesser() {
    this.tasks = [];
}

/**
 * Add a task function
 *
 * @param fn {function} A function that takes and array as parameter and return a
 *   processed array
 */
RowProcesser.prototype.addTask = function (fn) {
    this.tasks.push(fn);
}

/**
 * Execute all the tasks one by one, and return the final processed rows
 *
 * @param rawRows {array} Original table rows
 * @return {array} Final processed rows
 */
RowProcesser.prototype.execute = function (rawRows) {
    // Make a copy of the raw rows so the raw rows won't change
    var processedRows = rawRows.slice();

    for (var i = 0; i < this.tasks.length; i++) {
        processedRows = this.tasks[i](processedRows);
    }

    return processedRows;
}
