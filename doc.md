# Documentación de la API - UnaHur Anti-Social Net

Base path: `/api`

Endpoints principales

- **Users**
  - `GET /api/users` : Listar usuarios
  - `GET /api/users/:id` : Obtener usuario con relaciones (posts, followers, following)
  - `POST /api/users` : Crear usuario
    - body: `{ "nickName": "unique", "email": "a@b.com", "name": "Nombre" }`
  - `PUT /api/users/:id` : Actualizar usuario
    - body: `{ "nickName": "nuevoNick", "email": "nuevo@mail.com", "name": "Nuevo Nombre" }`
  - `DELETE /api/users/:id` : Eliminar usuario y devolver el usuario borrado
  - `POST /api/users/:followerId/follow/:followedId` : El usuario `followerId` sigue a `followedId` (sin body)
  - `DELETE /api/users/:followerId/unfollow/:followedId` : El usuario `followerId` deja de seguir a `followedId` (sin body)

- **Posts**
  - `GET /api/posts` : Listar posts (incluye autor y tags)
  - `GET /api/posts/:id` : Obtener post con relaciones (user, images, tags, comments filtrados)
  - `POST /api/posts` : Crear post
    - body: `{ "description": "texto", "userId": 1 }`
  - `PUT /api/posts/:id` : Actualizar post
  - `DELETE /api/posts/:id` : Eliminar post y devolver el post borrado
  - `POST /api/posts/:id/images` : Agregar imagen al post
    - body: `{ "url": "https://..." }`
  - `DELETE /api/posts/:id/images/:imageId` : Eliminar imagen del post y devolver la imagen borrada
  - `POST /api/posts/:id/tags` : Asociar tag a post
    - body: `{ "tagId": 2 }`
  - `DELETE /api/posts/:id/tags/:tagId` : Quitar tag de post y devolver el tag removido

- **Comments**
  - `GET /api/comments` : Listar comentarios visibles
  - `GET /api/comments/:id` : Obtener comentario
  - `POST /api/comments` : Crear comentario
    - body: `{ "text": "hola", "userId": 1, "postId": 2 }`
  - `PUT /api/comments/:id` : Actualizar comentario
  - `DELETE /api/comments/:id` : Eliminar comentario y devolver el comentario borrado

- **Tags**
  - `GET /api/tags` : Listar tags
  - `GET /api/tags/:id` : Obtener tag con posts asociados
  - `POST /api/tags` : Crear tag
    - body: `{ "name": "tag-name" }`
  - `PUT /api/tags/:id` : Actualizar tag
  - `DELETE /api/tags/:id` : Eliminar tag y devolver el tag borrado

Comportamiento relevante

- Los comentarios se filtran por antigüedad usando la variable de entorno `COMMENT_MONTHS` (por defecto 6). Los comentarios anteriores a esa fecha no se muestran en los endpoints de posts.
- `nickName` y `email` en `User` son únicos; violaciones lanzan un error 409.
- Las relaciones entre entidades están expuestas mediante endpoints para agregar/quitar imágenes y tags, y para seguir o dejar de seguir a otros usuarios.
- Los deletes ahora responden con `200` y el objeto eliminado en el cuerpo.

Notas para pruebas

- Iniciar la app: `node src/index.js` (asegurar variables de entorno y DB configuradas en `src/config/config.json`).
- Para asociar una imagen a un post, usar `POST /api/posts/:id/images` con `{ "url": "https://..." }`.
- Para seguir a un usuario: `POST /api/users/4/follow/3`.
- Para dejar de seguir a un usuario: `DELETE /api/users/4/unfollow/3`.
