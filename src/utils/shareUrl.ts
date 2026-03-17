import type { GigSheetProject } from '@/types';

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '.');
}

function fromBase64Url(s: string): Uint8Array {
  const base64 = s.replace(/-/g, '+').replace(/_/g, '/').replace(/\./g, '=');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function encodeProjectToUrl(project: GigSheetProject): Promise<string> {
  const json = JSON.stringify(project);
  const input = new Blob([json]).stream();
  const compressed = input.pipeThrough(new CompressionStream('deflate'));
  const reader = compressed.getReader();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  const encoded = toBase64Url(merged);
  const base = window.location.origin + window.location.pathname;
  return `${base}?project=${encoded}`;
}

export async function decodeProjectFromUrl(param: string): Promise<GigSheetProject> {
  const bytes = fromBase64Url(param);
  const input = new Blob([bytes.buffer as ArrayBuffer]).stream();
  const decompressed = input.pipeThrough(new DecompressionStream('deflate'));
  const reader = decompressed.getReader();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  const json = new TextDecoder().decode(merged);
  return JSON.parse(json) as GigSheetProject;
}
