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
