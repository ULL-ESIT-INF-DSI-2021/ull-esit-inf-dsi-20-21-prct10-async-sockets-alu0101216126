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

### 4.2 Implementación

- **Código notes.ts:**

```ts
/**
 * @enum colors Possible colors
 */
export enum colors {Red = "red", Green = "green", Blue = "blue", Yellow = "yellow"};

/**
 * Notes class which stores the data of a note
 */
export class Notes {
  /**
   * Initialize attributes
   * @param name Note's name
   * @param title Note's title
   * @param body Note's body
   * @param color Note's color
   */
  constructor(private name:string, private title: string, private body: string, private color: colors) {}

  /**
   * Returns Note's name
   * @returns Note's name
   */
  getName(): string {
    return this.name;
  }
  /**
   * Returns Note's title
   * @returns Note's title
   */
  getTitle(): string {
    return this.title;
  }
  /**
   * Returns Note's body
   * @returns Note's body
   */
  getBody(): string {
    return this.body;
  }
  /**
   * Returns Note's color
   * @returns Note's color
   */
  getColor(): colors {
    return this.color;
  }
}
```

En este fichero implementamos la clase Notes, esta almacena los diferentes datos de una nota, estos atributos son: 
- Autor 
- Título
- Contenido 
- Color

A su vez como métodos se implementaron una serie de getters para cada uno de los atributos.

- **Test notes.spec.ts:**

```ts
import 'mocha';
import {expect} from 'chai';
import {Notes, colors} from '../src/notes';

const notes = new Notes('Daniel', 'Test', 'This is a test', colors.Green);

describe('Notes function test', () => {
  it('Exist an Notes object', () => {
    expect(notes).not.to.be.equal(null);
  });

  it('notes.getName() returns the note\'s name', () => {
    expect(notes.getName()).to.be.equal('Daniel');
  });

  it('notes.getTitle() returns the note\'s title', () => {
    expect(notes.getTitle()).to.be.equal('Test');
  });

  it('notes.getBody() returns the note\'s body', () => {
    expect(notes.getBody()).to.be.equal('This is a test');
  });

  it('notes.getColor() returns the note\'s color', () => {
    expect(notes.getColor()).to.be.equal(colors.Green);
  });
});
```

Como se puede observar, realizamos pruebas para las siguientes situaciones:

* Creación de objeto de la clase Notes.
* Verificar funcionamiento de los métodos getters de la clase.

- **Código database.ts:**

