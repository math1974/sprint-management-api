import { Controller, Get } from '@nestjs/common';
import { TagService } from '../services';

@Controller('tags')
export default class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  list(): string[] {
    return this.tagService.list();
  }
}
