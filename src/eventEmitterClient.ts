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

