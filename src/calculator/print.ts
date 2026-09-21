/** Opens the browser's print dialog, where "Save as PDF" produces the download. */
export function printAs(title: string): void {
  const previous = document.title;
  const restore = () => {
    document.title = previous;
    window.removeEventListener('afterprint', restore);
  };
  window.addEventListener('afterprint', restore);
  // The document title becomes the suggested PDF file name.
  document.title = title;
  window.print();
}
