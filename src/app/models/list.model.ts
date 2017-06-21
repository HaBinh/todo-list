import { Tasks } from './tasks.model';

export class List {
    id: number;
    user_id: number;
    title: string;
    constructor(values: Object={}){
        Object.assign(this, values);
    }
}