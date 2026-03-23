import { useState } from 'react';

export default function Home() {
  const [situation, setSituation] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!situation.trim()) {
      setError('状況を入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setTranslation('');

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ situation: situation.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'エラーが発生しました');
      }

      setTranslation(data.translation);
    } catch (err) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translation);
    alert('コピーしました！');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #E8F4F4 0%, #F7F5F2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '40px' }}>
          <h1 style={{ 
            color: '#2D7D7D', 
            fontSize: '28px', 
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            AI感情翻訳ツール
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            日本語で状況を入力すると、英語で気持ちを伝える文章を生成します
          </p>
        </div>

        {/* Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#2C2C2C',
            fontWeight: '500'
          }}>
            状況を入力してください（最大200字）
          </label>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value.slice(0, 200))}
            placeholder="例：パートナーが予定を相談なく変更して、尊重されていないと感じた"
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '15px',
              fontSize: '16px',
              border: '2px solid #E8F4F4',
              borderRadius: '12px',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
            disabled={loading}
          />
          <div style={{ 
            textAlign: 'right', 
            fontSize: '14px', 
            color: '#666',
            marginTop: '5px'
          }}>
            {situation.length}/200
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleTranslate}
          disabled={loading || !situation.trim()}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: loading || !situation.trim() ? '#ccc' : '#2D7D7D',
            border: 'none',
            borderRadius: '12px',
            cursor: loading || !situation.trim() ? 'not-allowed' : 'pointer',
            marginBottom: '30px',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? '生成中...' : '英語に翻訳する'}
        </button>

        {/* Error */}
        {error && (
          <div style={{
            padding: '15px',
            backgroundColor: '#FDF0F0',
            border: '1px solid #CC4444',
            borderRadius: '12px',
            color: '#CC4444',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Result */}
        {translation && (
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#2D7D7D',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              生成された英語：
            </div>
            <div style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: '#2C2C2C',
              fontStyle: 'italic',
              marginBottom: '15px',
              whiteSpace: 'pre-wrap'
            }}>
              {translation}
            </div>
            <button
              onClick={handleCopy}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                color: '#2D7D7D',
                backgroundColor: '#E8F4F4',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              📋 コピー
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderRadius: '12px',
          fontSize: '14px',
          color: '#666'
        }}>
          <p style={{ marginBottom: '10px' }}>
            💡 <strong>使い方のヒント：</strong>
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li>具体的な状況を書くと、より適切な英語が生成されます</li>
            <li>「何を感じたか」を含めると効果的です</li>
            <li>生成された英語は参考として、自分の言葉で調整してください</li>
          </ul>
          <p style={{ marginTop: '15px', fontSize: '12px', color: '#999' }}>
            🔒 プライバシー：入力内容は保存されません
          </p>
        </div>
      </div>
    </div>
  );
}
