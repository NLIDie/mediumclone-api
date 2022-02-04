import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { TagService } from './tag.service'

@ApiBearerAuth()
@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 200,
    description: 'Create user',
  })
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.findAll()

    return {
      tags: tags.map((tag) => tag.name),
    }
  }
}