```ts
import * as fs from 'fs';
import {Notes} from './notes';

/**
 * @class Database to be able to work with the notes and the fs module (directories and files)
 */
export class Database {
  /**
   * Default constructor
   */
  constructor() {}

  /**
  * Add a user note in .json format, to our database
  * @returns Whether we could add the note or not
   */
  addNote(note: Notes): boolean {
    const noteStructure = `{ "title": "${note.getTitle()}", "body": "${note.getBody()}" , "color": "${note.getColor()}" }`;

    const titleJson = note.getTitle().split(' ').join('');
    // If the path user exist
    if (fs.existsSync(`./database/${note.getName()}`)) {
      // If don't exist a title path yet
      if (!fs.existsSync(`./database/${note.getName()}/${titleJson}.json`)) {
        fs.writeFileSync(`./database/${note.getName()}/${titleJson}.json`, noteStructure);
        return true;
      }

      // If already exist this title path
      return false;
    }

    // If the path user doesn't exist
    fs.mkdirSync(`./database/${note.getName()}`, {recursive: true});
    fs.writeFileSync(`./database/${note.getName()}/${titleJson}.json`, noteStructure);
    return true;
  }

  /**
   * Modify a user note in .json format, in our database
   * @returns Whether we could modify the note or not
   */
  modifyNote(note: Notes): boolean {
    const noteStructure = `{ "title": "${note.getTitle()}", "body": "${note.getBody()}" , "color": "${note.getColor()}" }`;
    const titleJson = note.getTitle().split(' ').join('');

    // If the path user exist
    if (fs.existsSync(`./database/${note.getName()}`)) {
      // If exist this title path
      if (fs.existsSync(`./database/${note.getName()}/${titleJson}.json`)) {
        fs.writeFileSync(`./database/${note.getName()}/${titleJson}.json`, noteStructure);
        return true;
      }

      // If doesn't exist this title path
      return false;
    }

    // If the user doesn't exist
    return false;
  };

  /**
   * Remove a user note in .json format, in our database
   * @returns Informational message
   */
  removeNote(name: string, title: string): boolean {
    const titleName = title.split(' ').join('');

    // If the path exist
    if (fs.existsSync(`./database/${name}/${titleName}.json`)) {
      fs.rmSync(`./database/${name}/${titleName}.json`);
      return true;
    }

    // If the path doesn't exist
    return false;
  }

  /**
   * List all notes from a user
   * @returns Notes's array
   */
  listNotes(name: string): Notes[] {
    const array: Notes[] = [];

    // If the path user exist
    if (fs.existsSync(`./database/${name}`)) {
      fs.readdirSync(`./database/${name}/`).forEach((note) => {
        const data = fs.readFileSync(`./database/${name}/${note}`);
        const JsonNote = JSON.parse(data.toString());
        array.push(new Notes(name, JsonNote.title, JsonNote.body, JsonNote.color));
      });
      return array;
    }

    // If the path user doesn't exist
    return [];
  }

  /**
   * Read a note from a specific path
   * @returns A Note. In case of error we return null
   */
  readNote(name: string, title: string): Notes | null {
    const titleJson = title.split(' ').join('');

    // If the path exist
    if (fs.existsSync(`./database/${name}/${titleJson}.json`)) {
      const data = fs.readFileSync(`./database/${name}/${titleJson}.json`);
      const JsonNote = JSON.parse(data.toString());
      return new Notes(name, JsonNote.title, JsonNote.body, JsonNote.color);
    }

    // If the path doesn't exist
    return null;
  }
}
```

Este fichero es prácticamente idéntico al explicado en la [práctica 8](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101216126/blob/main/src/notes/notes.ts), la única diferencia es que quitamos los `console.log` y adaptamos algunos returns, pero el funcionamiento es el mismo.

- **Test database.spec.ts:**

```ts
import * as fs from 'fs';
import 'mocha';
import {expect} from 'chai';
import {Database} from '../src/database';
import {Notes, colors} from '../src/notes';

const database = new Database();

describe('Database function test', () => {
  it('Exist an Database object', () => {
    expect(database).not.to.be.equal(null);
  });

  it('database.addNote() on three cases: user exist, user doesn\'t exist, note title taken', () => {
    expect(database.addNote(new Notes('test', 'My test', 'This is a green test', colors.Green))).to.be.equal(true);
    expect(database.addNote(new Notes('test', 'My test 2', 'This is a red test', colors.Red))).to.be.equal(true);
    expect(database.addNote(new Notes('daniel', 'My test', 'This is a yellow test', colors.Yellow))).to.be.equal(true);
    expect(database.addNote(new Notes('test', 'My test', 'This is a blue test', colors.Blue))).to.be.equal(false);
  });

  it('database.modifyNote() on three cases: user exist, user doesn\'t exist, note doesn\'t exist', () => {
    expect(database.modifyNote(new Notes('test', 'My test', 'This is a red test overwrited', colors.Red))).to.be.equal(true);
    expect(database.modifyNote(new Notes('test', 'Fail', 'This is a green test', colors.Green))).to.be.equal(false);
    expect(database.modifyNote(new Notes('Fail', 'My test', 'This is a green test', colors.Green))).to.be.equal(false);
  });

  it('database.removeNote() on two cases: user exist, user doesn\'t exist, note doesn\'t exist', () => {
    expect(database.removeNote('daniel', 'My test')).to.be.equal(true);
    expect(database.removeNote('Fail', 'Fail test')).to.be.equal(false);
  });

  it('database.listNotes() returns: test\nMy test\ntest\nMy test 2\n', () => {
    const note1 = new Notes('test', 'My test', 'This is a red test overwrited', colors.Red);
    const note2 = new Notes('test', 'My test 2', 'This is a red test', colors.Red);
    expect(database.listNotes('test')).to.be.eql([note1, note2]);
    expect(database.listNotes('Fail')).to.be.eql([]);
  });

  it('database.readNotes() on two cases: note found, note not found ', () => {
    const note1 = new Notes('test', 'My test', 'This is a red test overwrited', colors.Red);
    expect(database.readNote('test', 'My test')).to.be.eql(note1);
    expect(database.readNote('Fail', 'Fail test')).to.be.equal(null);
  });
});

fs.rmSync('./database', {recursive: true});
```

