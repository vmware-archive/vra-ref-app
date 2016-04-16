/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * This script file fills the machine detail modal window with
 * varying content and an action list, and handles the form action
 * behaviors.
 *
 * Stylesheet:
 *
 *   css/machine-detail.css
 */

(function ($) {
    /**
     * Current bound MachineItem instance on the opened modal window
     *
     * @private
     */
    var boundItemInstance;

    /**
     * Map of the form action instance names and tab elements
     *
     * @private
     */
    var formActionTabMap = {
            ChangeLease: '.machine-lease',
            CreateSnapshot: '.machine-snapshot',
            DeleteSnapshot: '.machine-snapshot',
            RevertSnapshot: '.machine-snapshot'
        };

    /**
     * Initialize the lease form content
     *
     * @private
     */
    function initLeaseForm() {
        var expireDate = new Date(boundItemInstance.itemInfo.data.MachineExpirationDate);
        var yyyy = expireDate.getFullYear(),
            mm = expireDate.getMonth() + 1,
            dd = expireDate.getDate();

        mm = mm < 10 ? ('0' + mm) : mm;
        dd = dd < 10 ? ('0' + dd) : dd;

        var expireDateInputValue = yyyy + '-' + mm + '-' + dd;

        $('#machineLease input', this).val(expireDateInputValue);
    }

    /**
     * Initialize the snapshot content
     *
     * @private
     */
    function initSnapshotContent() {
        var that = this;
        var createSnapshot = boundItemInstance.actionList.actions.createsnapshot;

        // If the current bound item has the snapshot tree, append the
        // snapshot tree element
        if (boundItemInstance.deferred) {
            boundItemInstance.deferred.then(function () {
                var snapshotTreeElem = boundItemInstance.snapshotTree.element;

                $('#machineSnapshot', that).prepend(snapshotTreeElem);
                $('.snapshot-item', snapshotTreeElem).addClass('collapse-in');
                $('.collapse', snapshotTreeElem).collapse('show');

                // Unbind previous click handler of every revert snapshot and
                // delete snapshot buttons
                $('.revert-snapshot, .delete-snapshot', snapshotTreeElem).off('click');

                // Revert snapshot on click
                $('.revert-snapshot', snapshotTreeElem).on('click', function () {
                    var action = boundItemInstance.actionList.actions.revertsnapshot;
                        actionData = action.cloneTemplate();

                    var snapshotReference = $(this).parents('.snapshot')
                            .data('snapshotInstance').underlyingValue;

                    actionData.data['provider-SnapshotReference'] = snapshotReference;

                    action.execute(actionData);
                })

                // Delete snapshot on click
                $('.delete-snapshot', snapshotTreeElem).on('click', function () {
                    var action = boundItemInstance.actionList.actions.deletesnapshot;
                        actionData = action.cloneTemplate();

                    var snapshotReference = $(this).parents('.snapshot')
                            .data('snapshotInstance').underlyingValue;

                    actionData.data['provider-SnapshotReference'] = snapshotReference;

                    action.execute(actionData);
                });
            });
        }

        // If the current bound item has create snapshot action, show the
        // create snapshot form
        if (createSnapshot) {
            $('#machineSnapshot .create-snapshot', this).addClass('showing');
            createSnapshot.deferred.then(function () {
                var inputName = createSnapshot.template.data['provider-SnapshotInputName'];

                $('#machineSnapshot .create-snapshot-form input', that).val(inputName);
            });
        }
    }

    /**
     * Fill machine item details into the modal window
     *
     * @private
     */
    function fillModalWindowContent() {
        var itemInfo = boundItemInstance.itemInfo,
            expireDate = new Date(itemInfo.data.MachineExpirationDate);

        $('.modal-title', this).text('Machine: ' + boundItemInstance.name);
        $('.cpu', this).text(itemInfo.data.MachineCPU);
        $('.memory', this).text(itemInfo.data.MachineMemory);
        $('.storage', this).text(itemInfo.data.MachineStorage);
        $('.cost', this).text(boundItemInstance.dailyCostStr);
        $('.description', this).text(itemInfo.description);
        $('.status', this).text(itemInfo.status);

        initLeaseForm.call(this);
        initSnapshotContent.call(this);
    }

    /**
     * Disable form edit
     * Add disabled attribute and remove value cache for all the input elements
     * Allow Undo the changes for all the input
     *
     * @param formElem {element} The form element that's going to be disabled
     * @param undo {boolean} Undo the changes or not
     * @private
     */
    function disableForm(formElem, undo) {
        formElem.removeClass('editing');

        $('input', formElem).each(function () {
            if (undo) $(this).val($(this).data('cache'));

            $(this).removeData('cache').attr('disabled', true);
        });
    }

    /**
     * Enable form edit
     * Remove disabled attribute and cache the current value for all the input elements
     *
     * @param formElem {element} The form element that's going to be enabled
     * @private
     */
    function enableForm(formElem) {
        formElem.addClass('editing');

        $('input', formElem).each(function () {
            $(this).data('cache', $(this).val()).attr('disabled', false);
        });
    }

    // Initialize the modal window content
    $('#machineDetail').on('show.bs.modal', function (event) {
        var that = this;

        // Get machine information from the MachineItem instance bound on selected row
        boundItemInstance = $(event.relatedTarget).data('itemInstance');

        var asideContent = $('.modal-aside .modal-content', this),
            actionListElem = boundItemInstance.actionList.element,
            actions = boundItemInstance.actionList.actions;

        // Fill data on request modal window open
        fillModalWindowContent.call(this);

        // Init the tabs
        $('.nav-tabs a:eq(0)', this).tab('show');

        for (var p in formActionTabMap) {
            // If action exist, show the tab
            if (actions[p.toLowerCase()]) {
                $(formActionTabMap[p], this).addClass('showing');
            }
        }

        // Insert the action list elements
        asideContent.prepend(actionListElem);

        // Unbind previous click handler of each action element first
        $('li.action', actionListElem).off('click');

        // Execute normal action on click
        $('li:not(.form-action)', actionListElem).on('click', function () {
            $(this).data('actionInstance').execute();
        });

        // Open the tab content on form action click
        $('li.form-action', actionListElem).on('click', function () {
            $(formActionTabMap[$(this).data('actionInstance').name] + ' a', that).tab('show');
        });
    });

    // Show the action list when modal window is shown
    $('#machineDetail').on('shown.bs.modal', function (event) {
        $('.modal-aside', this).removeClass('hiding');
    });

    // Back to init state on machine modal window close
    $('#machineDetail').on('hide.bs.modal', function (event) {
        // Hide the action list
        $('.modal-aside', this).addClass('hiding');

        // Hide all tabs, hide the create snapshot button,
        $('.nav-tabs .action-tab', this).removeClass('showing');

        // Hide the create snapshot form
        $('#machineSnapshot .create-snapshot', this).removeClass('showing');

        boundItemInstance = null;
    });

    // Inorder to keep the data bound on action list and it's children, and the
    // snapshot tree detach them instead of remove them from the DOM tree
    $('#machineDetail').on('hidden.bs.modal', function (event) {
        $('.modal-aside .action-list', this).detach();
        $('#machineSnapshot .snapshot-tree', this).detach();
    });

    // Start form edit
    $('#machineDetail form .btn-edit').on('click', function (event) {
        var formElem = $(this).parents('#machineDetail form');

        enableForm(formElem);
    });

    // Cancel form edit and undo the changes
    $('#machineDetail form .btn-cancel').on('click', function (event) {
        var formElem = $(this).parents('#machineDetail form');

        disableForm(formElem, true);
    });

    // Change lease form submit handler
    $('#machineDetail #machineLease form').on('submit', function (event) {
        event.preventDefault();

        disableForm($(this));

        var action = boundItemInstance.actionList.actions.changelease,
            actionData = action.cloneTemplate();
        var expireDateArr = $('input', this).val().split('-'),
            expireDate = new Date(expireDateArr[0], expireDateArr[1] - 1, expireDateArr[2]);

        actionData.data['provider-ExpirationDate'] = expireDate.toISOString();

        action.execute(actionData);
    });

    // Create snapshot on click
    $('#machineDetail #machineSnapshot .create-snapshot-form').on('submit', function (event) {
        event.preventDefault();

        var action = boundItemInstance.actionList.actions.createsnapshot,
            actionData = action.cloneTemplate();

        actionData.data['provider-SnapshotInputName'] = $('input', this).val();

        action.execute(actionData);
    });
})(jQuery);
