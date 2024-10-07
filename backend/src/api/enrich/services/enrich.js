'use strict';

/**
 * enrich service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::enrich.enrich');
