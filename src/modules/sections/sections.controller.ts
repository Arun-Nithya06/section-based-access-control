import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Section } from 'src/db/entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@ApiTags('sections')
@Controller('sections')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @Permissions('sections:create', 'sections:manage')
  @ApiOperation({ summary: 'Create section' })
  @ApiResponse({ status: 201, type: Section })
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionsService.create(createSectionDto);
  }

  @Get()
  @Permissions('sections:read', 'sections:manage')
  @ApiOperation({ summary: 'Get all sections' })
  @ApiResponse({ status: 200, type: [Section] })
  findAll() {
    return this.sectionsService.findAll();
  }

  @Get(':id')
  @Permissions('sections:read', 'sections:manage')
  @ApiOperation({ summary: 'Get section by id' })
  @ApiResponse({ status: 200, type: Section })
  findOne(@Param('id') id: string) {
    return this.sectionsService.findOne(id);
  }

  @Get('name/:name')
  @Permissions('sections:read', 'sections:manage')
  @ApiOperation({ summary: 'Get section by name' })
  @ApiResponse({ status: 200, type: Section })
  findByName(@Param('name') name: string) {
    return this.sectionsService.findByName(name);
  }

  @Patch(':id')
  @Permissions('sections:update', 'sections:manage')
  @ApiOperation({ summary: 'Update section' })
  @ApiResponse({ status: 200, type: Section })
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.update(id, updateSectionDto);
  }

  @Delete(':id')
  @Permissions('sections:delete', 'sections:manage')
  @ApiOperation({ summary: 'Delete section' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string) {
    return this.sectionsService.remove(id);
  }
}
