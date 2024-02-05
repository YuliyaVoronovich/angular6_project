import {Source} from './Source.model';

export class StatisticsCalls {

  constructor(
    public date: Date,
    public all_count: string,
    public sources: Source[]
  ) {}
}
