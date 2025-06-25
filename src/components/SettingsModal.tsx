
import { useState } from "react";
import { Settings, Key, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  apiKeys: Record<string, string>;
  onSaveApiKeys: (keys: Record<string, string>) => void;
}

export function SettingsModal({ apiKeys, onSaveApiKeys }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempKeys, setTempKeys] = useState(apiKeys);
  const { toast } = useToast();

  const handleSave = () => {
    onSaveApiKeys(tempKeys);
    setIsOpen(false);
    toast({
      title: "Configuración guardada",
      description: "Las claves API se han guardado correctamente.",
    });
  };

  const providers = [
    { key: "openai", label: "OpenAI API Key", placeholder: "sk-..." },
    { key: "anthropic", label: "Anthropic API Key", placeholder: "sk-ant-..." },
    { key: "gemini", label: "Google Gemini API Key", placeholder: "AI..." },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Configuración
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configuración de API Keys
          </DialogTitle>
          <DialogDescription>
            Configura tus claves API para conectar con los diferentes proveedores de IA.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.key} className="space-y-2">
              <Label htmlFor={provider.key}>{provider.label}</Label>
              <Input
                id={provider.key}
                type="password"
                placeholder={provider.placeholder}
                value={tempKeys[provider.key] || ""}
                onChange={(e) =>
                  setTempKeys(prev => ({
                    ...prev,
                    [provider.key]: e.target.value
                  }))
                }
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
