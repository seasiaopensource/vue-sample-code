import _ from 'lodash'

export const getPaginatedItems = (items, pageNo, perPage) => {
  var page = pageNo || 1
  var perPageItems = perPage || 4
  var offset = (page - 1) * perPageItems
  var paginatedItems = _.drop(items, offset).slice(0, perPageItems)
  return {
    page: page,
    perPage: perPageItems,
    total: items.length,
    totalPages: Math.ceil(items.length / perPageItems),
    data: paginatedItems
  }
}
