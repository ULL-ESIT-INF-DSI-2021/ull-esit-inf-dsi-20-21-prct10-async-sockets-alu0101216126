**Autor: Daniel Álvarez Medina (alu0101216126@ull.edu.es)**

# Informe práctica 10
## Cliente y servidor para una aplicación de procesamiento de notas de texto

### 1. Introducción

En esta práctica tendremos que partir de la implementación de la aplicación de procesamiento de notas de texto que llevamos a cabo en la [Práctica 8](https://ull-esit-inf-dsi-2021.github.io/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216126/) para escribir un servidor y un cliente haciendo uso de los sockets proporcionados por el módulo `net` de Node.js.

Las operaciones que podrá solicitar el cliente al servidor deberán ser las mismas que ya implementamos durante la Práctica 8, esto es, añadir, modificar, eliminar, listar y leer notas de un usuario concreto. Un usuario interactuará con el cliente de la aplicación, exclusivamente, a través de la línea de comandos. Al mismo tiempo, en el servidor, las notas se almacenarán como ficheros JSON en el sistema de ficheros y siguiendo la misma estructura de directorios utilizada durante la Práctica 8.

Debemos realizar a su vez el análisis de SonarCloud, así como el funcionamiento correcto de las GitHub Actions de tests, Coveralls y SonarCloud.

### 2. Objetivos

La realización de esta práctica tiene como objetivo aprender:

- El uso del [módulo net de Node.js](https://nodejs.org/dist/latest-v16.x/docs/api/net.html).
- El uso de la clase [EventEmitter del módulo Events de Node.js](https://nodejs.org/dist/latest-v16.x/docs/api/events.html#events_class_eventemitter).