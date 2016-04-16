/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * Item Class, helps to store item infomation.
 */

/**
 * Item Constructor
 *
 * @class Item
 * @param rowElem {string|element} A table row element, table row element string
 *   or jquery element of a table row
 * @param itemInfo {object} The general item infomation in the list from a
 *   vRA List API, ex: entitled catalog item list, catalog request list...
 */
function Item(rowElem, itemInfo) {
    this.element = $(rowElem);
    this.itemInfo = itemInfo;
}
