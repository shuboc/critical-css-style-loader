const orderById = {} // id => order
const stylesById = {} // id => {id, parts}

let order = 0

// Output: [{id: 1, parts: [{id, css, media, sourceMap}, ...]}, ...]
const listToStylesById = list => {
  const styles = []
  const newStyles = {}

  list.forEach(item => {
    const [id, css, media, sourceMap] = item
    const part = {id, css, media, sourceMap}

    if (!newStyles[id]) {
      newStyles[id] = {id, parts: [part]}
      styles.push(newStyles[id])
    } else {
      newStyles[id].parts.push(part)
    }
  })

  return styles
}

const addStylesById = styles => {
  styles.forEach(item => {
    const domStyle = stylesById[item.id]
    if (domStyle) {
      domStyle.parts = item.parts
    } else {
      stylesById[item.id] = item
    }
  })
}

const addCss = content => {
  content.forEach(item => {
    const id = item[0]

    if (!orderById[id]) {
      orderById[id] = order++
    } else {
      // TODO: need to record all order for HMR to work?
    }
  })

  const styles = listToStylesById(content)
  addStylesById(styles)
}

const getCssByIds = ids => {
  const uniqueIds = new Set(ids)
  const stylesWithOrder = [...uniqueIds].map(id => ({styles: stylesById[id], order: orderById[id]}))
  stylesWithOrder.sort((s1, s2) => (s1.order - s2.order))

  return stylesWithOrder
    .map(styles => styles.styles.parts.map(part => part.css).join('')) // TODO: maybe sourceMap?
    .join('')
}

module.exports = addCss
module.exports.getCssByIds = getCssByIds
