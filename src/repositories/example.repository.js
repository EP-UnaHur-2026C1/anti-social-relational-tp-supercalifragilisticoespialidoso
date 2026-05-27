const items = []
let nextId = 1

export const findAll = () => items

export const findById = (id) => items.find((i) => i.id === id)

export const create = (data) => {
  const item = { id: nextId++, ...data }
  items.push(item)
  return item
}

export const update = (id, data) => {
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return null
  items[index] = { ...items[index], ...data }
  return items[index]
}

export const remove = (id) => {
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return false
  items.splice(index, 1)
  return true
}
