import React, { createRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
// toast 플러그인
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

import '@toast-ui/chart/dist/toastui-chart.css';
import chart from '@toast-ui/editor-plugin-chart';

import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';

import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import uml from '@toast-ui/editor-plugin-uml';

// import { Dialog, DialogActions } from '@mui/material';

export default function ContentEditor({ setText, initialValue }) {
  // const [tempState, setState] = useState(false);
  const editorRef = createRef();
  const useCommandShortcut = true;

  const handleContent = () => {
    setText(editorRef.current.getInstance().getMarkdown());
  };
  // const handleClick = () => {
  //   editorRef.current.getInstance().exec('Bold');
  // };

  // const handleState = () => {
  //   setState(true);
  // };
  // const handleStateClose = () => {
  //   setState(false);
  // };

  // const chartOptions = {
  //   minWidth: 100,
  //   maxWidth: 400,
  //   minHeight: 100,
  //   maxHeight: 200,
  // };

  return (
    <div>
      <Editor
        autofocus={false}
        previewStyle="vertical"
        height="600px"
        initialEditType="wysiwyg"
        placeholder="내용을 입력하세요."
        useCommandShortcut={useCommandShortcut}
        plugins={[
          colorSyntax,
          [chart],
          [codeSyntaxHighlight, { highlighter: Prism }],
          tableMergedCell,
          uml,
        ]}
        ref={editorRef}
        onChange={handleContent}
        initialValue={initialValue}
      />
      {/* <button type="submit" onClick={handleState}>
        미리보기
      </button> */}

      {/* -----------------------------미리 보기--------------------- */}
      {/* <Dialog open={tempState} fullWidth>
        <Viewer initialValue={content} />
        <DialogActions>
          <button type="submit" onClick={handleStateClose}>
            닫기
          </button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
}
