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
### 4. Limpieza de imagenes, configmaps, etc...
### Borrar todos los deployments, servicios y pods definidos en los archivos YAML
```
kubectl delete -f ./k8s/
```
### Borrar específicamente los ConfigMaps (para asegurar que carguen los .env nuevos)
```
kubectl delete configmap auth-config users-config skills-config orders-config
```

### Por si acaso quedaron recursos huérfanos
```
kubectl delete pods --all
```

# Asegurarse de estar apuntando al docker de minikube
```
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

# Borrar imágenes anteriores para forzar una construcción limpia
```
docker rmi auth-service:latest users-service:latest skills-service:latest orders-service:latest api-gateway:latest
```

### 5. Construir las Imágenes de los Microservicios
Desde la raíz del proyecto (`social-skills-system`), construir cada imagen:
```powershell
docker build -t auth-service:latest ./auth-service
docker build -t users-service:latest ./users-service
docker build -t skills-service:latest ./skills-service
docker build -t orders-service:latest ./orders-service
docker build -t api-gateway:latest ./api-gateway
```
### 6. Pasar la base de datos a kubernetes 
Con el .env ubicado en el servicio:
```powershell
kubectl create configmap auth-config --from-env-file=./auth-service/.env
kubectl create configmap users-config --from-env-file=./users-service/.env
kubectl create configmap skills-config --from-env-file=./skills-service/.env
kubectl create configmap orders-config --from-env-file=./orders-service/.env
```
### 7. Desplegar la Infraestructura (Kubernetes)
Aplicar los manifiestos YAML para crear los Pods y Servicios:
```powershell
kubectl apply -f ./k8s/
```
### 8. Verificar que los servicios corran
```powershell
kubectl get pods
kubectl get svc
kubectl get services
```

### 9. Exponer API Gateway (IMPORTANTE - NUEVA TERMINAL)**
```powershell
# ABRIR UNA NUEVA TERMINAL DE POWERSHELL

# Primero, apuntar al Docker de Minikube en la nueva terminal también
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Luego, exponer el servicio (esto crea un túnel local)
minikube service api-gateway
```
La pagina web se abre sola en el navegador.
```
# La salida será algo como:
# |-----------|-------------|-------------|------|
# | NAMESPACE |    NAME     | TARGET PORT | URL  |
# |-----------|-------------|-------------|------|
# | default   | api-gateway |    3000     | http://127.0.0.1:XXXXX |
# |-----------|-------------|-------------|------|

# DEJAR ESTA TERMINAL ABIERTA (es necesaria para mantener el túnel)
```
