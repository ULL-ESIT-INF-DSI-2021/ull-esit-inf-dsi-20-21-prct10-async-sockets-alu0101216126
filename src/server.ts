import {Notes} from './notes';
import {ResponseType} from './types';
import * as chalk from 'chalk';
import * as net from 'net';
import {Database} from './database';
import {MessageEventEmitterServer} from './eventEmitterServer';

/**
 * Para ejecutar abra dos terminales, primeramente en una deberá introducir `node dist/server.js`, para activar el servidor,
 * y en el otro `node dist/client.js add --user="daniel" --title="Red note" --body="This is a red note" --color="red"`, que mandará un mensaje desde el cliente al servidor.
 * Existen otros comandos: modify, remove, list y read.
 */

// Through createServer we create a Server object, here the input of the clients will be processed
const server = net.createServer((connection) => {
  const emitter = new MessageEventEmitterServer(connection); // We create a MessageEventEmitterClient object

  // We indicate that the connection has been established
  console.log(chalk.blueBright('A client has connected.'));

  /**
   * With the object of the MessageEventEmitterClient class, when we receive a 'request' event,
   * we process the response from the client. Here we do the corresponding functions and show the user the corresponding information
   */
  emitter.on('request', (message) => {
    const request = message;
    const database = new Database(); // We create an object of class fs to be able to work with the notes and the fs module

    // We create an object in JSON format, of type ResponseType, said object will be processed in the write command.
    const responseNote: ResponseType = {
      type: 'add',
      success: true,
    };

    switch (request.type) {
      case 'add':
        const add = new Notes(request.user, request.title, request.body, request.color);
        responseNote.type = 'add';
        if (!database.addNote(add)) responseNote.success = false;
        break;

      case 'modify':
        const modify = new Notes(request.user, request.title, request.body, request.color);
        responseNote.type = 'modify';
        if (!database.modifyNote(modify)) responseNote.success = false;
        break;

      case 'remove':
        responseNote.type = 'remove';
        if (!database.removeNote(request.user, request.title)) responseNote.success = false;
        break;

      case 'list':
        responseNote.type = 'list';
        const array = database.listNotes(request.user);
        if (array === []) responseNote.success = false;
        else responseNote.notes = array;
        break;

      case 'read':
        responseNote.type = 'read';
        const note = database.readNote(request.user, request.title);
        if (note === null) responseNote.success = false;
        else responseNote.notes = [note];
        break;

      default:
        console.log(chalk.red('Invalid type'));
        break;
    }
    /**
     * Once the input is processed, through write, we send the JSON previously created to the server through the client socket
     */
    connection.write(JSON.stringify(responseNote), (err) => {
      if (err) console.log(chalk.red(`Request could not be made: ${err.message}`));
      else {
        console.log(chalk.green(`Request completed successfully`));
        connection.end(); // We send messages
      }
    });
  });
});

// It is specified that the server will be listening or observing TCP port 60300
server.listen(60300, () => {
  console.log(chalk.blueBright('Waiting for clients to connect.'));
});
