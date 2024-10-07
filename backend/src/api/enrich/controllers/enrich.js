'use strict';

/**
 * enrich controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::enrich.enrich');
