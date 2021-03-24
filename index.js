const objectMap = require('object.map')
const isArray = require('is-array')
const isObject = require('is-object')
const { Op, } = require('sequelize')

module.exports = (json, models, Sequelize) => {
  return (new ParseOrder(models, Sequelize)).parse(json)
}

class ParseOrder {
  constructor (models, Sequelize) {
    this.models = models
    this.Sequelize = Sequelize
  }

  parse (json) {
    json.attributes = this.attributes(json.attributes)
    json.where = this.where(json.where)
    json.order = this.order(json.order)
    json.group = this.group(json.group)
    json.limit = this.limit(json.limit)
    json.offset = this.offset(json.offset)
    json.include = this.include(json.include)

    return json
  }

  attributes (attributes) {
    if (!attributes) return

    if (isArray(attributes)) {
      return attributes.map(attribute => {
        if (!isArray(attribute)) return this.fn(attribute)

        attribute[0] = this.fn(attribute[0])

        return attribute
      })
    }
    else {
      const types = [ 'include', 'exclude', ]

      attributes = JSON.parse(attributes)

      types.map(type => {
        if (!attributes[type]) return
        attributes[type] = attributes[type].map(attribute => {

          if (!isArray(attribute)) return attribute

          attribute[0] = this.fn(attribute[0])

          return attribute
        })
      })

      return attributes
    }
  }

  where (wheres) {
    if (!wheres) return

    if (typeof wheres === 'string') wheres = JSON.parse(wheres)

    const where = {}

    objectMap(wheres, (v, k) => {
      if (k.toLowerCase().indexOf('op.') === 0) k = Op[k.split('.')[1]]

      if (isObject(v) && !isArray(v)) v = this.where(v)

      k = this.fn(k)
      k = this.col(k)

      where[k] = v
    })

    return where
  }

  order (orders) {
    if (!orders) return

    if (typeof orders === 'string') orders = [ JSON.stringify(orders.split(' ')), ]

    return orders.map(order => JSON.parse(order))
  }

  group (groups) {
    if (!groups) return

    return groups
  }

  limit (limit) {
    if (!limit) return

    return typeof limit === 'number' ? limit : parseInt(limit)
  }

  offset (offset) {
    if (!offset) return

    return typeof offset === 'number' ? offset : parseInt(offset)
  }

  include (includes) {
    if (!includes) return

    if (typeof includes === 'string') includes = [ includes, ]

    return includes.map(include => {
      try {
        include = JSON.parse(include)
      }
      catch {
        include = { model: include, }
      }

      include.all = this.boolean(include.all)
      include.nested = this.boolean(include.nested)

      if (!include.all) delete include.all
      if (!include.nested) delete include.nested

      if (!include.all && !include.nested) {
        include.model = this.models[include.model]
        include.where = this.where(include.where)
        include.required = this.boolean(include.required)
        include.right = this.boolean(include.right)
        include.paranoid = this.boolean(include.paranoid)
        include.separate = this.boolean(include.separate)
        include.limit = this.limit(include.limit)
        include.offset = this.offset(include.offset)

        if (include.through) {
          include.through.attributes = this.attributes(include.through.attributes)
          include.through.where = this.where(include.through.where)
        }
      }

      return include
    })
  }

  boolean (boolean) {
    if (!boolean || typeof boolean !== 'string') return false

    return boolean.trim() === 'true' ? true : false
  }

  fn (fn) {
    if (typeof fn !== 'string' || fn.split('.')[0] !== 'fn') return fn

    fn = fn.split('.').slice(1).join('.')

    const name = fn.split('(')[0]
    const params = fn.split('(').slice(1).join('(').slice(0, -1).split(',').map(i => i.trim())

    return this.Sequelize.fn(
      name,
      this.col(params[0]),
      this.col(params[1]),
      this.col(params[2]),
      this.col(params[3]),
      this.col(params[4]),
      this.col(params[5]),
      this.col(params[6]),
      this.col(params[7]),
      this.col(params[8]),
      this.col(params[9]),
      this.col(params[10]),
      this.col(params[11]),
      this.col(params[12]),
      this.col(params[13]),
      this.col(params[14]),
      this.col(params[15]),
      this.col(params[16]),
      this.col(params[17]),
      this.col(params[18]),
      this.col(params[19]),
      this.col(params[20]),
      this.col(params[21]),
      this.col(params[22]),
      this.col(params[23]),
      this.col(params[24]),
      this.col(params[25]),
      this.col(params[26]),
      this.col(params[27]),
      this.col(params[28]),
      this.col(params[29]),
      this.col(params[30]),
      this.col(params[31]),
      this.col(params[32]),
      this.col(params[33]),
      this.col(params[34]),
      this.col(params[35]),
      this.col(params[36]),
      this.col(params[37]),
      this.col(params[38]),
      this.col(params[39]),
      this.col(params[40]),
      this.col(params[41]),
      this.col(params[42]),
      this.col(params[43]),
      this.col(params[44]),
      this.col(params[45]),
      this.col(params[46]),
      this.col(params[47]),
      this.col(params[48]),
      this.col(params[49]),
      this.col(params[50])
    )
  }

  col (col) {
    if (typeof col !== 'string' || col.split('(')[0] !== 'col') return col

    col =  col.split('(')[1].split(')')[0]

    return this.Sequelize.col(col)
  }
}