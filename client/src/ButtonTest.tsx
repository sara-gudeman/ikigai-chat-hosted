import { useVoice } from '@humeai/voice-react';
import { useEffect, useState } from 'react';

export function ButtonTest({ accessToken }: { accessToken: string }) {
  const [token, setToken] = useState<string | null>(null);
  const { connect } = useVoice();
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token`)
          .then(response => response.json())
          .then(data => {
            return data;
          });
        setToken(response);
        console.log('accessToken:', response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  }, []);

  return (
    <>
      <button
        onClick={() => {
          void connect({
            auth: { type: 'accessToken', value: accessToken },
            configId: '<YOUR_CONFIG_ID>',
            // other configuration props go here
          });
        }}
      >
        Start Call
      </button>
    </>
  );
}
