"use client";

import { useEffect, useState } from "react";

export function SSEDemo() {
  const [data, setData] = useState<{ count: number; time: string } | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setData(parsedData);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (!data) return <div>Waiting for SSE...</div>;

  return (
    <div className="p-4 border rounded shadow">
      <h3 className="font-bold">Server-Sent Events Demo</h3>
      <p>Count: {data.count}</p>
      <p>Time: {data.time}</p>
    </div>
  );
}
