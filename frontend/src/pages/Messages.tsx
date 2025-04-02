import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/Shared/components/ui/card";
import { Input } from "@/Shared/components/ui/input";
import { Button } from "@/Shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Shared/components/ui/avatar";
import { ScrollArea } from "@/Shared/components/ui/scroll-area";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { format } from "date-fns";

const Messages = () => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const { 
    contacts, 
    conversations, 
    selectedContact, 
    loading, 
    sendMessage, 
    handleSelectContact 
  } = useMessages();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedContact, conversations]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    const sentMessage = await sendMessage(newMessage);
    
    if (sentMessage) {
      setNewMessage("");
      toast("Message Sent", {
        description: `Message sent to ${selectedContact.name}`,
      });
    } else {
      toast("Error", {
        description: "Failed to send message"
      });
    }
  };

  // Format date for display
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'p');
    } else if (
      date.getFullYear() === now.getFullYear() && 
      date.getMonth() === now.getMonth() && 
      date.getDate() === now.getDate() - 1
    ) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-8 px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-muted-foreground mb-4">
              You need to be logged in to access your messages.
            </p>
            <Button asChild>
              <a href="/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-10rem)]">
        {/* Contacts List */}
        <Card className="md:col-span-4">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Input 
                placeholder="Search conversations..." 
                className="w-full"
              />
              <ScrollArea className="h-[calc(100vh-14rem)]">
                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <p className="text-muted-foreground">Loading contacts...</p>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="flex items-center justify-center p-4">
                    <p className="text-muted-foreground">No conversations yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors
                          ${selectedContact?.id === contact.id ? 'bg-secondary' : ''}`}
                        onClick={() => handleSelectContact(contact)}
                      >
                        <Avatar>
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{contact.name}</h4>
                              {contact.company && (
                                <p className="text-xs text-muted-foreground">{contact.company}</p>
                              )}
                            </div>
                            {contact.unread > 0 && (
                              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                                {contact.unread}
                              </span>
                            )}
                          </div>
                          {contact.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {contact.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-8">
          <CardContent className="p-4 h-full flex flex-col">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Avatar>
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback>{selectedContact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    {selectedContact.company && (
                      <p className="text-sm text-muted-foreground">{selectedContact.company}</p>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-4 py-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Loading messages...</p>
                    </div>
                  ) : conversations[selectedContact.id]?.length ? (
                    <div className="space-y-4">
                      {conversations[selectedContact.id].map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${message.isOwn ? 'bg-primary text-primary-foreground' : 'bg-secondary'} rounded-lg px-4 py-2`}>
                            <p className="text-sm">{message.content}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {formatMessageTime(message.created_at)}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                {loading ? "Loading..." : "Select a conversation to start messaging"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
