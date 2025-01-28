// @ts-nocheck
import { Test, TestingModule } from "@nestjs/testing";
import { NotesService } from "./notes.service";
import { SupabaseService } from "../supabase/supabase.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";

/**
 * Tests for the NotesService
 */
describe("NotesService", () => {
  let service: NotesService;
  let supabaseService: Partial<Record<keyof SupabaseService, jest.Mock>>;

  beforeEach(async () => {
    supabaseService = {
      getClient: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        ilike: jest.fn().mockReturnThis(),
        contains: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: SupabaseService, useValue: supabaseService },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  describe("getUserNotes", () => {
    it("should fetch user notes with search and tag filter", async () => {
      const mockNotes = [{ id: 1, title: "Note 1", content: "Content" }];
      supabaseService.getClient().from().select.mockResolvedValue({
        data: mockNotes,
        error: null,
      });

      const result = await service.getUserNotes(1, "Note", "tag");
      expect(result).toEqual(mockNotes);
      expect(supabaseService.getClient().from).toHaveBeenCalledWith("notes");
      expect(supabaseService.getClient().from().select).toHaveBeenCalled();
      expect(supabaseService.getClient().from().ilike).toHaveBeenCalledWith(
        "title",
        "%Note%",
      );
      expect(supabaseService.getClient().from().contains).toHaveBeenCalledWith(
        "tags",
        ["tag"],
      );
    });

    it("should throw an error if fetching notes fails", async () => {
      supabaseService
        .getClient()
        .from()
        .select.mockResolvedValue({
          data: null,
          error: new Error("Database error"),
        });

      await expect(service.getUserNotes(1)).rejects.toThrow("Database error");
    });
  });

  describe("createNote", () => {
    it("should create a new note", async () => {
      const newNote = { id: 1, title: "New Note", content: "Content" };
      supabaseService
        .getClient()
        .from()
        .insert.mockResolvedValue({
          data: [newNote],
          error: null,
        });

      const result = await service.createNote({
        userId: 1,
        title: "New Note",
        content: "Content",
      });

      expect(result).toEqual([newNote]);
      expect(supabaseService.getClient().from().insert).toHaveBeenCalled();
    });

    it("should throw BadRequestException on error", async () => {
      supabaseService
        .getClient()
        .from()
        .insert.mockResolvedValue({
          data: null,
          error: { message: "Insert failed" },
        });

      await expect(
        service.createNote({
          userId: 1,
          title: "New Note",
          content: "Content",
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("updateNote", () => {
    it("should update an existing note", async () => {
      const existingNote = {
        id: 1,
        user_id: 1,
        shared_with_user_ids: [],
      };
      supabaseService
        .getClient()
        .from()
        .select.mockResolvedValue({
          data: [existingNote],
          error: null,
        });
      supabaseService
        .getClient()
        .from()
        .update.mockResolvedValue({
          data: [existingNote],
          error: null,
        });

      const result = await service.updateNote(1, 1, { title: "Updated Title" });
      expect(result).toEqual([existingNote]);
      expect(supabaseService.getClient().from().update).toHaveBeenCalled();
    });

    it("should throw NotFoundException if note does not exist", async () => {
      supabaseService.getClient().from().select.mockResolvedValue({
        data: [],
        error: null,
      });

      await expect(service.updateNote(1, 1, {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw BadRequestException if user is not allowed to update", async () => {
      const existingNote = {
        id: 1,
        user_id: 2,
        shared_with_user_ids: [],
      };
      supabaseService
        .getClient()
        .from()
        .select.mockResolvedValue({
          data: [existingNote],
          error: null,
        });

      await expect(service.updateNote(1, 1, {})).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("getUserIdFromUsername", () => {
    it("should return user ID for valid username", async () => {
      supabaseService
        .getClient()
        .from()
        .maybeSingle.mockResolvedValue({
          data: { id: 1 },
          error: null,
        });

      const result = await service.getUserIdFromUsername("testuser");
      expect(result).toBe(1);
    });

    it("should throw NotFoundException for invalid username", async () => {
      supabaseService.getClient().from().maybeSingle.mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(
        service.getUserIdFromUsername("invaliduser"),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("shareNoteWithUser", () => {
    it("should share a note with another user", async () => {
      const existingNote = {
        id: 1,
        user_id: 1,
        shared_with_user_ids: [],
      };
      supabaseService.getClient().from().select.mockResolvedValue({
        data: existingNote,
        error: null,
      });
      supabaseService
        .getClient()
        .from()
        .update.mockResolvedValue({
          data: [{ id: 1 }],
          error: null,
        });

      supabaseService
        .getClient()
        .from()
        .maybeSingle.mockResolvedValue({
          data: { id: 2 },
          error: null,
        });

      const result = await service.shareNoteWithUser(1, 1, "testuser");
      expect(result).toEqual([{ id: 1 }]);
    });
  });
});
