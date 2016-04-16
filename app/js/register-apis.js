/**
 * Copyright © 2016 VMware, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0
 * Some files may be comprised of various open source software components, each of which
 * has its own license that is located in the source code of the respective component.
 */

/**
 * This file registers all the vRA API that will be used in this demo app
 * For more detail, please see vra.js
 */

// Register vRA server
vra.registerServer(conf.vraDomain);

/**
 * vra.api.tokens.post
 *
 * Registers token api.
 * Use POST request to retrieve a new token without the tokenId
 *
 * Documentation:
 *
 *   https://YOUR_VRA_DOMAIN/identity/api/docs/resource_Token.html#path__api_tokens.html
 */
vra.registerApi('tokens', '/identity/api/tokens', 'POST');

/**
 * vra.api.tokensWithId.head
 *
 * Registers token api with token id.
 * Use HEAD request to validate if a given token is still valid
 *
 * Documentation:
 *
 *   https://YOUR_VRA_DOMAIN/identity/api/docs/resource_Token.html#path__api_tokens_-tokenId-.html
 */
vra.registerApi('tokensWithId', '/identity/api/tokens/{tokenId}', 'HEAD');

/**
 * vra.api.tokensWithId.delete
 *
 * Registers token api with token id
 * Use DELETE request to delete the user token
 *
 * Documentation:
 *
 *   https://YOUR_VRA_DOMAIN/identity/api/docs/resource_Token.html#path__api_tokens_-tokenId-.html
 */
vra.registerApi('tokensWithId', '/identity/api/tokens/{tokenId}', 'DELETE');

/**
 * vra.api.subtenantsWithTenantAndUser.get
 *
 * Registers subtenants api with tenant id and user id
 * Use GET request to list all the subtenants that a user belongs to
 *
 * Note: subtenant is just business group
 *
 * Documentation:
 *
 *   https://YOUR_VRA_DOMAIN/identity/api/docs/resource_BusinessGroup.html#path__api_tenants_-tenantId-_principals_-userId-_subtenants.html
 */
vra.registerApi('subtenantsWithTenantAndUser', '/identity/api/tenants/{tenantId}/principals/{userId}/subtenants', 'GET');

/**
 * vra.api.entitledCatalogItems.get
 *
 * Registers entitled catalog api.
 * Use GET request to list all consumer entitled catalog item
 *
 * Documentation:
 *
 *   https://YOUR_VRA_DOMAIN/catalog-service/api/docs/resource_ConsumerEntitledCatalogItem.html#path__api_consumer_entitledCatalogItems.html
 */
vra.registerApi('entitledCatalogItems', '/catalog-service/api/consumer/entitledCatalogItems', 'GET');

/**
 * vra.api.entitledCatalogRequestSchema.get
 *
 * Registers catalog item schema api with catalog id.
 * Use GET request to get the item schema which include detail like cpu, memory, storage...etc.
 *
 * Documentation:
 *
 *   https://YOUR_VRA_DOMAIN/catalog-service/api/docs/resource_ConsumerEntitledCatalogItem.html#path__api_consumer_entitledCatalogItems_-id-_requests_schema.html
 */
vra.registerApi('entitledCatalogRequestSchema', '/catalog-service/api/consumer/entitledCatalogItems/{catalogId}/requests/schema', 'GET');

/**
 * vra.api.entitledCatalogRequestTemplate.get
 *
 * Registers catalog request template api with catalog id.
 * Use GET request to retrieves a template request in preparation for submitting a catalog item provisioning request.
 *
 * Documentation:
 *
 *   https://YOUR_VRA_DOMAIN/catalog-service/api/docs/resource_ConsumerEntitledCatalogItem.html#path__api_consumer_entitledCatalogItems_-id-_requests_template.html
 */
vra.registerApi('entitledCatalogRequestTemplate', '/catalog-service/api/consumer/entitledCatalogItems/{catalogId}/requests/template', 'GET');

/**
 * vra.api.entitledCatalogRequest.post
 *
 * Registers catalog request api with catalog id; this can create and save a catalog item provisioning request for the specific catalog item
 *
 * Documentation:
 *
 *   https://YOUR_VRA_DOMAIN/catalog-service/api/docs/resource_ConsumerEntitledCatalogItem.html#path__api_consumer_entitledCatalogItems_-id-_requests.html
 */
vra.registerApi('entitledCatalogRequest', '/catalog-service/api/consumer/entitledCatalogItems/{catalogId}/requests', 'POST');

/**
 * vra.api.requests.get
 *
 * Registers request api.
 * Use GET request to list all requests the current user.
 *
 * Documentation:
 *
 *   https://YOUR_VRA_DOMAIN/catalog-service/api/docs/resource_Request.html#path__api_consumer_requests.html
 */
vra.registerApi('requests', '/catalog-service/api/consumer/requests', 'GET');

/**
 * vra.api.resourceViews.get
 *
 * Registers resource view api
 * Use GET request to list the resources that were provisioned.
 *
 * Documentation:
 *
 *   https://YOUR_VRA_DOMAIN/catalog-service/api/docs/resource_Resource.html#path__api_consumer_resourceViews.html
 */
vra.registerApi('resourceViews', '/catalog-service/api/consumer/resourceViews', 'GET');

/**
 * vra.api.resourceActionFormsRequest.get
 *
 * Registers action form request api
 * Use GET request to retrieve the form for triggering a resource action.
 *
 * Documentation:
 *
 *   https://YOUR_VRA_DOMAIN/catalog-service/api/docs/resource_Resource.html#path__api_consumer_resources_-resourceId-_actions_-resourceActionId-_forms_request.html
 *
 */
vra.registerApi('resourceActionFormsRequest', '/catalog-service/api/consumer/resources/{resourceId}/actions/{resourceActionId}/forms/request', 'GET');

/**
 * vra.api.resourceActionFormsRequestValues.post
 *
 * Registers action form request values api
 * Use POST request to retrieve the permissible values for the specified field.
 *
 * Documentation:
 *
 *   https://YOUR_VRA_DOMAIN/catalog-service/api/docs/resource_Resource.html#path__api_consumer_resources_-resourceId-_actions_-resourceActionId-_forms_request_-elementId-_values.html
 *
 */
vra.registerApi('resourceActionFormsRequestValues', '/catalog-service/api/consumer/resources/{resourceId}/actions/{resourceActionId}/forms/request/{elementId}/values', 'POST');

/**
 * vra.api.costsUpfront.post
 *
 * Registers blueprint cost upfront api
 * Use POST request to retrieve the cost information for a blueprint
 *
 * No documentation yet
 */
vra.registerApi('costsUpfront', '/composition-service/api/blueprints/{blueprintId}/costs/upfront', 'POST');
