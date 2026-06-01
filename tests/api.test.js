import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.js'
import { sequelize } from '../src/models/index.js'

beforeAll(async () => {
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  await sequelize.close()
})

// ─────────────────────────────────────────────────────────
// USUARIOS — CRUD
// ─────────────────────────────────────────────────────────
describe('Users - CRUD', () => {
  it('GET /users devuelve lista vacía al inicio', async () => {
    const res = await request(app).get('/users')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /users crea un usuario correctamente', async () => {
    const res = await request(app)
      .post('/users')
      .send({ nickName: 'juan_perez', email: 'juan@test.com', name: 'Juan Perez' })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ nickName: 'juan_perez', email: 'juan@test.com' })
    expect(res.body.id).toBeDefined()
  })

  it('GET /users/:id devuelve el usuario con posts, followers y following', async () => {
    const { body: user } = await request(app)
      .post('/users')
      .send({ nickName: 'maria_g', email: 'maria@test.com', name: 'Maria G' })

    const res = await request(app).get(`/users/${user.id}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('posts')
    expect(res.body).toHaveProperty('followers')
    expect(res.body).toHaveProperty('following')
  })

  it('PUT /users/:id actualiza el usuario', async () => {
    const { body: user } = await request(app)
      .post('/users')
      .send({ nickName: 'upd_user', email: 'upd@test.com', name: 'Original' })

    const res = await request(app)
      .put(`/users/${user.id}`)
      .send({ nickName: 'upd_user', email: 'upd@test.com', name: 'Actualizado' })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Actualizado')
  })

  it('DELETE /users/:id elimina el usuario y el GET devuelve 404', async () => {
    const { body: user } = await request(app)
      .post('/users')
      .send({ nickName: 'del_user', email: 'del@test.com', name: 'A Borrar' })

    expect((await request(app).delete(`/users/${user.id}`)).status).toBe(204)
    expect((await request(app).get(`/users/${user.id}`)).status).toBe(404)
  })

  it('GET /users/:id devuelve 404 si no existe', async () => {
    const res = await request(app).get('/users/99999')
    expect(res.status).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────
// USUARIOS — nickName único (requerimiento del TP)
// ─────────────────────────────────────────────────────────
describe('Users - nickName único', () => {
  it('rechaza crear dos usuarios con el mismo nickName → 409', async () => {
    await request(app)
      .post('/users')
      .send({ nickName: 'unique_nick', email: 'a@test.com', name: 'User A' })

    const res = await request(app)
      .post('/users')
      .send({ nickName: 'unique_nick', email: 'b@test.com', name: 'User B' })

    expect(res.status).toBe(409)
  })
})

// ─────────────────────────────────────────────────────────
// POSTS — CRUD
// ─────────────────────────────────────────────────────────
describe('Posts - CRUD', () => {
  let userId

  beforeAll(async () => {
    const { body } = await request(app)
      .post('/users')
      .send({ nickName: 'post_owner', email: 'powner@test.com', name: 'Post Owner' })
    userId = body.id
  })

  it('POST /posts crea un post con description obligatoria', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ description: 'Mi primera publicación', userId })
    expect(res.status).toBe(201)
    expect(res.body.description).toBe('Mi primera publicación')
    expect(res.body.userId).toBe(userId)
  })

  it('GET /posts devuelve lista de posts', async () => {
    const res = await request(app).get('/posts')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('GET /posts/:id incluye images, tags y comments', async () => {
    const { body: post } = await request(app)
      .post('/posts')
      .send({ description: 'Post con relaciones', userId })

    const res = await request(app).get(`/posts/${post.id}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('images')
    expect(res.body).toHaveProperty('tags')
    expect(res.body).toHaveProperty('comments')
    expect(Array.isArray(res.body.images)).toBe(true)
    expect(Array.isArray(res.body.tags)).toBe(true)
    expect(Array.isArray(res.body.comments)).toBe(true)
  })

  it('PUT /posts/:id actualiza la descripción', async () => {
    const { body: post } = await request(app)
      .post('/posts')
      .send({ description: 'Original', userId })

    const res = await request(app).put(`/posts/${post.id}`).send({ description: 'Actualizado' })

    expect(res.status).toBe(200)
    expect(res.body.description).toBe('Actualizado')
  })

  it('DELETE /posts/:id elimina el post', async () => {
    const { body: post } = await request(app)
      .post('/posts')
      .send({ description: 'A borrar', userId })

    expect((await request(app).delete(`/posts/${post.id}`)).status).toBe(204)
    expect((await request(app).get(`/posts/${post.id}`)).status).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────
// POSTS — Imágenes (requerimiento del TP)
// ─────────────────────────────────────────────────────────
describe('Posts - Imágenes', () => {
  let postId

  beforeAll(async () => {
    const { body: user } = await request(app)
      .post('/users')
      .send({ nickName: 'img_owner', email: 'img@test.com', name: 'Img Owner' })
    const { body: post } = await request(app)
      .post('/posts')
      .send({ description: 'Post con imágenes', userId: user.id })
    postId = post.id
  })

  it('POST /posts/:id/images agrega una imagen al post', async () => {
    const res = await request(app)
      .post(`/posts/${postId}/images`)
      .send({ url: 'https://example.com/foto.jpg' })

    expect(res.status).toBe(201)
    expect(res.body.url).toBe('https://example.com/foto.jpg')
    expect(Number(res.body.postId)).toBe(postId)
  })

  it('el GET /posts/:id muestra las imágenes asociadas', async () => {
    await request(app)
      .post(`/posts/${postId}/images`)
      .send({ url: 'https://example.com/foto2.jpg' })

    const res = await request(app).get(`/posts/${postId}`)
    expect(res.body.images.length).toBeGreaterThanOrEqual(1)
  })

  it('DELETE /posts/:id/images/:imageId elimina la imagen', async () => {
    const { body: img } = await request(app)
      .post(`/posts/${postId}/images`)
      .send({ url: 'https://example.com/todelete.jpg' })

    const del = await request(app).delete(`/posts/${postId}/images/${img.id}`)
    expect(del.status).toBe(204)
  })

  it('eliminar imagen inexistente devuelve 404', async () => {
    const res = await request(app).delete(`/posts/${postId}/images/99999`)
    expect(res.status).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────
// TAGS — CRUD y relación N:M con Posts (requerimiento del TP)
// ─────────────────────────────────────────────────────────
describe('Tags - CRUD y relación N:M con Posts', () => {
  let userId, postId1, postId2, tagId

  beforeAll(async () => {
    const { body: user } = await request(app)
      .post('/users')
      .send({ nickName: 'tag_owner', email: 'tag@test.com', name: 'Tag Owner' })
    userId = user.id

    const { body: p1 } = await request(app)
      .post('/posts')
      .send({ description: 'Post A con tags', userId })
    const { body: p2 } = await request(app)
      .post('/posts')
      .send({ description: 'Post B con tags', userId })
    postId1 = p1.id
    postId2 = p2.id

    const { body: tag } = await request(app).post('/tags').send({ name: 'tecnologia' })
    tagId = tag.id
  })

  it('POST /tags crea un tag', async () => {
    const res = await request(app).post('/tags').send({ name: 'educacion' })
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('educacion')
  })

  it('GET /tags devuelve lista de tags', async () => {
    const res = await request(app).get('/tags')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /posts/:id/tags/:tagId asocia un tag a un post', async () => {
    const res = await request(app).post(`/posts/${postId1}/tags/${tagId}`)
    expect(res.status).toBe(201)
  })

  it('el GET /posts/:id muestra los tags asociados', async () => {
    await request(app).post(`/posts/${postId1}/tags/${tagId}`)
    const res = await request(app).get(`/posts/${postId1}`)
    expect(res.body.tags.some((t) => t.id === tagId)).toBe(true)
  })

  it('un mismo tag puede estar en múltiples posts (N:M)', async () => {
    await request(app).post(`/posts/${postId1}/tags/${tagId}`)
    await request(app).post(`/posts/${postId2}/tags/${tagId}`)

    const res = await request(app).get(`/tags/${tagId}`)
    expect(res.status).toBe(200)
    expect(res.body.posts.length).toBeGreaterThanOrEqual(2)
  })

  it('DELETE /posts/:id/tags/:tagId desasocia el tag del post', async () => {
    await request(app).post(`/posts/${postId1}/tags/${tagId}`)
    const res = await request(app).delete(`/posts/${postId1}/tags/${tagId}`)
    expect(res.status).toBe(200)
  })

  it('PUT /tags/:id actualiza el nombre del tag', async () => {
    const res = await request(app).put(`/tags/${tagId}`).send({ name: 'tecnologia-actualizado' })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('tecnologia-actualizado')
  })

  it('DELETE /tags/:id elimina el tag', async () => {
    const { body: tempTag } = await request(app).post('/tags').send({ name: 'temporal' })
    expect((await request(app).delete(`/tags/${tempTag.id}`)).status).toBe(204)
  })
})

// ─────────────────────────────────────────────────────────
// COMMENTS — CRUD
// ─────────────────────────────────────────────────────────
describe('Comments - CRUD', () => {
  let userId, postId

  beforeAll(async () => {
    const { body: user } = await request(app)
      .post('/users')
      .send({ nickName: 'comment_owner', email: 'co@test.com', name: 'Comment Owner' })
    userId = user.id
    const { body: post } = await request(app)
      .post('/posts')
      .send({ description: 'Post para comentar', userId })
    postId = post.id
  })

  it('POST /comments crea un comentario en un post', async () => {
    const res = await request(app)
      .post('/comments')
      .send({ text: 'Gran publicación!', postId, userId })
    expect(res.status).toBe(201)
    expect(res.body.text).toBe('Gran publicación!')
    expect(res.body.postId).toBe(postId)
  })

  it('GET /comments/:id devuelve el comentario', async () => {
    const { body: c } = await request(app)
      .post('/comments')
      .send({ text: 'Comentario de prueba', postId, userId })

    const res = await request(app).get(`/comments/${c.id}`)
    expect(res.status).toBe(200)
    expect(res.body.text).toBe('Comentario de prueba')
  })

  it('PUT /comments/:id actualiza el texto', async () => {
    const { body: c } = await request(app)
      .post('/comments')
      .send({ text: 'Original', postId, userId })

    const res = await request(app).put(`/comments/${c.id}`).send({ text: 'Editado' })
    expect(res.status).toBe(200)
    expect(res.body.text).toBe('Editado')
  })

  it('DELETE /comments/:id elimina el comentario', async () => {
    const { body: c } = await request(app)
      .post('/comments')
      .send({ text: 'A borrar', postId, userId })

    expect((await request(app).delete(`/comments/${c.id}`)).status).toBe(204)
    expect((await request(app).get(`/comments/${c.id}`)).status).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────
// COMMENTS — Filtro por fecha COMMENT_MONTHS (requerimiento clave del TP)
// ─────────────────────────────────────────────────────────
describe('Comments - Filtro por COMMENT_MONTHS', () => {
  let userId, postId

  beforeAll(async () => {
    const { body: user } = await request(app)
      .post('/users')
      .send({ nickName: 'date_owner', email: 'date@test.com', name: 'Date Owner' })
    userId = user.id
    const { body: post } = await request(app)
      .post('/posts')
      .send({ description: 'Post para filtro de fechas', userId })
    postId = post.id
  })

  it('muestra comentarios recientes (menos de 6 meses)', async () => {
    await request(app).post('/comments').send({ text: 'Comentario reciente', postId, userId })

    const res = await request(app).get(`/posts/${postId}`)
    expect(res.body.comments.some((c) => c.text === 'Comentario reciente')).toBe(true)
  })

  it('NO muestra comentarios más antiguos que COMMENT_MONTHS meses', async () => {
    const { body: c } = await request(app)
      .post('/comments')
      .send({ text: 'Comentario viejo', postId, userId })

    const oldDate = new Date()
    oldDate.setMonth(oldDate.getMonth() - 8)
    await sequelize.query(
      `UPDATE Comments SET createdAt = '${oldDate.toISOString()}' WHERE id = ${c.id}`,
    )

    const res = await request(app).get(`/posts/${postId}`)
    expect(res.body.comments.some((c) => c.text === 'Comentario viejo')).toBe(false)
  })

  it('el valor de COMMENT_MONTHS es configurable via env', async () => {
    process.env.COMMENT_MONTHS = '1'

    const { body: c } = await request(app)
      .post('/comments')
      .send({ text: 'Comentario de 2 meses', postId, userId })

    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
    await sequelize.query(
      `UPDATE Comments SET createdAt = '${twoMonthsAgo.toISOString()}' WHERE id = ${c.id}`,
    )

    const res = await request(app).get(`/posts/${postId}`)
    expect(res.body.comments.some((c) => c.text === 'Comentario de 2 meses')).toBe(false)

    process.env.COMMENT_MONTHS = '6'
  })
})

// ─────────────────────────────────────────────────────────
// FOLLOWERS — N:M entre usuarios (bonus #2)
// ─────────────────────────────────────────────────────────
describe('Followers - N:M entre usuarios', () => {
  let user1Id, user2Id, user3Id

  beforeAll(async () => {
    const { body: u1 } = await request(app)
      .post('/users')
      .send({ nickName: 'follower1', email: 'f1@test.com', name: 'Follower 1' })
    const { body: u2 } = await request(app)
      .post('/users')
      .send({ nickName: 'follower2', email: 'f2@test.com', name: 'Follower 2' })
    const { body: u3 } = await request(app)
      .post('/users')
      .send({ nickName: 'follower3', email: 'f3@test.com', name: 'Follower 3' })
    user1Id = u1.id
    user2Id = u2.id
    user3Id = u3.id
  })

  it('POST /users/:id/follow/:followedId — un usuario puede seguir a otro', async () => {
    const res = await request(app).post(`/users/${user1Id}/follow/${user2Id}`)
    expect(res.status).toBe(201)
    expect(res.body.message).toContain('sigue a')
  })

  it('GET /users/:id/followers — aparece en los seguidores del seguido', async () => {
    await request(app).post(`/users/${user1Id}/follow/${user2Id}`)
    const res = await request(app).get(`/users/${user2Id}/followers`)
    expect(res.body.some((u) => u.id === user1Id)).toBe(true)
  })

  it('GET /users/:id/following — aparece en el following del seguidor', async () => {
    await request(app).post(`/users/${user1Id}/follow/${user2Id}`)
    const res = await request(app).get(`/users/${user1Id}/following`)
    expect(res.body.some((u) => u.id === user2Id)).toBe(true)
  })

  it('un usuario puede ser seguido por muchos (N:M)', async () => {
    await request(app).post(`/users/${user1Id}/follow/${user3Id}`)
    await request(app).post(`/users/${user2Id}/follow/${user3Id}`)

    const res = await request(app).get(`/users/${user3Id}/followers`)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })

  it('no permite que un usuario se siga a sí mismo → 400', async () => {
    const res = await request(app).post(`/users/${user1Id}/follow/${user1Id}`)
    expect(res.status).toBe(400)
  })

  it('DELETE /users/:id/unfollow/:followedId — puede dejar de seguir', async () => {
    await request(app).post(`/users/${user1Id}/follow/${user2Id}`)
    const res = await request(app).delete(`/users/${user1Id}/unfollow/${user2Id}`)
    expect(res.status).toBe(200)
  })

  it('seguir a un usuario inexistente devuelve 404', async () => {
    const res = await request(app).post(`/users/${user1Id}/follow/99999`)
    expect(res.status).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────
// VALIDACIONES JOI — schemas de entrada
// ─────────────────────────────────────────────────────────
describe('Validaciones Joi', () => {
  it('rechaza usuario sin nickName → 400 con detalle del campo', async () => {
    const res = await request(app).post('/users').send({ email: 'a@a.com', name: 'A' })
    expect(res.status).toBe(400)
    expect(res.body.errores.some((e) => e.atributo === 'nickName')).toBe(true)
  })

  it('rechaza usuario con email inválido', async () => {
    const res = await request(app)
      .post('/users')
      .send({ nickName: 'valid_nick', email: 'no-es-email', name: 'A' })
    expect(res.status).toBe(400)
  })

  it('rechaza nickName menor a 3 caracteres', async () => {
    const res = await request(app)
      .post('/users')
      .send({ nickName: 'ab', email: 'a@a.com', name: 'A' })
    expect(res.status).toBe(400)
  })

  it('rechaza post sin description', async () => {
    const res = await request(app).post('/posts').send({ userId: 1 })
    expect(res.status).toBe(400)
    expect(res.body.errores.some((e) => e.atributo === 'description')).toBe(true)
  })

  it('rechaza comentario sin text', async () => {
    const res = await request(app).post('/comments').send({ postId: 1, userId: 1 })
    expect(res.status).toBe(400)
    expect(res.body.errores.some((e) => e.atributo === 'text')).toBe(true)
  })

  it('rechaza imagen con URL inválida', async () => {
    const { body: user } = await request(app)
      .post('/users')
      .send({ nickName: 'val_img_user', email: 'vi@test.com', name: 'Val Img' })
    const { body: post } = await request(app)
      .post('/posts')
      .send({ description: 'Post para validar imagen', userId: user.id })

    const res = await request(app)
      .post(`/posts/${post.id}/images`)
      .send({ url: 'esto-no-es-una-url' })
    expect(res.status).toBe(400)
  })

  it('rechaza atributos desconocidos (unknown fields)', async () => {
    const res = await request(app)
      .post('/tags')
      .send({ name: 'valido', campoExtraNoPermitido: true })
    expect(res.status).toBe(400)
  })
})
