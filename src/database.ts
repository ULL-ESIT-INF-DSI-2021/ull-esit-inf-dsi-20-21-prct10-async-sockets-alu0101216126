import * as fs from 'fs';
import {Notes} from './notes';

/**
 * @class Database to be able to work with the notes and the fs module (directories and files)
 */
export class Database {
  /**
   * Default constructor
   */
  constructor() {
  }

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
  }

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

