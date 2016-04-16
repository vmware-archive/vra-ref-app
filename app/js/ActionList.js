/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * ActionList Class, manages a list of Action instance
 */

var ActionList = (function () {
    /**
     * The map of action namees and action classes
     *
     * @private
     */
    var actionClassMap = {
        PowerOn: PowerOnAction,
        PowerOff: PowerOffAction,
        Reboot: RebootAction,
        Suspend: SuspendAction,
        Expire: ExpireAction,
        Destroy: DestroyAction,
        ChangeLease: ChangeLeaseAction,
        CreateSnapshot: CreateSnapshotAction,
        RevertSnapshot: RevertSnapshotAction,
        DeleteSnapshot: DeleteSnapshotAction
    };

    /**
     * Find all the action template api and execute api from the links array
     * in the machine item informtaion object and create Action instances
     *
     * @param links {array} An array of all the available action template apis
     * @param actionList {object} The action list
     * @return {object} A key value pair of all the Action instance
     * @private
     */
    function findActions(links, actionList) {
        var actions = {};

        // Find all the action template urls
        for (var i = 0; i < links.length; i++) {
            var link = links[i];

            if (/^GET\sTemplate\:.*action/.test(link.rel)) {
                var actionName = /\.(\w+)\}$/.exec(link.rel)[1],
                    actionKey = actionName.toLowerCase();

                // Create Action subclass instances
                if (actionClassMap[actionName]) {
                    actions[actionKey] = new actionClassMap[actionName](actionName, link.href, actionList);
                }
            }
        }

        // Find all the post requests that can execute matched action
        for (var i = 0; i < links.length; i++) {
            var link = links[i];

            if (/^POST\:.*action/.test(link.rel)) {
                var actionName = /\.(\w+)\}$/.exec(link.rel)[1],
                    actionKey = actionName.toLowerCase();

                if (actions[actionKey])
                        actions[actionKey].executeApi = link.href;
            }
        }

        return actions;
    }

    /**
     * ActionList Constructor
     *
     * @class ActionList
     * @param itemInfo {object} The machine item infomation in the list from provisioned
     *   item list api
     * @param machineItem {object} The machine item that hosts this action list
     */
    function ActionList(itemInfo, machineItem) {
        this.machineItem = machineItem;
        this.element = $('<ul class="action-list"></ul>');
        this.actions = findActions(itemInfo.links, this);

        this.initActions();
    }

    /**
     * Append action elements into the action list element
     */
    ActionList.prototype.initActions = function () {
        // Place holder if there is no applicable action
        if (Object.keys(this.actions).length == 0) {
            this.element.html('<li>No applicable action</li>');
        }

        // Put PowerOn or PowerOff at the top
        var powerSwitch = this.actions.poweron || this.actions.poweroff;
        if (powerSwitch) this.element.append(powerSwitch.element);

        // Add Reboot
        if (this.actions.reboot) this.element.append(this.actions.reboot.element);

        // Add Suspend
        if (this.actions.suspend) this.element.append(this.actions.suspend.element);

        // Add Expire
        if (this.actions.expire) this.element.append(this.actions.expire.element);

        // Add Destroy
        if (this.actions.destroy) this.element.append(this.actions.destroy.element);

        // Add ChangeLease
        if (this.actions.changelease) this.element.append(this.actions.changelease.element);

        // Add CreateSnapshot
        if (this.actions.createsnapshot) this.element.append(this.actions.createsnapshot.element);

        // Add RevertSnapshot
        if (this.actions.revertsnapshot) this.element.append(this.actions.revertsnapshot.element);

        // Add DeleteSnapshot
        if (this.actions.deletesnapshot) this.element.append(this.actions.deletesnapshot.element);
    };

    return ActionList;
})();
