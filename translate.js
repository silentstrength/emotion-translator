export default async function handler(req, res) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト（プリフライト）への対応
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { situation } = req.body;

    if (!situation || situation.trim().length === 0) {
      return res.status(400).json({ error: '状況を入力してください' });
    }

    // Anthropic APIキーの確認
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY is not set');
      return res.status(500).json({ error: 'サーバー設定エラー' });
    }

    // Anthropic APIを呼び出し
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `あなたは国際恋愛における感情翻訳の専門家です。以下の状況を、FINR法（Feeling, Impact, Need, Request）に基づいて、相手を責めずに自分の気持ちを伝える英語に翻訳してください。

状況：${situation}

以下の形式で、2〜3文の英語を生成してください：
- 感情を表現する（I feel...）
- 自分への影響を伝える（This makes me feel...）
- 必要なことを述べる（I need...）
- 具体的なお願いをする（Can we...? / Would you...?）

英語のみを出力してください。説明は不要です。`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      return res.status(response.status).json({ 
        error: 'AI APIエラーが発生しました' 
      });
    }

    const data = await response.json();
    const translatedText = data.content[0].text;

    return res.status(200).json({ 
      translation: translatedText 
    });

  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({ 
      error: 'エラーが発生しました。もう一度お試しください。' 
    });
  }
}
