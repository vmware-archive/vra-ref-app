/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * MachineItem Class, which can create an instance of the machine table item that
 * can store provisioned item information
 *
 * This class inherits the Item class.
 */

var MachineItem = (function () {
    /**
     * Find the daily cost value
     *
     * @param itemInfo {object} The general item infomation in the list from request
     *   list api
     * @return {number} Daily cost
     * @private
     */
    function findDailyCost(itemInfo) {
        if (!itemInfo.costs.leaseRate) return null;

        return itemInfo.costs.leaseRate.cost.amount;
    }

    /**
     * Create a Snapshot or SnapshotTree instance, and recursively get its children
     *
     * @param snapshotReference {objet} Permissible form request values for provider-SnapshotReference
     * @param action {object} A RevertSnapshotAction or DeleteSnapshotAction instance
     * @param requestForm {object} The form for triggering a resource action
     * @return {object} A Snapshot or SnapshotTree instance
     */
    function createSnapshot(snapshotReference, action, requestForm) {
        var snapshot = snapshotReference ? new Snapshot(snapshotReference) : new SnapshotTree();

        action.retrieveFormRequestValues('provider-SnapshotReference', requestForm, snapshot.underlyingValue)
                .then(function (res) {

            for (var i = 0; i < res.values.length; i++) {
                snapshot.addChild(createSnapshot(res.values[i], action, requestForm));
            }
        });

        return snapshot;
    }

    /**
     * Create a SnapshotTree instance for a MachineItem
     *
     * @param machineItem {object} A MachineItem instance that hosts the SnapshotTree
     * @return {object} A jquery deferred object
     */
    function retrieveSnapshotTree(machineItem) {
        var actions = machineItem.actionList.actions;
        var action = actions.revertsnapshot || actions.deletesnapshot;

        if (!action) return;

        return action.retrieveFormRequest().then(function (res) {
            // Pass null as the first parameter to get a SnapshotTree instance
            machineItem.snapshotTree = createSnapshot(null, action, res);
        });
    }

    /**
     * MachineItem Constructor
     *
     * @class MachineItem
     * @superclass Item
     * @param rowElem {string|element} A table row element, table row element string
     *   or jquery element of a table row
     * @param itemInfo {object} The machine item infomation in the list from provisioned
     *   item list api
     */
    function MachineItem(rowElem, itemInfo) {
        this.name = itemInfo.name;
        this.actionList = new ActionList(itemInfo, this);
        this.dailyCostStr = '$' + findDailyCost(itemInfo);

        Item.call(this, rowElem, itemInfo);

        this.deferred = retrieveSnapshotTree(this);
    }
    MachineItem.prototype = Object.create(Item.prototype);

    return MachineItem
})();
