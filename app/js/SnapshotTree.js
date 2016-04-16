/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * SnapshotTree Class, hosts Snapshot instances
 */

/**
 * SnapshotTree Constructor
 *
 * @class SnapshotTree
 */
function SnapshotTree() {
    this.element = this.generateElement();
    this.children = [];
}

/**
 * Add a snapshot
 */
SnapshotTree.prototype.addChild = function (snapshot) {
    this.children.push(snapshot);

    // Append the snapshot element
    $('.panel-body', this.element).append(snapshot.element);
}

/**
 * Generate snapshot tree element, which is a bootstrap panel
 *
 * @return {element} A jquery element of a snapshot tree
 */
SnapshotTree.prototype.generateElement = function () {
    var htmlStr = '<div class="snapshot-tree panel panel-default">' +
                  '<div class="panel-heading">Snapshot tree</div>' +
                  '<div class="panel-body"></div>' +
                  '</div>';

    return $(htmlStr).data('snapshotTreeInstance', this);
}
