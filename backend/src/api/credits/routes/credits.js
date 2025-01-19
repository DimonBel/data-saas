module.exports = {
    routes: [
      {
        method: "POST",
        path: "/credits/update",
        handler: "credits.updateCredits",
        config: {
          policies: [],
          auth: false,  // Set to true if authentication is required
        },
      },
    ],
  };
  