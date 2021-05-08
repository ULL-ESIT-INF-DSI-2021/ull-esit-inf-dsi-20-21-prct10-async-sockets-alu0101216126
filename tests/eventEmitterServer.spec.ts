import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {MessageEventEmitterServer} from '../src/eventEmitterServer';

describe('MessageEventEmitterServer', () => {
  it('Should emit a request event once it gets a complete message', (done) => {
    const emitter = new EventEmitter();
    const server = new MessageEventEmitterServer(emitter);

    server.on('request', (message) => {
      expect(message).to.be.eql({"title": "Red note ", "body": "This is a red note overwrited", "color": "red"});
      done();
    });

    emitter.emit('data', '{"title": "Red note ", "body": "This is a red note overwrited"');
    emitter.emit('data', ', "color": "red"}');
    emitter.emit('data', '\n');
  });
});
