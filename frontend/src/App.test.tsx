// @ts-nocheck

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import NotesPage from "./NotesPage";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

// Mock fetch and localStorage
const mockFetch = vi.fn();
const mockGetItem = vi.fn();
const mockSetItem = vi.fn();

global.fetch = mockFetch;
global.localStorage = {
  getItem: mockGetItem,
  setItem: mockSetItem,
  removeItem: vi.fn(),
} as any;

// Wrap component with BrowserRouter for React Router usage
const renderWithRouter = (component: React.ReactNode) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

describe("NotesPage Component", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockGetItem.mockClear();
    mockSetItem.mockClear();
  });

  it("renders the NotesPage with Add Note button", () => {
    renderWithRouter(<NotesPage />);
    expect(screen.getByText(/Add Note/i)).toBeInTheDocument();
  });

  it("opens and closes the Add Note dialog", async () => {
    renderWithRouter(<NotesPage />);

    const addButton = screen.getByText(/Add Note/i);
    fireEvent.click(addButton);

    // Check if Add Note dialog appears
    expect(screen.getByText(/Add a New Note/i)).toBeInTheDocument();

    // Close dialog
    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText(/Add a New Note/i)).not.toBeInTheDocument();
    });
  });

  it("opens the Note Details dialog when a note is clicked", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            title: "Sample Note",
            content: "This is a sample note content.",
            tags: ["Work"],
            color: "#FFFFFF",
            due_date: "2025-12-31",
            pinned: false,
            shared_with_user_ids: [],
            sort_order: 0,
            user_id: 1,
          },
        ]),
    });

    renderWithRouter(<NotesPage />);

    await waitFor(() => {
      expect(screen.getByText(/Sample Note/i)).toBeInTheDocument();
    });

    const note = screen.getByText(/Sample Note/i);
    fireEvent.click(note);

    // Check if Note Details dialog appears
    await waitFor(() => {
      expect(screen.getByText(/Note Details/i)).toBeInTheDocument();
      expect(screen.getByText(/Title:/i)).toBeInTheDocument();
      expect(screen.getByText(/Content:/i)).toBeInTheDocument();
    });

    const closeButton = screen.getByTitle(/Close/i);
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText(/Note Details/i)).not.toBeInTheDocument();
    });
  });

  it("deletes a selected note with confirmation dialog", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              title: "Sample Note",
              content: "This is a sample note content.",
              tags: ["Work"],
              color: "#FFFFFF",
              due_date: "2025-12-31",
              pinned: false,
              shared_with_user_ids: [],
              sort_order: 0,
              user_id: 1,
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(),
      });

    renderWithRouter(<NotesPage />);

    await waitFor(() => {
      expect(screen.getByText(/Sample Note/i)).toBeInTheDocument();
    });

    const deleteButton = screen.getByTitle(/Delete This Note/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument();
    });

    const confirmDeleteButton = screen.getByText(/Delete/i);
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(screen.queryByText(/Sample Note/i)).not.toBeInTheDocument();
    });
  });

  it("applies a tag filter and fetches notes", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            title: "Filtered Note",
            content: "This note has the 'Work' tag.",
            tags: ["Work"],
            color: "#FFFFFF",
            due_date: null,
            pinned: false,
            shared_with_user_ids: [],
            sort_order: 0,
            user_id: 1,
          },
        ]),
    });

    renderWithRouter(<NotesPage />);

    const filterDropdown = screen.getByLabelText(/Filter by Tag/i);
    fireEvent.mouseDown(filterDropdown);

    const workOption = screen.getByText(/Work/i);
    fireEvent.click(workOption);

    const applyFilterButton = screen.getByText(/Apply Filter/i);
    fireEvent.click(applyFilterButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(screen.getByText(/Filtered Note/i)).toBeInTheDocument();
    });
  });

  it("handles error when fetching notes", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch notes"));

    renderWithRouter(<NotesPage />);

    await waitFor(() => {
      expect(screen.getByText(/Good/i)).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalled();
  });
});
