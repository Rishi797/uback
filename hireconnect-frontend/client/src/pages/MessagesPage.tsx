import { useAuthContext } from "@/contexts/AuthContext";
import { useLocation, useRoute } from "wouter";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function MessagesPage() {
  const { user, loading, isApplicant, isAdmin } = useAuthContext();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/*/messages/:applicationId");
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const applicationId = params?.applicationId
    ? parseInt(params.applicationId)
    : null;

  const { data: messages, isLoading, refetch } =
    trpc.messages.getByApplication.useQuery(
      { applicationId: applicationId! },
      { enabled: !!applicationId }
    );

  const sendMessageMutation = trpc.messages.send.useMutation({
    onSuccess: () => {
      setMessageText("");
      refetch();
      scrollToBottom();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!loading && !isApplicant && !isAdmin) {
      setLocation("/");
    }
  }, [loading, isApplicant, isAdmin, setLocation]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (!applicationId) {
      toast.error("Application ID is missing");
      return;
    }

    sendMessageMutation.mutate({
      applicationId,
      recipientId: 1,
      content: messageText,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation(isApplicant ? "/applicant/applications" : "/admin/applications")}
              className="p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">
                Application ID: {applicationId}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col">
        <Card className="flex-1 flex flex-col p-6">
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            {!messages || messages.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === user.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderId === user.id
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === user.id
                          ? "text-indigo-200"
                          : "text-gray-600"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={sendMessageMutation.isPending}
              className="flex items-center gap-2"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
