const express = require('express')
const config = require('../../../config/config')

const user = require('./user')

const router = express.Router()

const defaultRoutes = [
  {
    path: '/user',
    route: user,
  },
]

// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: '/docs',
//     route: docsRoute,
//   },
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

module.exports = router
