import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from 'src/db/entities/section.entity';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
  private readonly logger = new Logger(SectionsService.name);

  constructor(
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,
  ) {}

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const existingSection = await this.sectionsRepository.findOne({
      where: { name: createSectionDto.name },
    });

    if (existingSection) {
      throw new ConflictException('Section with this name already exists');
    }

    const section = this.sectionsRepository.create(createSectionDto);
    const savedSection = await this.sectionsRepository.save(section);

    this.logger.log(`Section created: ${savedSection.name}`);
    return savedSection;
  }

  async findAll(): Promise<Section[]> {
    return this.sectionsRepository.find({
      relations: ['permissions', 'permissions.role'],
    });
  }

  async findOne(id: string): Promise<Section> {
    const section = await this.sectionsRepository.findOne({
      where: { id },
      relations: ['permissions', 'permissions.role'],
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    return section;
  }

  async findByName(name: string): Promise<Section> {
    const section = await this.sectionsRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    return section;
  }

  async update(
    id: string,
    updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    const section = await this.findOne(id);

    if (updateSectionDto.name && updateSectionDto.name !== section.name) {
      const existingSection = await this.sectionsRepository.findOne({
        where: { name: updateSectionDto.name },
      });

      if (existingSection) {
        throw new ConflictException('Section with this name already exists');
      }
    }

    const updatedSection = await this.sectionsRepository.save({
      ...section,
      ...updateSectionDto,
    });

    this.logger.log(`Section updated: ${updatedSection.name}`);
    return updatedSection;
  }

  async remove(id: string): Promise<void> {
    const section = await this.findOne(id);
    await this.sectionsRepository.softRemove(section);
    this.logger.log(`Section deleted: ${section.name}`);
  }
}
