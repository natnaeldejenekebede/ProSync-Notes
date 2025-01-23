import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Param,
  Patch,
  Delete,
  Query
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from '../types/authenticated-request';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getNotes(
    @Request() req: AuthenticatedRequest,
    @Query('search') search?: string,
    @Query('tag') tag?: string
  ) {
    return this.notesService.getUserNotes(req.user.id, search, tag);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createNote(
    @Request() req: AuthenticatedRequest,
    @Body() body: {
      title: string;
      content: string;
      tags?: string[];
      dueDate?: string;
      color?: string;
    }
  ) {
    return this.notesService.createNote({
      userId: req.user.id,
      title: body.title,
      content: body.content,
      tags: body.tags,
      dueDate: body.dueDate,
      color: body.color
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateNote(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updates: any
  ) {
    return this.notesService.updateNote(+id, req.user.id, updates);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/share')
  async shareNote(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: { targetUserId: number }
  ) {
    return this.notesService.shareNoteWithUser(+id, req.user.id, body.targetUserId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async removeNoteForUser(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string
  ) {
    return this.notesService.removeNoteForUser(+id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reorder')
  async reorderNotes(
    @Request() req: AuthenticatedRequest,
    @Body() body: { noteOrder: number[] }
  ) {
    return this.notesService.reorderNotes(req.user.id, body.noteOrder);
  }
}
