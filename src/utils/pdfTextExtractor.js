export async function extractTextFromPdf(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) {
          reject(new Error("pdf.js is not loaded. Please ensure the index.html CDN script script is loaded correctly."));
          return;
        }

        // Set workerSrc for pdf.js to run in a web worker environment
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          text += pageText + '\n';
        }

        resolve(text);
      } catch (err) {
        console.error("PDF text extraction failed:", err);
        reject(err);
      }
    };
    fileReader.onerror = (err) => reject(err);
    fileReader.readAsArrayBuffer(file);
  });
}