Como se puede observar, realizamos pruebas para las siguientes situaciones:

* Creación de objeto de la clase Database.
* Métodos de la clase Database, verificando que se manejan los errores correctamente.

- **Código eventEmitterClient.ts:**

```ts
import {EventEmitter} from 'events';

/**
 * @class Class to complement the functionality of the client socket, this class inherits from the EventEmitter class of the events module
 */
export class MessageEventEmitterClient extends EventEmitter {
  /**
   * We initialize attributes. After that we process the 'data' and 'end' events,
   * in turn, in the 'end' event, we emit a 'message' event
   * @param connection EventEmitter type parameter, we will use this attribute to process and emit events
   */
  constructor(connection: EventEmitter) {
    super();
    let wholeData = '';

    // We get the message through the data event
    connection.on('data', (chunks) => {
      wholeData += chunks;
    }),

    // With the end event, it means that the server has already sent the message, so we can now use what is received in data
    connection.on('end', () => {
      const request = JSON.parse(wholeData);
      this.emit('message', request);
    });
  }
}
```

Se ha realizado la clase `MessageEventEmitterClient`, para complementar la funcionalidad del socket del fichero `client.ts` que se explicará posteriormente, esta clase hereda de la clase `EventEmitter` del módulo `events`.

Con esta clase podremos recibir y enviar eventos, en concreto resolveremos el problema de la recepción de mensajes a trozos mediante el evento recibido `data`. La idea es que esta clase sea capaz de emitir un evento de tipo `message` con cada recepción de un mensaje completo enviado por el servidor a través del socket correspondiente. Dicha recepción se obtendrá mediante el evento `end`.

- **Código client.ts:**

