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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Notes') // Group endpoints under the "Notes" category
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Retrieve user notes' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term to filter notes' })
  @ApiQuery({ name: 'tag', required: false, description: 'Tag to filter notes' })
  @ApiResponse({ status: 200, description: 'List of user notes retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  async getNotes(
    @Request() req: AuthenticatedRequest,
    @Query('search') search?: string,
    @Query('tag') tag?: string
  ) {
    return this.notesService.getUserNotes(req.user.id, search, tag);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBody({
    description: 'Details of the new note',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title of the note' },
        content: { type: 'string', description: 'Content of the note' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Tags associated with the note' },
        dueDate: { type: 'string', format: 'date-time', description: 'Due date of the note (optional)' },
        color: { type: 'string', description: 'Color associated with the note (optional)' },
      },
    },
  })
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
      color: body.color,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  @ApiParam({ name: 'id', description: 'ID of the note to update' })
  async updateNote(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updates: any
  ) {
    return this.notesService.updateNote(+id, req.user.id, updates);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/share')
  @ApiOperation({ summary: 'Share a note with another user' })
  @ApiResponse({ status: 200, description: 'Note shared successfully' })
  @ApiResponse({ status: 404, description: 'Note not found or user not found' })
  @ApiParam({ name: 'id', description: 'ID of the note to share' })
  @ApiBody({
    description: 'Target user to share the note with',
    schema: {
      type: 'object',
      properties: {
        targetUserId: { type: 'number', description: 'ID of the user to share the note with' },
      },
    },
  })
  async shareNote(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: { targetUserId: number }
  ) {
    return this.notesService.shareNoteWithUser(+id, req.user.id, body.targetUserId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  @ApiParam({ name: 'id', description: 'ID of the note to delete' })
  async removeNoteForUser(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string
  ) {
    return this.notesService.removeNoteForUser(+id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reorder')
  @ApiOperation({ summary: 'Reorder user notes' })
  @ApiResponse({ status: 200, description: 'Notes reordered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBody({
    description: 'New order of note IDs',
    schema: {
      type: 'object',
      properties: {
        noteOrder: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of note IDs in the desired order',
        },
      },
    },
  })
  async reorderNotes(
    @Request() req: AuthenticatedRequest,
    @Body() body: { noteOrder: number[] }
  ) {
    return this.notesService.reorderNotes(req.user.id, body.noteOrder);
  }
}
