'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, MessageSquare } from 'lucide-react';
import { addDoc, collection, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface Message {
  id: string;
  text: string;
  createdAt: Timestamp | null;
  user: {
    uid: string;
    displayName: string;
    photoURL: string;
    level: 'Pro' | 'Intermediate' | 'Rookie';
  };
}

const levelColorMap = {
  Pro: 'text-accent-foreground dark:text-accent',
  Intermediate: 'text-sm',
  Rookie: 'text-muted-foreground',
};

export default function CommunityPage() {
  const { user, loading } = useAuth();
  const db = useFirestore();
  const [newMessage, setNewMessage] = useState('');
  const { data: messages, loading: messagesLoading } = useCollection<Message>('community-chat');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  const sortedMessages = messages ? [...messages].sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0)) : [];


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sortedMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !db) return;

    const messageData = {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: {
        uid: user.id,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || `https://picsum.photos/seed/${user.id}/40/40`,
        level: 'Intermediate', // This can be dynamically set based on user's progress
      },
    };

    setNewMessage('');
    
    const collectionRef = collection(db, 'community-chat');
    addDoc(collectionRef, messageData)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: messageData
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp || !timestamp.seconds) {
      return '';
    }
    return new Date(timestamp.seconds * 1000).toLocaleTimeString();
  };

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto py-8 px-4 md:px-6 flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline">Community Hub</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <p>Loading messages...</p>
              ) : (
                sortedMessages.map((msg) => (
                  <div key={msg.id} className={cn('flex items-start gap-3', msg.user.uid === user?.id ? 'justify-end' : '')}>
                     {msg.user.uid !== user?.id && (
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src={msg.user.photoURL} />
                            <AvatarFallback>{msg.user.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                     )}
                    <div className={cn("rounded-lg p-3 max-w-xs md:max-w-md", msg.user.uid === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <p className={cn("font-bold text-sm", levelColorMap[msg.user.level])}>
                        {msg.user.displayName} ({msg.user.level})
                      </p>
                      <p className="text-sm">{msg.text}</p>
                       <p className="text-xs opacity-70 mt-1">
                        {formatTimestamp(msg.createdAt)}
                      </p>
                    </div>
                     {msg.user.uid === user?.id && (
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src={msg.user.photoURL} />
                            <AvatarFallback>{msg.user.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                     )}
                  </div>
                ))
              )}
               <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Ask a question or share your progress..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={!user}
                />
                <Button type="submit" size="icon" disabled={!user || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}
