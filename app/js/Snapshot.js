/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * Snapshot Class, stores permissible form request value for provider-SnapshotReference
 * and generates an snapshot element that can be used in snapshot tree
 */

/**
 * Snapshot Constructor
 *
 * @class Snapshot
 * @param snapshotReference {object} Permissible form request value for
 *   provider-SnapshotReference of A snapshot
 */
function Snapshot(snapshotReference) {
    $.extend(this, snapshotReference);

    this.element = this.generateElement();

    // Initialize tooltip for revert button and delete button
    $('[data-toggle="tooltip"]', this.element).tooltip();

    this.hasChildren = false;
    this.children = [];
}

/**
 * Add a child snapshot
 *
 * @param snapshot {object} A Snapshot instance
 */
Snapshot.prototype.addChild = function (snapshot) {
    this.children.push(snapshot);

    // Append the child snapshot element
    $('#snapshot' + this.underlyingValue.id, this.element).append(snapshot.element);

    if (!this.hasChildren) {
        this.hasChildren = true;

        var collapseIcon = $('<span class="collapse-icon glyphicon"></span>');
        var snapshotItem = this.element.children('.snapshot-item');

        // Toggle the caret when open/close the collapsable box
        $('a', snapshotItem).prepend(collapseIcon).on('click', function () {
            snapshotItem.toggleClass('collapse-in');
        });
    }
}

/**
 * Generate snapshot element, which has a revert button, a delete button, and a collapsable
 * box to contain its children.
 *
 * Bind this Snapshot instance to the element
 *
 * @return {element} A jquery element of a snapshot
 */
Snapshot.prototype.generateElement = function () {
    var htmlStr = '<div class="snapshot">' +
                  '<div class="snapshot-item collapse-in">' +
                  '<a data-toggle="collapse" href="#snapshot' + this.underlyingValue.id + '">' +
                  this.label +
                  '</a>' +
                  '<button class="revert-snapshot btn btn-primary btn-xs" ' +
                  'data-toggle="tooltip" data-placement="bottom" title="Revert">' +
                  '<span class="glyphicon glyphicon-picture"></span>' +
                  '</button>' +
                  '<button class="delete-snapshot btn btn-primary btn-xs" ' +
                  'data-toggle="tooltip" data-placement="bottom" title="Delete">' +
                  '<span class="glyphicon glyphicon-fire"></span>' +
                  '</button>' +
                  '</div>' +
                  '<div class="collapse in" id="snapshot' + this.underlyingValue.id + '"></div>' +
                  '</div>';

    return $(htmlStr).data('snapshotInstance', this);
}
