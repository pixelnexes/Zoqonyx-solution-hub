// Loads Mozilla pdf.js on the client only, with its worker, for real PDF
// rendering and text extraction (pdf-lib cannot do either).
type PdfJs = typeof import("pdfjs-dist");

let loader: Promise<PdfJs> | null = null;

export function loadPdfJs(): Promise<PdfJs> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("pdf.js runs in the browser only"));
  }
  if (!loader) {
    loader = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      return pdfjs;
    });
  }
  return loader;
}

/** Opens a PDF from a File. Throws with a clear message for password-protected files. */
export async function openPdf(file: File, password?: string) {
  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  try {
    return await pdfjs.getDocument({ data, password }).promise;
  } catch (e: any) {
    if (e?.name === "PasswordException") {
      throw new Error("This PDF is password protected. Unlock it first with the Unlock PDF tool.");
    }
    throw e;
  }
}
