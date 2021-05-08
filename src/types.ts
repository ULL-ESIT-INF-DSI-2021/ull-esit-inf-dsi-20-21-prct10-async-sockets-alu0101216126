import {Notes, colors} from './notes';
export type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' ;
    user: string;
    title?: string;
    body?: string;
    color?: colors;
  }

export type ResponseType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list';
    success: boolean;
    notes?: Notes[];
  }
