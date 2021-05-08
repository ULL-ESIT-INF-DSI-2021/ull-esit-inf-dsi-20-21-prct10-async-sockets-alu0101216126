import {EventEmitter} from 'events';

/**
 * @class Class to complement the functionality of the server, this class inherits from the EventEmitter class of the events module
 */
export class MessageEventEmitterServer extends EventEmitter {
  /**
   * We initialize attributes. After that we process the 'data' event
   * and, we emit a 'request' event
   * @param connection EventEmitter type parameter, we will use this attribute to process and emit events
   */
  constructor(connection: EventEmitter) {
    super();
    let wholeData = '';

    // We get the message through the data event
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit('request', JSON.parse(message)); // We emit the request event
        messageLimit = wholeData.indexOf('\n');
      }
    });
  }
}
