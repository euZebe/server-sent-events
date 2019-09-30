import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const App: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("//localhost:8100/events");
    eventSource.onmessage = event => {
      if (event.data === "end") {
        console.log("unsubscribe from SSE");
        eventSource.close();
      } else {
        setEvents(allEvents => [...allEvents, event.data]);
      }
    };
    return () => eventSource.close();
  }, []);

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
