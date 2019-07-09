import _ from 'lodash'

// This function takes each route from 'additionalRoutes', looks in routes for a
// route with the same name, replaces it and returns the new routes array with
// all the routes replaced. If an additionalRoute couldn't be found in routes,
// a new route will be added to routes.
export default (additionalRoutes, routes) => {
  // make sure, that we don't do anything, when we get no new routes
  if (!additionalRoutes) {
    return routes
  }

  // cloneDeep, since we don't want to change the routes object that we got
  var clonedRoutes = _.cloneDeep(routes)

  _.each(additionalRoutes, (additionalRoute) => {
    var replaced = false
    var addToFather = !!additionalRoute.fatherName

    // replace the first level
    const replaceFirstLevel = (routesFirstLevel, additionalRoute) => {
      if (addToFather) {
        var fatherRoute = _.find(routesFirstLevel, {name: additionalRoute.fatherName})
        if (fatherRoute && fatherRoute.children) {
          fatherRoute.children.push(additionalRoute)
          replaced = true
        }
      } else {
        var oldRouteKey = _.findKey(routesFirstLevel, {name: additionalRoute.name})
        if (oldRouteKey || oldRouteKey === 0) {
          routesFirstLevel[oldRouteKey] = additionalRoute
          replaced = true
        }
      }
    }
    replaceFirstLevel(clonedRoutes, additionalRoute)

    // if nothing was replaced, recursively go into children
    if (replaced) return
    const replaceChildren = (routesFirstLevel, additionalRoute) => {
      var routesWithChildren = _.filter(routesFirstLevel, route => route.children && route.children.length)
      _.each(routesWithChildren, routeWithChildren => {
        replaceFirstLevel(routeWithChildren.children, additionalRoute)
        if (!replaced) replaceChildren(routeWithChildren.children, additionalRoute)
      })
    }
    replaceChildren(clonedRoutes, additionalRoute)

    // if we didn't replace any child, create a new route
    if (!replaced) clonedRoutes.push(additionalRoute)
  })

  return clonedRoutes
}
