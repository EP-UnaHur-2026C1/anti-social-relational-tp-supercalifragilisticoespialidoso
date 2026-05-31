import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'

process.env.NODE_ENV = 'test'

const { app } = await import('../src/app.js')
const { sequelize } = await import('../src/models/index.js')

let server
let baseUrl

const request = async (path, options = {}) => {
  const headers = { ...(options.headers ?? {}) }
  const requestOptions = { ...options, headers }

  if (requestOptions.body && typeof requestOptions.body !== 'string') {
    headers['content-type'] = 'application/json'
    requestOptions.body = JSON.stringify(requestOptions.body)
  }

  const response = await fetch(`${baseUrl}${path}`, requestOptions)
  const text = await response.text()
  const body = text ? JSON.parse(text) : null

  return { response, body }
}

const postJson = (path, body) => request(path, { method: 'POST', body })
const putJson = (path, body) => request(path, { method: 'PUT', body })
const deleteJson = (path) => request(path, { method: 'DELETE' })

const createUser = (overrides = {}) =>
  postJson('/api/users', {
    nickName: overrides.nickName ?? 'ana',
    email: overrides.email ?? 'ana@example.com',
    name: overrides.name ?? 'Ana Perez',
  })

before(async () => {
  await sequelize.sync({ force: true })

  server = app.listen(0)
  await new Promise((resolve) => {
    server.once('listening', resolve)
  })

  const { port } = server.address()
  baseUrl = `http://127.0.0.1:${port}`
})

beforeEach(async () => {
  await sequelize.sync({ force: true })
})

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()))
  })
  await sequelize.close()
})

test('crea, lista, obtiene, actualiza y elimina usuarios', async () => {
  const created = await createUser()

  assert.equal(created.response.status, 201)
  assert.equal(created.body.nickName, 'ana')
  assert.equal(created.body.email, 'ana@example.com')

  const list = await request('/api/users')

  assert.equal(list.response.status, 200)
  assert.equal(list.body.length, 1)
  assert.equal(list.body[0].id, created.body.id)

  const detail = await request(`/api/users/${created.body.id}`)

  assert.equal(detail.response.status, 200)
  assert.equal(detail.body.id, created.body.id)
  assert.deepEqual(detail.body.posts, [])
  assert.deepEqual(detail.body.followers, [])
  assert.deepEqual(detail.body.following, [])

  const updated = await putJson(`/api/users/${created.body.id}`, { name: 'Ana Gomez' })

  assert.equal(updated.response.status, 200)
  assert.equal(updated.body.name, 'Ana Gomez')

  const removed = await deleteJson(`/api/users/${created.body.id}`)

  assert.equal(removed.response.status, 200)
  assert.equal(removed.body.id, created.body.id)

  const missing = await request(`/api/users/${created.body.id}`)

  assert.equal(missing.response.status, 404)
})

test('no permite crear dos usuarios con el mismo nickName', async () => {
  await createUser()
  const duplicated = await createUser({ email: 'otra@example.com' })

  assert.equal(duplicated.response.status, 409)
  assert.equal(duplicated.body.error, 'El valor ya existe')
  assert.equal(duplicated.body.campo, 'nickName')
})

test('permite seguir y dejar de seguir usuarios', async () => {
  const follower = await createUser({ nickName: 'ana', email: 'ana@example.com' })
  const followed = await createUser({
    nickName: 'beto',
    email: 'beto@example.com',
    name: 'Beto Ruiz',
  })

  const follow = await postJson(`/api/users/${follower.body.id}/follow/${followed.body.id}`)

  assert.equal(follow.response.status, 204)

  const detail = await request(`/api/users/${follower.body.id}`)

  assert.equal(detail.response.status, 200)
  assert.equal(detail.body.following.length, 1)
  assert.equal(detail.body.following[0].id, followed.body.id)

  const unfollow = await deleteJson(`/api/users/${follower.body.id}/unfollow/${followed.body.id}`)

  assert.equal(unfollow.response.status, 204)

  const detailAfterUnfollow = await request(`/api/users/${follower.body.id}`)

  assert.equal(detailAfterUnfollow.response.status, 200)
  assert.deepEqual(detailAfterUnfollow.body.following, [])
})

