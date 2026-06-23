import { useEffect, useState } from "react";
import api from "../api/axios";

function MessagesPage({ user }) {
  const [conversations, setConversations] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedEmail) {
      loadConversation(selectedEmail);
    }
  }, [selectedEmail]);

  const loadConversations = () => {
    api.get("/messages/conversations")
      .then(res => setConversations(res.data))
      .catch(err => console.error(err));
  };

  const loadConversation = (email) => {
    api.get(`/messages/conversation/${email}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  };

  const sendMessage = (e) => {
    e.preventDefault();

    api.post("/messages/send", {
      receiverEmail: selectedEmail,
      text
    })
      .then(() => {
        setText("");
        loadConversation(selectedEmail);
        loadConversations();
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white">
            <h5 className="mb-0">Inbox</h5>
          </div>

          <div className="list-group list-group-flush">
            {conversations.map(c => (
              <button
                key={c.email}
                className={
                  selectedEmail === c.email
                    ? "list-group-item list-group-item-action active"
                    : "list-group-item list-group-item-action"
                }
                onClick={() => setSelectedEmail(c.email)}
              >
                <strong>{c.email}</strong>
                <br />
                <small>{c.lastMessage}</small>
              </button>
            ))}

            {conversations.length === 0 && (
              <div className="p-3 text-muted">
                No conversations yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-md-8">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              {selectedEmail ? `Chat with ${selectedEmail}` : "Select conversation"}
            </h5>
          </div>

          <div className="card-body">
            <div
              className="border rounded p-3 mb-3"
              style={{ minHeight: "300px" }}
            >
              {messages.map(message => (
                <div
                  key={message.id}
                  className={
                    message.senderEmail === user.email
                      ? "text-end mb-2"
                      : "text-start mb-2"
                  }
                >
                  <span
                    className={
                      message.senderEmail === user.email
                        ? "badge bg-success p-2"
                        : "badge bg-secondary p-2"
                    }
                  >
                    {message.text}
                  </span>
                </div>
              ))}

              {selectedEmail && messages.length === 0 && (
                <p className="text-muted">No messages yet.</p>
              )}
            </div>

            {selectedEmail && (
              <form onSubmit={sendMessage}>
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Type message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />

                  <button className="btn btn-success">
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;