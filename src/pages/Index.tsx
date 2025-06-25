
import { useState, useEffect } from "react";
import { ChatMessage, Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ModelSelector, AIModel } from "@/components/ModelSelector";
import { SettingsModal } from "@/components/SettingsModal";
import { ConversationSidebar, Conversation } from "@/components/ConversationSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>({
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    description: "Más potente y rápido",
    icon: Bot,
    color: "text-green-500"
  });
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Cargar datos del localStorage
  useEffect(() => {
    const savedApiKeys = localStorage.getItem("ai-chat-api-keys");
    if (savedApiKeys) {
      setApiKeys(JSON.parse(savedApiKeys));
    }
    
    const savedConversations = localStorage.getItem("ai-chat-conversations");
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp)
      })));
    }
  }, []);

  // Guardar API keys
  const handleSaveApiKeys = (keys: Record<string, string>) => {
    setApiKeys(keys);
    localStorage.setItem("ai-chat-api-keys", JSON.stringify(keys));
  };

  // Verificar si hay API key disponible
  const hasValidApiKey = () => {
    const provider = selectedModel.provider.toLowerCase();
    return apiKeys[provider] && apiKeys[provider].trim() !== "";
  };

  // Simular llamada a la API
  const callAI = async (message: string): Promise<string> => {
    // Simulación de llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?",
      "Entiendo tu pregunta. Déjame pensar en la mejor respuesta para ti.",
      "Esa es una excelente pregunta. Basándome en mi conocimiento, puedo decirte que...",
      "Gracias por compartir eso conmigo. Mi sugerencia sería...",
      "Interesante punto de vista. Desde mi perspectiva como IA..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + "\n\nEsta es una respuesta simulada ya que estamos en modo de demostración. Para usar modelos reales, configura tu API key en la configuración.";
  };

  // Enviar mensaje
  const handleSendMessage = async (content: string) => {
    if (!hasValidApiKey()) {
      toast({
        title: "API Key requerida",
        description: "Por favor configura tu API key en la configuración.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await callAI(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Actualizar o crear conversación
      if (activeConversationId) {
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, lastMessage: content, timestamp: new Date() }
            : conv
        ));
      } else {
        const newConv: Conversation = {
          id: Date.now().toString(),
          title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          lastMessage: content,
          timestamp: new Date()
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu mensaje.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Nueva conversación
  const handleNewConversation = () => {
    setMessages([]);
    setActiveConversationId(null);
  };

  // Seleccionar conversación
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    // En una implementación real, cargaríamos los mensajes de esta conversación
    setMessages([]);
  };

  // Eliminar conversación
  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setMessages([]);
    }
  };

  // Guardar conversaciones
  useEffect(() => {
    localStorage.setItem("ai-chat-conversations", JSON.stringify(conversations));
  }, [conversations]);

  return (
    <div className="h-screen flex bg-gradient-to-br from-blue-50 to-purple-50">
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 gradient-text" />
                <h1 className="text-xl font-bold gradient-text">AI Chat Assistant</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-64">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
              </div>
              <SettingsModal
                apiKeys={apiKeys}
                onSaveApiKeys={handleSaveApiKeys}
              />
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-8">
                <Bot className="h-16 w-16 gradient-text mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 gradient-text">
                  ¡Bienvenido a AI Chat!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Selecciona un modelo de IA y comienza a chatear. 
                  No olvides configurar tu API key en la configuración.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                  <p className="text-yellow-800">
                    💡 <strong>Consejo:</strong> Esta es una demostración. 
                    Configura tus API keys reales para conectar con los modelos de IA.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <div className="max-w-4xl mx-auto">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex gap-4 p-6 bg-gray-50/50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">Asistente</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full typing-indicator"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full typing-indicator" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full typing-indicator" style={{animationDelay: '0.4s'}}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">Escribiendo...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={!hasValidApiKey()}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