```ts
import {colors} from './notes';
import * as yargs from 'yargs';
import * as net from 'net';
import * as chalk from 'chalk';
import {RequestType} from './types';
import {MessageEventEmitterClient} from './eventEmitterClient';

/**
 * Para ejecutar abra dos terminales, primeramente en una deberá introducir `node dist/server.js`, para activar el servidor,
 * y en el otro `node dist/client.js add --user="daniel" --title="Red note" --body="This is a red note" --color="red"`, que mandará un mensaje desde el cliente al servidor.
 * Existen otros comandos: modify, remove, list y read.
 */

// The connection is established on said TCP port through the connect function of the net module, and a socket is returned
const client = net.connect({port: 60300});
const emitter = new MessageEventEmitterClient(client); // We create a MessageEventEmitterClient object

// We create an object in JSON format, of type RequestType, said object will be processed in the write command
let requestNote: RequestType = {
  type: 'add',
  user: '',
};

/**
 * Yargs execution of the add command. The corresponding command line options must be included
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Notes\' title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Body\'s title',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color\'s note. Blue on unknown color.\nOnly red, green, blue and yellow available',
      demandOption: true,
      type: 'string',
      default: 'blue',
    },
  },
  handler(argv) {
    let addColor: colors = colors.Blue;

    // Type check
    if (typeof argv.user === 'string' && typeof argv.color === 'string' &&
    typeof argv.body === 'string' && typeof argv.title === 'string') {
      Object.values(colors).forEach((element) => {
        if (element === argv.color) addColor = element;
      });

      requestNote = {
        type: 'add',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: addColor,
      };
    }
  },
});

/**
 * Yargs execution of the modify command. The corresponding command line options must be included
 */
yargs.command( {
  command: 'modify',
  describe: 'Modify an exist note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },

    title: {
      describe: 'Notes\' title',
      demandOption: true,
      type: 'string',
    },

    body: {
      describe: 'Body\'s title',
      demandOption: true,
      type: 'string',
    },

    color: {
      describe: 'Color\'s note. Blue on unknown color.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv: any) {
    // Type check
    if (typeof argv.user === 'string' && typeof argv.title === 'string' &&
    typeof argv.color === 'string' && typeof argv.body === 'string') {
      let modifyColor: colors = colors.Blue;

      Object.values(colors).forEach((element) => {
        if (element === argv.color) modifyColor = element;
      });

      requestNote = {
        type: 'modify',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: modifyColor,
      };
    }
  },
});

/**
 * Yargs execution of the remove command. The corresponding command line options must be included
 */
yargs.command( {
  command: 'remove',
  describe: 'Remove an existing note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },

    title: {
      describe: 'Notes\' title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // Type check

    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      requestNote = {
        type: 'remove',
        user: argv.user,
        title: argv.title,
      };
    }
  },
});

/**
 * Yargs execution of the list command. The corresponding command line options must be included
 */
yargs.command({
  command: 'list',
  describe: 'List notes from a user',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // Type check
    if (typeof argv.user === 'string') {
      requestNote = {
        type: 'list',
        user: argv.user,
      };
    }
  },
});

/**
 * Yargs execution of the read command. The corresponding command line options must be included
 */
yargs.command({
  command: 'read',
  describe: 'read an existing note',
  builder: {
    user: {
      describe: 'Username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Notes\' title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // Type check
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      requestNote = {
        type: 'read',
        user: argv.user,
        title: argv.title,
      };
    }
  },
});

/**
 * Process arguments passed from command line to application
 */
yargs.parse();

/**
 * Once the input is processed, through write, we send the JSON previously created to the server through the client socket
 */
client.write(JSON.stringify(requestNote) + '\n', (err) => {
  if (err) console.log(chalk.red('Data couldn\'t be sended'));
});

/**
 * With the object of the MessageEventEmitterClient class, when we receive a 'message' event,
 * we process the response from the server and show the user the corresponding information
 */
emitter.on('message', (request) => {
  switch (request.type) {
    case 'add':
      if (request.success) console.log(chalk.green(`New note added!`));
      else console.log(chalk.red('Note title taken!'));
      break;

    case 'modify':
      if (request.success) console.log(chalk.green(`Note overwrited!`));
      else console.log(chalk.red('Couldn\'t overwrite!'));
      break;

    case 'remove':
      if (request.success) console.log(chalk.green(`Note removed!`));
      else console.log(chalk.red('Path note not found. Make sure that the user and the file name are correct, do not indicate the file extension .json'));
      break;

    case 'list':
      if (request.success) {
        request.notes.forEach((note: any) => {
          console.log(chalk.keyword(note.color)(note.title));
        });
      } else console.log(chalk.red('Couldn\'t show user notes!'));
      break;

    case 'read':
      if (request.success) {
        console.log(chalk.keyword(request.notes[0].color)(request.notes[0].title + '\n'));
        console.log(chalk.keyword(request.notes[0].color)(request.notes[0].body));
      } else console.log(chalk.red('Note not found'));
      break;

    default:
      console.log(chalk.red('Invalid type'));
      break;
  }
});

// This method is triggered when an error event is received, reporting it through a console
client.on('error', (err) => {
  console.log(`Connection could not be established: ${err.message}`);
});
```
