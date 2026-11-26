import React, { createContext, useContext, useMemo, useState } from 'react';
import { formatFileSize } from './fileService';
import {
  DEFAULT_USER,
  INITIAL_BOOKMARK_IDS,
  INITIAL_NOTES,
} from './mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(DEFAULT_USER);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [bookmarkedIds, setBookmarkedIds] = useState(INITIAL_BOOKMARK_IDS);

  const login = ({ email }) => {
    const cleanEmail = email.trim();
    const inferredName = cleanEmail
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    setUser((prev) => ({
      ...prev,
      name: inferredName || DEFAULT_USER.name,
      email: cleanEmail || DEFAULT_USER.email,
    }));
    setIsAuthenticated(true);
  };

  const signup = ({ name, email }) => {
    setUser((prev) => ({
      ...prev,
      name: name.trim(),
      email: email.trim(),
    }));
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const toggleBookmark = (noteId) => {
    setBookmarkedIds((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [noteId, ...prev]
    );
  };

  const addNote = ({
    title,
    description,
    subject,
    semester,
    fileType = 'pdf',
    file = null,
    images = [],
  }) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    const isImages = fileType === 'images';
    const normalizedImages = isImages
      ? images.map((img, index) => ({
          id: img.id || `img-${Date.now()}-${index}`,
          uri: img.uri,
          fileName: img.fileName || `note_image_${index + 1}.jpg`,
          mimeType: img.mimeType || 'image/jpeg',
          fileSize: img.fileSize || 0,
          width: img.width || 0,
          height: img.height || 0,
        }))
      : [];

    const totalImageBytes = normalizedImages.reduce(
      (sum, item) => sum + (item.fileSize || 0),
      0
    );

    const newNote = {
      id: `note-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      subject,
      semester,
      uploader: user.name,
      uploadDate: formattedDate,
      uploadedAt: now.getTime(),
      popularityScore: 1,
      downloads: 0,
      fileType: isImages ? 'images' : 'pdf',
      pages: isImages ? normalizedImages.length : 12,
      fileName: isImages
        ? normalizedImages[0]?.fileName || `${normalizedImages.length} images`
        : file?.name || 'study_notes.pdf',
      fileSize: isImages
        ? totalImageBytes > 0
          ? formatFileSize(totalImageBytes)
          : `${normalizedImages.length} ${
              normalizedImages.length === 1 ? 'photo' : 'photos'
            }`
        : file?.size
        ? formatFileSize(file.size)
        : '1.0 MB',
      fileUri: isImages ? null : file?.uri || null,
      images: normalizedImages,
      isUserUpload: true,
    };

    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const bookmarkedNotes = useMemo(
    () => notes.filter((note) => bookmarkedIds.includes(note.id)),
    [notes, bookmarkedIds]
  );

  const myUploads = useMemo(
    () => notes.filter((note) => note.isUserUpload),
    [notes]
  );

  const value = {
    isAuthenticated,
    user,
    notes,
    bookmarkedIds,
    bookmarkedNotes,
    myUploads,
    login,
    signup,
    logout,
    toggleBookmark,
    addNote,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
