/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * This script file fills the request detail modal window with
 * varying content
 */

(function ($) {
    /**
     * Current bound RequestItem instance on the opened modal window
     *
     * @private
     */
    var boundItemInstance = null;

    /**
     * Fill request item details into the modal window
     *
     * @private
     */
    function fillModalWindowContent() {
        var itemInfo = boundItemInstance.itemInfo;

        $('.modal-title', this).text('Request: ' + boundItemInstance.name);
        $('.cpu', this).text(boundItemInstance.cpu);
        $('.memory', this).text(boundItemInstance.memory);
        $('.storage', this).text(boundItemInstance.storage);
        $('.cost', this).text(boundItemInstance.dailyCostStr);
        $('.lease', this).text(boundItemInstance.leaseDays);
        $('.cost-center', this).text(boundItemInstance.costCenter);
        $('.description', this).text(itemInfo.description);
        $('.reasons', this).text(itemInfo.reasons);
        $('.status', this).text(itemInfo.stateName);
    }

    // Fill data on request modal window open
    $('#requestDetail').on('show.bs.modal', function (event) {
        // Get SerivceItem instance bound on selected row
        boundItemInstance = $(event.relatedTarget).data('itemInstance');

        // Fill the modal window request item instance is ready
        var that = this;
        boundItemInstance.deferred.done(function () {
            fillModalWindowContent.call(that);
        });
    });
})(jQuery);
