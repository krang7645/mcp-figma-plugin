figma.showUI(__html__);

figma.ui.resize(400, 300);

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export-to-mcp') {
    try {
      const selection = figma.currentPage.selection;
      if (selection.length === 0) {
        figma.ui.postMessage({ type: 'error', message: '要素が選択されていません' });
        return;
      }

      const exportData = {
        elements: selection.map(node => ({
          id: node.id,
          name: node.name,
          type: node.type,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
        }))
      };

      // MCPのエンドポイントにデータを送信
      const response = await fetch('http://localhost:3000/mcp/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportData)
      });

      if (!response.ok) {
        throw new Error('MCPへのエクスポートに失敗しました');
      }

      figma.ui.postMessage({ type: 'success', message: 'MCPへのエクスポートが完了しました' });
    } catch (error) {
      figma.ui.postMessage({ type: 'error', message: error.message });
    }
  }
};