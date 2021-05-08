/* eslint-disable no-unused-vars */

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
