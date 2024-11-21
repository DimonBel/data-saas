'use strict';

/**
 * credit-package service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::credit-package.credit-package');
