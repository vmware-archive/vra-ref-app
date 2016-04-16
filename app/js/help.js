/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * This file grabs the help doc text from resources/help.json and generates
 * paragraphs in help.html
 */

$.ajax({
    method: 'GET',
    url: 'resources/help.json',
    headers: {
        Accept: 'application/json',
    },
    success: function (res) {
        var topics = res.topics;

        for (var i = 0; i < topics.length; i++) {
            var topic = topics[i];
            var htmlStr = '<h3>' + topic.title + '</h3>' +
                          '<p>' + topic.description + '</p>' +
                          (topic.moreInfo ? '<a href="' + topic.moreInfo + '" target="_blank">more info</a>' : '');

            $('#main').append(htmlStr);
        }
    }
});
