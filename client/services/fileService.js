import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';

export function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function escapePdfText(text) {
  return String(text || '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapText(text, maxChars = 72) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    if (!word) continue;
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Generates a valid minimal single-page PDF in cache for mock sample notes
 * that do not yet have a remote backend URL or picked local file URI.
 */
function buildSamplePdfContent(note) {
  const titleLines = wrapText(note.title, 54).slice(0, 3);
  const descLines = wrapText(note.description, 76).slice(0, 12);

  const textOps = [
    'BT',
    '/F1 18 Tf',
    '54 742 Td',
    `(${escapePdfText('NoteShare Study Material')}) Tj`,
    '/F1 14 Tf',
    '0 -32 Td',
    `(${escapePdfText(titleLines[0] || 'Untitled Note')}) Tj`,
  ];

  for (let i = 1; i < titleLines.length; i += 1) {
    textOps.push('0 -18 Td', `(${escapePdfText(titleLines[i])}) Tj`);
  }

  textOps.push(
    '/F1 11 Tf',
    '0 -28 Td',
    `(${escapePdfText(
      `Subject: ${note.subject}   |   Semester: ${note.semester}`
    )}) Tj`,
    '0 -18 Td',
    `(${escapePdfText(
      `Uploaded by: ${note.uploader}   |   Date: ${note.uploadDate}`
    )}) Tj`,
    '0 -28 Td',
    `(${escapePdfText('Summary:')}) Tj`
  );

  for (const line of descLines) {
    textOps.push('0 -16 Td', `(${escapePdfText(line)}) Tj`);
  }

  textOps.push('ET');
  const stream = textOps.join('\n');

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return pdf;
}

async function resolvePdfFile(note) {
  if (note.fileUri) {
    const existing = new File(note.fileUri);
    if (existing.exists) {
      return existing;
    }
  }

  const rawName = (note.fileName || `${note.id}.pdf`).replace(
    /[^a-zA-Z0-9._-]/g,
    '_'
  );
  const safeName = rawName.toLowerCase().endsWith('.pdf')
    ? rawName
    : `${rawName}.pdf`;

  const cacheFile = new File(Paths.cache, safeName);
  cacheFile.create({ intermediates: true, overwrite: true });
  await cacheFile.write(buildSamplePdfContent(note));
  return cacheFile;
}

/**
 * Opens a PDF note using the native platform viewer (Quick Look on iOS,
 * ACTION_VIEW on Android) with a Sharing fallback if no default handler exists.
 */
export async function openPdfDocument(note) {
  const file = await resolvePdfFile(note);

  if (Platform.OS !== 'web') {
    try {
      const canPreview = await file.canPreview({
        mimeType: 'application/pdf',
      });
      if (canPreview) {
        await file.preview({
          title: note.title || file.name,
          mimeType: 'application/pdf',
        });
        return;
      }
    } catch {
      // Fall through to platform intent / share fallback
    }
  }

  if (Platform.OS === 'android') {
    try {
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: file.contentUri,
        flags: 1,
        type: 'application/pdf',
      });
      return;
    } catch {
      // Fall through to share sheet
    }
  }

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: note.title || file.name,
    });
    return;
  }

  throw new Error('No PDF viewer or share handler is available on this device.');
}
