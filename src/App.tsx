import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const App: React.FC = () => {
  const [lastEvent, setLastEvent] = useState<string>();
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("//localhost:8100/events", {
      withCredentials: true
    });
    eventSource.onmessage = event => {
      setLastEvent(event.data);
    };
    return () => eventSource.close();
  }, []);

  useEffect(() => {
    if (lastEvent) setEvents([...events, lastEvent]);
  }, [lastEvent]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {events.map((e, index) => (
          <div key={e}>
            #{index + 1}: {e}
          </div>
        ))}
      </header>
    </div>
  );
};

export default App;
