# 🚀 **TIENDA FRONTEND**

Este proyecto es un frontend desarrollado en **Angular 17** con **TailwindCSS** y **Angular Material**. Implementa un sistema de gestión con tablas para usuarios, productos y categorías, interactuando con un backend en **Spring Boot**.

---

## 🎯 **Objetivos Principales**

- Implementar CRUD completo para **productos, categorías y usuarios**.
- Integrar autenticación mediante **JWT**.
- Utilizar **RxJS** para la gestión de estados y peticiones HTTP.
- Aplicar **standalone components** para una arquitectura modular.
- Manejo de rutas protegidas con **guards e interceptores**.

---

## 🛠 **Tecnologías Utilizadas**

- ⚡ **Angular 17** (Framework frontend)
- 🎨 **Tailwind CSS** (Estilización)
- 🖥 **Angular Material** (Componentes UI)
- 🔄 **RxJS** (Gestión de datos reactivos)
- 🌍 **Angular Router** (Navegación y protección de rutas)
- 🔐 **JWT** (Autenticación y autorización)
- 📡 **HTTP Interceptors** (Manejo de peticiones y respuestas)
- 🎯 **Standalone Components** (Arquitectura moderna de Angular)
- 🏗 **Vite** (Servidor de desarrollo rápido)

---

## 📂 **Estructura del Proyecto**

```bash
src/
├── app/
│   ├── business/
│   │   ├── authentication/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   ├── dashboard/
│   │   ├── tables/
│   │   │   ├── categorias/
│   │   │   │   ├── registrar-modificar/
│   │   │   ├── productos/
│   │   │   │   ├── registrar-modificar/
│   │   │   ├── usuarios/
│   │   │   │   ├── registrar-modificar/
│   ├── core/
│   │   ├── interceptors/
│   │   ├── services/
│   │   │   ├── guards/
│   │   │   ├── tablesServices/
│   ├── shared/
│   │   ├── componentes/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── layout/
│   │   │   ├── sidebar/
│   │   ├── models/
│   │   ├── utils/
│   └── app.component.ts
├── assets/
│   ├── images/
├── environments/
└── styles/
```

---

## 🚀 **Instalación y Configuración**

### 📌 **Prerrequisitos**

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- 🟢 **Node.js** (versión 16+ recomendada)
- 📦 **Angular CLI**

### 📂 **Clonar el Repositorio**

```bash
git clone https://github.com/Fabrix2629/tienda-frontend-principal.git
cd tienda-frontend-principal
```

### 📦 **Instalar Dependencias**

```bash
npm install
```

### 🏃 **Ejecutar el Proyecto**

```bash
ng serve
```

Abre el navegador en `http://localhost:4200/`

---

## 🔄 **Interceptors y Guards**

### 📌 **Interceptores**

El proyecto utiliza un **interceptor** para gestionar la autenticación con **JWT**. Este añade el token a cada petición HTTP si el usuario está autenticado.

📍 **Ubicación:** `src/app/core/interceptors/auth.interceptor.ts`

```ts
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${authToken}` },
    });
    return next.handle(authReq);
  }
}
```

📌 **Configuración en el módulo:**

```ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';
@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
```

---

### 🔐 **Guards**

Los **guards** protegen las rutas restringidas solo a usuarios autenticados.

📍 **Ubicación:** `src/app/core/services/guards/auth.guard.ts`

```ts
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(["/login"]);
    return false;
  }
}
```

📌 **Uso en rutas:**

```ts
import { AuthGuard } from "./core/services/guards/auth.guard";
const routes: Routes = [{ path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] }];
```

---

## 📌 **Rutas con Standalone Components**

Angular 17 permite el uso de **standalone components** para una arquitectura más modular.

📍 **Ejemplo de una ruta con standalone component:**

```ts
const routes: Routes = [{ path: "login", loadComponent: () => import("./business/authentication/login/login.component").then((m) => m.LoginComponent) }];
```

---

## 🔌 **Backend Asociado**

Este proyecto está diseñado para trabajar con el backend desarrollado en **Spring Boot**. Puedes encontrarlo en:
👉 [Repositorio Backend](https://github.com/Fabrix2629/tienda-backend-principal)

---

## 🤝 **Contribuciones**

Si deseas contribuir a este proyecto:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Sube tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

## 📜 **Licencia**

Este proyecto está bajo la licencia **MIT**.
