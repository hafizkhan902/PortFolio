import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaReply, FaCalendarAlt } from 'react-icons/fa';
import { useNotification } from '../ui/Notification';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, read, unread
  const { showSuccess, showError } = useNotification();



  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:4000/api/admin/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      showError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [showError]);
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:4000/api/admin/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, read: true } : msg
        ));
      }
    } catch (error) {
      showError('Failed to mark message as read');
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:4000/api/admin/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg._id !== messageId));
        setSelectedMessage(null);
        showSuccess('Message deleted successfully');
      }
    } catch (error) {
      showError('Failed to delete message');
    }
  };

  const handleReply = (email, subject) => {
    const mailtoLink = `mailto:${email}?subject=Re: ${subject}`;
    window.open(mailtoLink, '_blank');
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'read') return msg.read;
    if (filter === 'unread') return !msg.read;
    return true;
  });

  const MessageCard = ({ message, isSelected, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'border-accent-blue bg-accent-blue/5' 
          : 'border-gray-200 dark:border-gray-700 hover:border-accent-blue/50'
      } ${!message.read ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {message.read ? (
            <FaEnvelopeOpen className="w-4 h-4 text-gray-400" />
          ) : (
            <FaEnvelope className="w-4 h-4 text-accent-blue" />
          )}
          <h3 className="font-medium text-sm">{message.name}</h3>
          {!message.read && (
            <span className="w-2 h-2 bg-accent-blue rounded-full"></span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {new Date(message.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{message.email}</p>
      <p className="text-sm font-medium mb-2">{message.subject}</p>
      <p className="text-xs text-gray-500 line-clamp-2">{message.message}</p>
    </motion.div>
  );

  const MessageDetail = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">{message.subject}</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>From: {message.name}</span>
            <span>({message.email})</span>
            <span className="flex items-center space-x-1">
              <FaCalendarAlt className="w-3 h-3" />
              <span>{new Date(message.createdAt).toLocaleString()}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!message.read && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              Unread
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3">Message:</h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {message.message}
          </p>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => handleReply(message.email, message.subject)}
          className="flex items-center space-x-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-purple transition-colors"
        >
          <FaReply className="w-4 h-4" />
          <span>Reply</span>
        </button>
        {!message.read && (
          <button
            onClick={() => markAsRead(message._id)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
          >
            <FaEnvelopeOpen className="w-4 h-4" />
            <span>Mark as Read</span>
          </button>
        )}
        <button
          onClick={() => deleteMessage(message._id)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
        >
          <FaTrash className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Messages List */}
      <div className="lg:col-span-1 mb-4 lg:mb-0">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Messages ({messages.length})</h2>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2 mb-4">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'read', label: 'Read' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  filter === key
                    ? 'bg-accent-blue text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                isSelected={selectedMessage?._id === message._id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.read) {
                    markAsRead(message._id);
                  }
                }}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <FaEnvelope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {filter === 'all' ? 'No messages yet' : `No ${filter} messages`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-2">
        {selectedMessage ? (
          <MessageDetail message={selectedMessage} />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
            <FaEnvelope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Select a message to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;