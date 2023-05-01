import { Module } from '@nestjs/common';
import { TagController } from '@app/controllers';
import { TagService } from '@app/services';

@Module({
	imports: [],
	controllers: [TagController],
	providers: [TagService]
})
export default class TagModule {}