test('crea, obtiene y actualiza posts', async () => {
  const user = await createUser()
  const created = await postJson('/api/posts', {
    description: 'Primer post',
    userId: user.body.id,
  })

  assert.equal(created.response.status, 201)
  assert.equal(created.body.description, 'Primer post')
  assert.equal(created.body.userId, user.body.id)

  const list = await request('/api/posts')

  assert.equal(list.response.status, 200)
  assert.equal(list.body.length, 1)
  assert.equal(list.body[0].user.id, user.body.id)

  const detail = await request(`/api/posts/${created.body.id}`)

  assert.equal(detail.response.status, 200)
  assert.equal(detail.body.id, created.body.id)
  assert.deepEqual(detail.body.images, [])
  assert.deepEqual(detail.body.tags, [])
  assert.deepEqual(detail.body.comments, [])

  const updated = await putJson(`/api/posts/${created.body.id}`, {
    description: 'Post editado',
  })

  assert.equal(updated.response.status, 200)
  assert.equal(updated.body.description, 'Post editado')
})

test('agrega y elimina imagenes de un post', async () => {
  const user = await createUser()
  const post = await postJson('/api/posts', {
    description: 'Post con imagen',
    userId: user.body.id,
  })

  const image = await postJson(`/api/posts/${post.body.id}/images`, {
    url: 'https://example.com/image.png',
  })

  assert.equal(image.response.status, 201)
  assert.equal(image.body.postId, post.body.id)
  assert.equal(image.body.url, 'https://example.com/image.png')

  const detail = await request(`/api/posts/${post.body.id}`)

  assert.equal(detail.response.status, 200)
  assert.equal(detail.body.images.length, 1)
  assert.equal(detail.body.images[0].id, image.body.id)

  const removed = await deleteJson(`/api/posts/${post.body.id}/images/${image.body.id}`)

  assert.equal(removed.response.status, 200)
  assert.equal(removed.body.id, image.body.id)
})

test('crea tags y los asocia a posts', async () => {
  const user = await createUser()
  const post = await postJson('/api/posts', {
    description: 'Post tagueado',
    userId: user.body.id,
  })
  const tag = await postJson('/api/tags', { name: 'sqlite' })

  assert.equal(tag.response.status, 201)
  assert.equal(tag.body.name, 'sqlite')

  const addTag = await postJson(`/api/posts/${post.body.id}/tags`, { tagId: tag.body.id })

  assert.equal(addTag.response.status, 204)

  const detail = await request(`/api/posts/${post.body.id}`)

  assert.equal(detail.response.status, 200)
  assert.equal(detail.body.tags.length, 1)
  assert.equal(detail.body.tags[0].id, tag.body.id)

  const tagDetail = await request(`/api/tags/${tag.body.id}`)

  assert.equal(tagDetail.response.status, 200)
  assert.equal(tagDetail.body.posts.length, 1)
  assert.equal(tagDetail.body.posts[0].id, post.body.id)

  const removed = await deleteJson(`/api/posts/${post.body.id}/tags/${tag.body.id}`)

  assert.equal(removed.response.status, 200)
  assert.equal(removed.body.id, tag.body.id)
})

test('crea, lista, actualiza y elimina comentarios visibles', async () => {
  const user = await createUser()
  const post = await postJson('/api/posts', {
    description: 'Post comentado',
    userId: user.body.id,
  })

  const created = await postJson('/api/comments', {
    text: 'Buen post',
    postId: post.body.id,
    userId: user.body.id,
  })

  assert.equal(created.response.status, 201)
  assert.equal(created.body.text, 'Buen post')

  const list = await request('/api/comments')

  assert.equal(list.response.status, 200)
  assert.equal(list.body.length, 1)
  assert.equal(list.body[0].user.id, user.body.id)
  assert.equal(list.body[0].post.id, post.body.id)

  const updated = await putJson(`/api/comments/${created.body.id}`, {
    text: 'Muy buen post',
    isVisible: false,
  })

  assert.equal(updated.response.status, 200)
  assert.equal(updated.body.text, 'Muy buen post')
  assert.equal(updated.body.isVisible, false)

  const visibleList = await request('/api/comments')

  assert.equal(visibleList.response.status, 200)
  assert.deepEqual(visibleList.body, [])

  const removed = await deleteJson(`/api/comments/${created.body.id}`)

  assert.equal(removed.response.status, 200)
  assert.equal(removed.body.id, created.body.id)
})

test('responde 404 cuando el recurso no existe', async () => {
  const user = await request('/api/users/9999')
  const post = await request('/api/posts/9999')
  const comment = await request('/api/comments/9999')
  const tag = await request('/api/tags/9999')

  assert.equal(user.response.status, 404)
  assert.equal(post.response.status, 404)
  assert.equal(comment.response.status, 404)
  assert.equal(tag.response.status, 404)
})
