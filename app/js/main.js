/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * Your Cloud app main script file
 * This script file handles application behaviors, which are mainly
 * show/hide bootstrap tab contents and UI stuff in each tab
 */

app.ready(function () {
    // Initialize the business group filter
    for (var i = 0; i < app.subtenants.length; i++) {
        var subtenant = app.subtenants[i];

        $('#main .table-tool-bar .table-businessgroup select')
                .append('<option value="' + subtenant.id + '">' + subtenant.name + '</option>');
    }

    // Enable all bootstrap tabs
    $('#mainTabs a').click(function (event) {
        event.preventDefault();

        // Display the target tab
        $(this).tab('show');
    }).on('show.bs.tab', function (event) {
        var tabName = $(this).attr('aria-controls'),
            tableElem = $('#' + tabName + ' table');

        // Show loading animation icon
        tableElem.on('tablerefreshstart', function (event, params) {
            $('#mainTabs ' + 'a[aria-controls=' + params.tab + '] .loading-icon').addClass('loading');
        });

        // Hide loading animation icon
        tableElem.on('tablerefreshend', function (event, params) {
            $('#mainTabs ' + 'a[aria-controls=' + params.tab + '] .loading-icon').removeClass('loading');
        });

        // Create table intance if not exist and bind it to the element
        if (!tableElem.data('tableInstance')) {
            var tableOptions = {};
            var businessgroupFilterElem = $('.table-businessgroup .input-group[data-table=#' + tableElem.attr('id') + ']');

            // If business group filter for this table exists, pass the default business group id to the
            // table constructor
            if (businessgroupFilterElem) tableOptions.businessgroupId = $('select', businessgroupFilterElem).val();

            var tableInstance = tableFactory.create(tabName, tableElem, tableOptions);

            tableElem.data('tableInstance', tableInstance);
        }
    });

    // Initialize, show the first tab content by default
    $('#mainTabs a:eq(0)').tab('show');

    // Change table search bar width on focus
    $('#main .table-tool-bar .table-search > input').on('focus', function () {
        $(this).parent().width(500);
    });

    // Change table search bar width back on focus out
    $('#main .table-tool-bar .table-search > input').on('focusout', function () {
        $(this).parent().width(300);
    });

    // Execute target table search method on value change
    $('#main .table-tool-bar .table-search > input').on('change', function () {
        $($(this).parent().attr('data-table')).data('tableInstance').search($(this).val());
    });

    // Initialize pagination and sort icon on table ready
    $('#main .table').on('tableready', function () {
        var tableId = $(this).attr('id'),
            paginationElem = $('.table-pagination[data-table=#' + tableId + ']');

        var tableInstance = $(this).data('tableInstance');

        var sortElem = $('.table-sort[data-sort="' + tableInstance.sortProp + '"]', this),
            prevSortElem = $('.table-sort:not(.glyphicon-sort)', this);

        var sortIconRegex = /(\sglyphicon-sort)([^\s]*)/,
            sortIconSuffix = '-by-alphabet' + (tableInstance.sortDesc ? '-alt' : '');

        // Fill the pagination totalPages and pageNumber
        $('.totalPages', paginationElem).text(tableInstance.metadata.totalPages);
        $('.pageNumber', paginationElem).val(tableInstance.metadata.number);

        // If the previous sort column and the current sort column are different, set the
        // previous column icon to default
        if (prevSortElem.length > 0 && prevSortElem[0] !== sortElem[0])
                prevSortElem[0].className = prevSortElem[0].className.replace(sortIconRegex, '$1');

        sortElem[0].className = sortElem[0].className.replace(sortIconRegex, '$1' + sortIconSuffix);
    });

    // Execute target table pagination
    $('#main .table-pagination button').on('click', function () {
        var action = $(this).attr('data-pagination');
        var paginationElem = $(this).parents('.table-pagination'),
            tableInstance = $(paginationElem.attr('data-table')).data('tableInstance');;

        switch(action) {
        case 'first':
            tableInstance.pagination(1);
            break;
        case 'prev':
            tableInstance.pagination(tableInstance.pageNumber - 1);
            break;
        case 'next':
            tableInstance.pagination(tableInstance.pageNumber + 1);
            break;
        case 'last':
            tableInstance.pagination(tableInstance.metadata.totalPages);
            break;
        case 'refresh':
            tableInstance.pagination(Number($('.pageNumber', paginationElem).val()));
            break;
        }
    });

    // Execute target table sort on table header click
    $('#main .table-sort').on('click', function () {
        var sortProp = $(this).attr('data-sort');
        var tableInstance = $(this).parents('table').data('tableInstance');
        var prevSortProp = tableInstance.sortProp;

        tableInstance.sort(sortProp, sortProp == prevSortProp ? !tableInstance.sortDesc : false);
    });

    // If the business group is changed, regenerate the target table rows
    $('#main .table-tool-bar .table-businessgroup select').on('change', function (event) {
        $($(this).parent().attr('data-table')).data('tableInstance').filterByBusinessgroup($(this).val());
    });
});
