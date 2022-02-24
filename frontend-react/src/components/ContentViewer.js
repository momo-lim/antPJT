import React, { createRef, useEffect } from 'react';
import { Viewer } from '@toast-ui/react-editor';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

import '@toast-ui/chart/dist/toastui-chart.css';
import chart from '@toast-ui/editor-plugin-chart';

import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';

import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import uml from '@toast-ui/editor-plugin-uml';

export default function ContentViewer({ initialValue }) {
  const editorRef = createRef();
  const chartOptions = {
    minWidth: 100,
    maxWidth: 800,
    minHeight: 100,
    maxHeight: 400,
  };

  // Viewer가 props에 따라 rerendering이 안돼서 수동으로 initialValue변경을 감지해 instance값을 변경해줌
  useEffect(() => {
    editorRef.current.getInstance().setMarkdown(initialValue);
  }, [initialValue]);

  return (
    <div>
      <Viewer
        initialValue={initialValue}
        plugins={[
          // colorSyntax,
          [chart, chartOptions],
          [codeSyntaxHighlight, { highlighter: Prism }],
          tableMergedCell,
          uml,
        ]}
        ref={editorRef}
      />
    </div>
  );
}
