"use strict";

module.exports = {
  async updateCredits(ctx) {
    const { email, packageName } = ctx.request.body;

    if (!email || !packageName) {
      return ctx.badRequest("Missing email or package name.");
    }

    try {
      // Find the package details in the database
      const creditPackage = await strapi.entityService.findMany('api::credit-package.credit-package', {
        filters: { Name: packageName },
      });

      if (!creditPackage.length) {
        return ctx.notFound("Credit package not found.");
      }

      const packageDetails = creditPackage[0];

      // Find the user by email
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email },
        select: ['id', 'credits'],
      });

      if (!user) {
        return ctx.notFound("User not found.");
      }

      // Add credits to user
      const updatedCredits = (user.credits || 0) + packageDetails.Credits;
      await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: { credits: updatedCredits },
      });

      return ctx.send({ message: "Credits updated successfully", newCredits: updatedCredits });
    } catch (error) {
      console.error("Error updating credits:", error);
      return ctx.internalServerError("An error occurred while updating credits.");
    }
  },
};
