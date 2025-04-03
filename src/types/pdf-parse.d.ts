declare module 'pdf-parse' {
  interface PDFInfo {
    numpages: number;
    numrender: number;
    info: Record<string, string | number | undefined>;
    metadata: {
      metadata: Record<string, unknown>;
      metadataRaw: string;
    } | null;
    version: string;
  }

  interface PDFResult {
    text: string;
    info: PDFInfo;
    metadata: {
      metadata: Record<string, unknown>;
      metadataRaw: string;
    } | null;
  }

  const pdfParse: (dataBuffer: Buffer) => Promise<PDFResult>;
  export = pdfParse;
}
