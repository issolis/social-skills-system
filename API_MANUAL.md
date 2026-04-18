# NovaLink - Manual de API RESTful

Este documento describe los endpoints disponibles en el Ecosistema de Servicios RESTful para la Gestión de Habilidades Sociales (NovaLink), los esquemas de datos esperados (JSON) y las respuestas HTTP estándar.

---

## 1. Servicio de Usuarios (Users Service)
**URL Base (Local):** `http://localhost:3001` o `http://127.0.0.1:3001`

### 1.1 Crear un Usuario
* **Método:** `POST`
* **Ruta:** `/users`
* **Descripción:** Registra un nuevo usuario en el sistema.
* **Body (JSON):**
  ```json
  {
      "username": "juan123",
      "fname": "Juan",
      "lname": "Pérez"
  }
  ```
* **Respuesta Exitosa (201 Created):**
  ```json
  {
      "status": "success",
      "message": "User created successfully",
      "data": { "id": 1, "username": "juan123", "fname": "Juan", "lname": "Pérez" }
  }
  ```
* **Respuesta de Error (400 Bad Request):** Faltan campos obligatorios.

### 1.2 Obtener un Usuario por ID
* **Método:** `GET`
* **Ruta:** `/users/:id`
* **Parámetros:** `id` (numérico) en la URL.
* **Respuesta Exitosa (200 OK):** Retorna el objeto del usuario.
* **Respuesta de Error (404 Not Found):** Usuario no existe.

### 1.3 Listar Habilidades Adquiridas por Usuario
* **Método:** `GET`
* **Ruta:** `/users/:id/skills`
* **Descripción:** Devuelve el inventario de habilidades sociales que el usuario ha acumulado a través de sus pedidos.
* **Respuesta Exitosa (200 OK):**
  ```json
  {
      "status": "success",
      "data": [
          { "skill_id": 1, "name": "Escucha Activa", "pts_acquired": 5 }
      ]
  }
  ```

*(Otros endpoints disponibles: `GET /users`, `PUT /users/:id`, `DELETE /users/:id`)*

---

## 2. Servicio de Habilidades / Productos (Skills Service)
**URL Base (Local):** `http://localhost:3002` o `http://127.0.0.1:3002`

### 2.1 Crear una Habilidad (Catálogo)
* **Método:** `POST`
* **Ruta:** `/skills`
* **Descripción:** Agrega una nueva habilidad social al catálogo maestro.
* **Body (JSON):**
  ```json
  {
      "name": "Liderazgo",
      "available_pts": 100
  }
  ```
* **Respuesta Exitosa (201 Created):** Retorna la habilidad recién creada con su ID.

### 2.2 Consultar Habilidades (Stock)
* **Método:** `GET`
* **Ruta:** `/skills`
* **Descripción:** Lista todas las habilidades y su stock de puntos disponibles.

### 2.3 Descontar Puntos de una Habilidad (Consumo Interno)
* **Método:** `PATCH`
* **Ruta:** `/skills/:id/decrease`
* **Body (JSON):**
  ```json
  {
      "points": 5
  }
  ```
* **Descripción:** Usado internamente por Orders para restar stock cuando se aprueba un pedido.
* **Respuesta de Error (400 Bad Request):** "Not enough available points" si el stock es menor a los puntos solicitados.

*(Otros endpoints disponibles: `GET /skills/:id`, `PUT /skills/:id`, `DELETE /skills/:id`, `PATCH /skills/:id/increase`)*

---

## 3. Servicio de Pedidos (Orders Service)
**URL Base (Local):** `http://localhost:3003` o `http://127.0.0.1:3003`

### 3.1 Crear un Pedido (Asignar Habilidad)
* **Método:** `POST`
* **Ruta:** `/orders`
* **Descripción:** Crea un pedido para asignar puntos de una habilidad a un usuario. Valida automáticamente la existencia del usuario y el stock de la habilidad.
* **Body (JSON):**
  ```json
  {
      "user_id": 1,
      "skill_id": 1,
      "pts_assigned": 5
  }
  ```
* **Respuesta Exitosa (201 Created):**
  ```json
  {
      "status": "success",
      "message": "Order created successfully",
      "data": {
          "id": 10,
          "user_id": 1,
          "skill_id": 1,
          "pts_assigned": 5,
          "status": "completed",
          "created_at": "2026-04-18T10:00:00.000Z"
      }
  }
  ```
* **Posibles Respuestas de Error:**
  * **503 Service Unavailable:** `Users service is not available` / `Skills service is not available` (Si un microservicio vecino está caído).
  * **404 Not Found:** `User not found` / `Skill not found` (Entidad inexistentente).
  * **400 Bad Request:** `Not enough available points` (Sin stock en la habilidad consultada).

### 3.2 Historial de Pedidos
* **Método:** `GET`
* **Ruta:** `/orders`
* **Descripción:** Retorna el registro de todos los pedidos procesados en el ecosistema.
* **Respuesta Exitosa (200 OK):** Arreglo JSON con todas las órdenes (ID, usuario, habilidad, puntos y fecha).

*(Otros endpoints disponibles: `GET /orders/:id`, `DELETE /orders/:id`)*

---

## 4. Códigos de Estado Comunes (HTTP Status Codes)
* **200 OK:** La solicitud se procesó correctamente (ej. lectura de datos).
* **201 Created:** El recurso se creó satisfactoriamente (POST).
* **400 Bad Request:** El cliente envió datos inválidos, faltantes, o sin lógica de negocio (ej. falta de stock o ID negativo).
* **404 Not Found:** El recurso solicitado (usuario, habilidad, orden) no existe en la base de datos.
* **503 Service Unavailable:** Falla de comunicación entre microservicios dentro de la red del clúster de Kubernetes.
