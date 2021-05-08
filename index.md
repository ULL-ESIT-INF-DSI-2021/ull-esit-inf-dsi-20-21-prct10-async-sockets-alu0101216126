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

### 3. Tareas previas

Antes de comenzar a realizar los ejercicios, deberíamos realizar las siguientes tareas:

- Aceptar la [asignación de GitHub Classroom](https://classroom.github.com/assignment-invitations/2040e575f8d4b7d81e9336c0d617baf0/status) asociada a esta práctica.
- Leer la documentación de [yargs](https://www.npmjs.com/package/yargs), una herramienta que permite crear una línea de comandos interactivas, analizando argumentos y generando una elegante interfaz de usuario.
- Leer la documentación sobre [chalk](https://www.npmjs.com/package/chalk), una herramienta que permite el uso de colores en los console.log().

### 4. Ejercicio - Cliente y servidor para una aplicación de procesamiento de notas de texto

Todos el código fuente del ejercicio realizado a continuación, debe estar alojados en ficheros independientes, a su vez, debemos hacer un fichero por clase, dicho fichero tendrá como nombre el mismo que el de la clase. Utilizaremos la [estructura básica del proyecto vista en clase](https://ull-esit-inf-dsi-2021.github.io/typescript-theory/typescript-project-setup.html), por lo que incluiremos todos los ejercicios en el directorio `./src` de dicho proyecto.

Para la documentación usaremos **TypeDoc** ([Instrucciones](https://drive.google.com/file/d/19LLLCuWg7u0TjjKz9q8ZhOXgbrKtPUme/view)) y para el desarrollo dirigido por pruebas emplearemos **Mocha** y **Chai** ([Instrucciones](https://drive.google.com/file/d/1-z1oNOZP70WBDyhaaUijjHvFtqd6eAmJ/view)).

Finalmente comprobaremos el cubrimiento de las pruebas mediante Coveralls, SonarCloud y las correspondientes GitHub Actions. Para las correspondientes GitHub Actions, debemos incluir los siguientes ficheros: [GitHub Action, ficheros de configuración](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216126/tree/main/.github/workflows).

### 4.1 Enunciado

Los requisitos que debe cumplir la aplicación de procesamiento de notas de texto son los enumerados a continuación:

1. La aplicación de notas deberá permitir que múltiples usuarios interactúen con ella.

2. Una nota estará formada, como mínimo, por un título, un cuerpo y un color (rojo, verde, azul o amarillo).

3. Cada usuario tendrá su propia lista de notas, con la que podrá llevar a cabo las siguientes operaciones:

- Añadir una nota a la lista. Antes de añadir una nota a la lista se debe comprobar si ya existe una nota con el mismo título. En caso de que así fuera, deberá mostrarse un mensaje de error por la consola del cliente. En caso contrario, se añadirá la nueva nota a la lista y se mostrará un mensaje informativo por la consola del cliente.

- Modificar una nota de la lista. Antes de modificar una nota, previamente se debe comprobar que exista una nota con el título de la nota a modificar en la lista. Si existe, se procede a su modificación y se emite un mensaje informativo por la consola del cliente. En caso contrario, debe mostrarse un mensaje de error por la consola del cliente.

- Eliminar una nota de la lista. Antes de eliminar una nota, previamente se debe comprobar que exista una nota con el título de la nota a eliminar en la lista. Si existe, se procede a su eliminación y se emite un mensaje informativo por la consola del cliente. En caso contrario, debe mostrarse un mensaje de error por la consola del cliente.

- Listar los títulos de las notas de la lista. Los títulos de las notas deben mostrarse por la consola del cliente con el color correspondiente de cada una de ellas. Use el paquete chalk para ello.

- Leer una nota concreta de la lista. Antes de mostrar el título y el cuerpo de la nota que se quiere leer, se debe comprobar que en la lista existe una nota cuyo título sea el de la nota a leer. Si existe, se mostrará el título y cuerpo de la nota por la consola del cliente con el color correspondiente de la nota. Para ello, use el paquete chalk. En caso contrario, se mostrará un mensaje de error por la consola del cliente.

- Todos los mensajes informativos se mostrarán con color verde, mientras que los mensajes de error se mostrarán con color rojo. Use el paquete chalk para ello.

- El servidor es responsable de hacer persistente la lista de notas de cada usuario.

  - Guardar cada nota de la lista en un fichero con formato JSON. Los ficheros JSON correspondientes a las notas de un usuario concreto deberán almacenarse en un directorio con el nombre de dicho usuario.

  - Cargar una nota desde los diferentes ficheros con formato JSON almacenados en el directorio del usuario correspondiente.

1. Un usuario solo puede interactuar con la aplicación de procesamiento de notas de texto a través de la línea de comandos del cliente. Los diferentes comandos, opciones de los mismos, así como manejadores asociados a cada uno de ellos deben gestionarse mediante el uso del paquete yargs.
