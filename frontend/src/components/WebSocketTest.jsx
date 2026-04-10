import { useEffect, useState, useRef } from "react";

export default function WebSocketTest() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // We use useRef to hold the WebSocket connection so it doesn't get
  // destroyed and recreated every time React re-renders the page.
  const ws = useRef(null);

  useEffect(() => {
    // "Call" the backend
    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/notifications/user123");

    // 2. What happens when the server picks up?
    ws.current.onopen = () => {
      console.log("Phone line open!");
      setMessages((prev) => [...prev, "Connected to Server"]);
    };

    // 3. What happens when the server speaks?
    ws.current.onmessage = (event) => {
      // event.data is the string the server sent us
      setMessages((prev) => [...prev, event.data]);
    };

    // 4. Hang up when the user navigates away from this page
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (ws.current && input) {
      ws.current.send(input); // Speak into the phone
      setInput("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-4">WebSocket Echo Test</h2>

      <div className="h-48 overflow-y-auto mb-4 p-2 bg-gray-50 border rounded">
        {messages.map((msg, index) => (
          <div key={index} className="text-sm text-gray-700 mb-1">
            {msg}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Send a message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}
