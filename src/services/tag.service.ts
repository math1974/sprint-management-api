import { Injectable } from '@nestjs/common';

@Injectable()
export default class TagService {
  list(): string[] {
    return ['ReactJS', 'AngularJS'];
  }
}
