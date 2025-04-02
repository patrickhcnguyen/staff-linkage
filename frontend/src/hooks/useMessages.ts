
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  isOwn?: boolean; // UI helper
};

export type Contact = {
  id: string;
  name: string;
  company?: string;
  avatar?: string;
  lastMessage?: string;
  unread: number;
};

export function useMessages() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Load contacts
  useEffect(() => {
    if (!user) return;

    async function loadContacts() {
      setLoading(true);
      try {
        // Get all conversations this user is part of (either as sender or recipient)
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        // Extract unique contacts from messages
        const contactsMap = new Map<string, { id: string; lastMessage?: string; unread: number }>();
        
        messagesData?.forEach(msg => {
          const contactId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
          
          // Skip if this is a message to self
          if (contactId === user.id) return;
          
          const isUnread = !msg.is_read && msg.recipient_id === user.id;
          
          if (!contactsMap.has(contactId)) {
            contactsMap.set(contactId, { 
              id: contactId, 
              lastMessage: msg.content,
              unread: isUnread ? 1 : 0 
            });
          } else {
            const contact = contactsMap.get(contactId)!;
            if (isUnread) {
              contact.unread += 1;
            }
            // Only update lastMessage if it's not set yet (since we're getting messages in descending order)
            if (!contact.lastMessage) {
              contact.lastMessage = msg.content;
            }
          }
        });

        // Fetch user details for each contact
        const contactsList: Contact[] = [];
        
        for (const [contactId, contactInfo] of contactsMap.entries()) {
          try {
            // Use the RPC function for getting company name - this uses a direct fetch to avoid type issues
            const { data: companyData, error: companyError } = await supabase.functions.invoke(
              'get_company_name_by_user_id', 
              { 
                body: { user_id: contactId } 
              }
            );
            
            if (companyData) {
              contactsList.push({
                id: contactId,
                name: companyData,
                company: companyData,
                lastMessage: contactInfo.lastMessage,
                unread: contactInfo.unread,
                avatar: '/placeholder.svg'
              });
            } else {
              // If not a company, try to get staff profile using a direct fetch to avoid type issues
              const { data: profileData, error: profileError } = await supabase.functions.invoke(
                'get_user_name_by_id',
                {
                  body: { user_id: contactId }
                }
              );
              
              contactsList.push({
                id: contactId,
                name: profileData || 'Unknown User',
                lastMessage: contactInfo.lastMessage,
                unread: contactInfo.unread,
                avatar: '/placeholder.svg'
              });
            }
          } catch (error) {
            console.error(`Error fetching details for contact ${contactId}:`, error);
            // Add a fallback contact entry
            contactsList.push({
              id: contactId,
              name: 'Unknown User',
              lastMessage: contactInfo.lastMessage,
              unread: contactInfo.unread,
              avatar: '/placeholder.svg'
            });
          }
        }

        setContacts(contactsList);
        
        // Select first contact if available and none selected
        if (contactsList.length > 0 && !selectedContact) {
          setSelectedContact(contactsList[0]);
        }
      } catch (error) {
        console.error("Error loading contacts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, [user, selectedContact]);

  // Load conversation with selected contact
  useEffect(() => {
    if (!user || !selectedContact) return;

    async function loadConversation() {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${selectedContact.id}),and(sender_id.eq.${selectedContact.id},recipient_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Mark messages as read
        const unreadMessageIds = data
          .filter(msg => msg.recipient_id === user.id && !msg.is_read)
          .map(msg => msg.id);
        
        if (unreadMessageIds.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadMessageIds);
            
          // Update contact's unread count
          setContacts(contacts.map(contact => {
            if (contact.id === selectedContact.id) {
              return { ...contact, unread: 0 };
            }
            return contact;
          }));
        }

        // Format messages with isOwn flag for UI
        const formattedMessages = data.map(msg => ({
          ...msg,
          isOwn: msg.sender_id === user.id
        }));

        setConversations({ 
          ...conversations, 
          [selectedContact.id]: formattedMessages 
        });
      } catch (error) {
        console.error("Error loading conversation:", error);
      }
    }

    loadConversation();
  }, [user, selectedContact]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      // Subscribe to INSERT events on the messages table
      channel = supabase
        .channel('public:messages')
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `recipient_id=eq.${user.id}` 
          },
          (payload) => {
            const newMessage = payload.new as Message;
            const senderId = newMessage.sender_id;
            
            // Update conversations if this message is part of the active conversation
            if (selectedContact && selectedContact.id === senderId) {
              // Update current conversation
              setConversations(prev => {
                const updatedMessages = [...(prev[senderId] || []), { 
                  ...newMessage, 
                  isOwn: false 
                }];
                return { ...prev, [senderId]: updatedMessages };
              });
              
              // Mark message as read immediately since conversation is open
              supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', newMessage.id)
                .then();
            } else {
              // Update contact's unread count and last message
              setContacts(prev => {
                return prev.map(contact => {
                  if (contact.id === senderId) {
                    return {
                      ...contact,
                      lastMessage: newMessage.content,
                      unread: contact.unread + 1
                    };
                  }
                  return contact;
                });
              });
            }
          }
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, selectedContact]);

  const sendMessage = async (content: string) => {
    if (!user || !selectedContact || !content.trim()) return null;
    
    try {
      const newMessage = {
        sender_id: user.id,
        recipient_id: selectedContact.id,
        content: content.trim(),
        is_read: false
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update the conversation with the new message
      const formattedMessage = {
        ...data,
        isOwn: true
      };
      
      setConversations(prev => {
        const currentMessages = prev[selectedContact.id] || [];
        return {
          ...prev,
          [selectedContact.id]: [...currentMessages, formattedMessage]
        };
      });
      
      // Update this contact's last message
      setContacts(prev => {
        return prev.map(contact => {
          if (contact.id === selectedContact.id) {
            return {
              ...contact,
              lastMessage: content.trim()
            };
          }
          return contact;
        });
      });
      
      return formattedMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  return {
    contacts,
    conversations,
    selectedContact,
    loading,
    sendMessage,
    handleSelectContact
  };
}
