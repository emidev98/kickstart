const routes = module.exports = require("next-routes")();

routes
    .add("/", "/App")
    .add("/campaigns/new", "/campaigns/NewCampaign")
    .add("/campaigns/:address", "/campaigns/Campaign")
    .add("/campaigns/:address/requests", "/campaigns/requests/Requests")
    .add("/campaigns/:address/requests/new", "/campaigns/requests/NewRequest")

module.exports = routes;