# Social Skills System (NovaLink)

Guía rápida para levantar la arquitectura de microservicios localmente usando Docker y Kubernetes (Minikube).

## Requisitos Previos
- **Docker Desktop** instalado y ejecutándose de fondo.

---

## Pasos de Ejecución (PowerShell)

### 1. Instalar Minikube y Kubectl
```powershell
winget install Kubernetes.minikube
winget install Kubernetes.kubectl
```
*(Importante: Cerrar y abrir una terminal nueva o volver a abrir VS Code después de instalar).*

### 2. Iniciar el Clúster Local
```powershell
minikube start --driver=docker
```

### 3. Apuntar al Docker de Minikube
Este comando conecta la terminal con el Docker interno de Minikube para no tener que subir las imágenes a internet:
```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

### 4. Construir las Imágenes de los Microservicios
Desde la raíz del proyecto (`social-skills-system`), construir cada imagen:
```powershell
docker build -t users-service:latest ./users-service
docker build -t skills-service:latest ./skills-service
docker build -t orders-service:latest ./orders-service
docker build -t api-gateway:latest ./api-gateway
```

### 5. Desplegar la Infraestructura (Kubernetes)
Aplicar los manifiestos YAML para crear los Pods y Servicios:
```powershell
kubectl apply -f ./k8s/
```

### 6. Exponer la API (API-Gateway)
Abra una **NUEVA terminal** y ejecute este comando para crear un puente hacia su computadora (hay que dejar la terminal abierta):
```powershell
minikube service api-gateway
```

### 7. Verificar que los ervicios corran
```powershell
kubectl get pods
kubectl get svc
kubectl get services
```

### 8. Pasar la base de datos a kubernetes 
Con el .env ubicado en el servicio:
```powershell
kubectl create configmap users-config --from-env-file=./users-service/.env
kubectl create configmap skills-config --from-env-file=./skills-service/.env
kubectl create configmap orders-config --from-env-file=./orders-service/.env
```

### 9. Probar el Sistema (Usar Postman Agent porque es local la dirección IP)
Descargar el Postman Agent desde: `https://www.postman.com/downloads/postman-agent/`  
Para hacer peticiones desde Postman seguir el `Manual_API_restful` en la carpeta de Documentacion.