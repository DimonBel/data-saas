'use strict';

/**
 * phone-valid service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::phone-valid.phone-valid');
