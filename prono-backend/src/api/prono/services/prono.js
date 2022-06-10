'use strict';

/**
 * prono service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::prono.prono');
