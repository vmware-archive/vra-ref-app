/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * A simple factory design pattern which helps to create Table instance with
 * different constructors
 */
var tableFactory = (function () {
    var constructorMap = {
        catalog: CatalogTable,
        requests: RequestTable,
        machines: MachineTable
    };

    return {
        /**
         * Create Table instance
         *
         * @param tabName {string} Tab name
         * @param tableElem {string|element} A table element, table element string,
         *   or jquery element of a table
         * @param tableOptions {object} An object that includes some parameters for specific classes
         * @return {object} An instance of Table subclass
         */
        create: function (tabName, tableElem, tableOptions) {
            return new constructorMap[tabName](tabName, tableElem, tableOptions);
        }
    };
})();
