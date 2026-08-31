import { useEffect, useRef, useState, useCallback } from "react";

export const useDebounce = (value, delay) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    [value]
  );

  return debouncedValue;
}


type UseWebSocketReturn = {
  isConnected: boolean;
  messages: unknown[];
  connect: () => void;
  disconnect: () => void;
  sendMessage: (data: unknown) => boolean;
};

type UseWebSocketProps = (
  url: string,
  autoReconnect?: boolean
) => UseWebSocketReturn;

export const useWebSocket: UseWebSocketProps = (
  url,
  autoReconnect = true
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectRef = useRef<() => void>(() => { });

  const shouldReconnectRef = useRef(autoReconnect);

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<unknown[]>([]);

  useEffect(() => {
    shouldReconnectRef.current = autoReconnect;
  }, [autoReconnect]);

  const clearReconnect = useCallback(() => {
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!url) {
      return;
    }

    // Jangan membuat koneksi baru jika masih connecting / connected
    if (
      wsRef.current &&
      (
        wsRef.current.readyState === WebSocket.CONNECTING ||
        wsRef.current.readyState === WebSocket.OPEN
      )
    ) {
      return;
    }

    clearReconnect();

    const ws = new WebSocket(url);

    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        setMessages((prev) => [
          ...prev,
          parsed,
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          event.data,
        ]);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);

      if (!shouldReconnectRef.current) {
        return;
      }

      reconnectRef.current = setTimeout(() => {
        connectRef.current();
      }, 2000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [url, clearReconnect]);

  // Simpan connect terbaru ke ref
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;

    clearReconnect();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, [clearReconnect]);

  const sendMessage = useCallback((data: unknown) => {
    if (
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    ) {
      console.log('WS not connected');

      return false;
    }

    wsRef.current.send(JSON.stringify(data));

    return true;
  }, []);

  useEffect(() => {
    return () => {
      shouldReconnectRef.current = false;

      clearReconnect();

      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [clearReconnect]);

  return {
    isConnected,
    messages,
    connect,
    disconnect,
    sendMessage,
  };
};

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
};