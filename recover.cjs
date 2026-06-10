const fs = require('fs');

const transcriptPath = 'C:/Users/yuvaa/.gemini/antigravity-ide/brain/872cdd6a-f65a-407e-aac4-7ed5aeba4ad0/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf-8').split('\n');

let writes = {};

lines.forEach(l => {
  if (!l) return;
  try {
    const j = JSON.parse(l);
    if (j.type === 'PLANNER_RESPONSE' && j.tool_calls) {
      j.tool_calls.forEach(tc => {
        let args = tc.args;
        if (!args) return;

        let targetFile = args.TargetFile;
        if (!targetFile) return;

        if (typeof targetFile === 'string' && targetFile.startsWith('"')) {
          try { targetFile = JSON.parse(targetFile); } catch (e) {}
        }
        if (typeof targetFile === 'string') {
          targetFile = targetFile.replace(/\\/g, '/');
        }

        if (tc.name === 'write_to_file') {
          let content = args.CodeContent;
          if (typeof content === 'string' && content.startsWith('"')) {
            try { content = JSON.parse(content); } catch(e) {}
          }
          writes[targetFile] = { content: content, isReplace: false };
        } else if (tc.name === 'replace_file_content') {
          let targetContent = args.TargetContent;
          if (typeof targetContent === 'string' && targetContent.startsWith('"')) {
            try { targetContent = JSON.parse(targetContent); } catch(e) {}
          }
          
          let repContent = args.ReplacementContent;
          if (typeof repContent === 'string' && repContent.startsWith('"')) {
            try { repContent = JSON.parse(repContent); } catch(e) {}
          }
          
          if (!writes[targetFile]) {
            try {
              writes[targetFile] = { content: fs.readFileSync(targetFile, 'utf-8'), isReplace: true };
            } catch (e) {
              return;
            }
          }
          
          writes[targetFile].content = writes[targetFile].content.replace(targetContent, repContent);
        }
      });
    }
  } catch (e) {
    // ignore
  }
});

Object.keys(writes).forEach(k => {
  if (k.endsWith('.md')) return; // don't restore task.md, implementation_plan.md etc
  const data = writes[k].content;
  console.log('Recovering ' + k);
  fs.writeFileSync(k, data);
});
