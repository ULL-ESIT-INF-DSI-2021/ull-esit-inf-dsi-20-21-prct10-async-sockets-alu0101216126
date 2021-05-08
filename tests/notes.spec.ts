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

