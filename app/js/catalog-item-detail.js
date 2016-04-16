/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * This script file sets up the form behaviors in the catalog item detail
 * modal window
 *
 * Stylesheet:
 *
 *   css/catalog-item-detail.css
 */

(function ($) {
    /**
     * Current bound CatalogItem instance on the opened modal window
     *
     * @private
     */
    var boundItemInstance;

    /**
     * Fill catalog item details into the modal window
     *
     * @private
     */
    function fillModalWindowContent() {
        var itemName = boundItemInstance.itemInfo.catalogItem.name;

        $('.modal-title', this).text('Catalog: ' + itemName);
        $('.cpu', this).text(boundItemInstance.cpu);
        $('.memory', this).text(boundItemInstance.memory);
        $('.storage', this).text(boundItemInstance.storage);
        $('.lease', this).val(boundItemInstance.leaseDays);
        $('.cost-center, .description, .reasons', this).val(null);

        // The dailyCostStr is from vRB which might not been installed
        // If dailyCostStr exists, display it, otherwise, hide the daily cost
        if (boundItemInstance.dailyCostStr) {
            $('.cost', this).text(boundItemInstance.dailyCostStr);
        } else {
            $('.cost', this).parents('.form-group').addClass('hiding');
        }
    }

    /**
     * Change the form-stat-* class name in order to change the form button group
     *
     * @param elem {element} The catalog item modal window DOM element
     * @param suffix {string} The suffix for form-stat-* class name; can be
     *    'displaying', 'editing', or 'submitted'
     * @private
     */
    function changeFormStatClassName(elem, suffix) {
        elem.className = elem.className.replace(/(\sform-stat-)([^\s]*)/, '$1' + suffix);
    }

    // Fill data on catalog item modal window open
    $('#catalogitemDetail').on('show.bs.modal', function (event) {
        changeFormStatClassName(this, 'displaying');

        // Get SerivceItem instance bound on selected row
        boundItemInstance = $(event.relatedTarget).data('itemInstance');

        // Fill the modal window when cost, schema, and template are fully loaded
        var that = this;
        boundItemInstance.deferred.always(function () {
            fillModalWindowContent.call(that);
        });
    });

    // Show the collapse form and change button group
    $('#catalogitemDetail .btn-request').on('click', function () {
        changeFormStatClassName($('#catalogitemDetail')[0], 'editing');

        // Unlock the lease input
        $('#catalogitemDetail .lease').prop('disabled', false);
    });

    // Back to init state on catalog item modal window close
    $('#catalogitemDetail').on('hidden.bs.modal', function (event) {
        // Unlock all the inputs but the lease input
        $('input, textarea, button', this).prop('disabled', false);
        $('.lease', this).prop('disabled', true);
        $('.cost', this).parents('.form-group').removeClass('hiding');

        // Hide the Collapse form
        $('#catalogitemCollapseForm').collapse('hide');

        // Close the message toast dialog if it's still there
        app.messageToast.closeDialog();

        // Remove the bound item instance
        boundItemInstance = null;
    });

    // Check the input value and submit a catalog request
    $('#catalogitemDetail form').on('submit', function (event) {
        event.preventDefault();

        var that = this;

        $('input, textarea, button:not(.btn-ok)', this).prop('disabled', true);

        // Prepare POST request payload
        var payload = $.extend(true, {}, boundItemInstance.requestTemplate);
        payload.description = $('.description', this).val();
        payload.reasons = $('.reasons', this).val();
        payload.data._leaseDays = Number($('.lease', this).val());

        var machineData = payload.data[boundItemInstance.blueprintMachineName].data;

        machineData.cost_center = $('.cost-center', this).val();

        // Send catalog request with vRA API
        vra.api.entitledCatalogRequest.post({catalogId: payload.catalogItemId}, payload, function () {
            app.messageToast.castMessage('Your request has been submitted!', 'success');
            changeFormStatClassName($('#catalogitemDetail')[0], 'submitted');
        }, function () {
            app.messageToast.castMessage(xhr.responseJSON.errors[0].message, 'danger', 'Error');
            $('input, textarea, button', that).prop('disabled', false);
        });
    });
})(jQuery);
