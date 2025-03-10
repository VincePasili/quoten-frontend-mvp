import React, { useRef, useCallback, useEffect, useContext } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import AlertContext from '../contexts/AlertContext';

const StreamingQuoteViewer = ({ generatedQuote }) => {
  const quoteContainerRef = useRef(null);
  const { showAlert } = useContext(AlertContext);

  const handleScrollToBottom = useCallback(() => {
    if (quoteContainerRef.current) {
      quoteContainerRef.current.scrollTop = quoteContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(handleScrollToBottom);
  }, [generatedQuote]);

  let cleanGeneratedQuote;
  try {
    // Convert Markdown to HTML first, then sanitize
    const markdownToHtml = marked(generatedQuote, { sanitize: true }); // sanitize option to prevent XSS
    cleanGeneratedQuote = DOMPurify.sanitize(markdownToHtml);
  } catch (err) {
    showAlert({
      message: 'An error occurred while processing the quote.',
      severity: 'error'
    });
    cleanGeneratedQuote = '';
  }

  return (
    <div 
      className="overflow-y-auto flex justify-center mb-4 mt-4"
      ref={quoteContainerRef}
      style={{height: '50vh'}}
    >
      {generatedQuote !== '' ? (
        <div
          className="max-w-[720px] text-left w-full font-sans"
          style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
          dangerouslySetInnerHTML={{ __html: cleanGeneratedQuote }}
          aria-live="polite"
        />
      ): (
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
             
    </div>
  );
};

export default StreamingQuoteViewer;