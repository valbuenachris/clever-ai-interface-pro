
import { useState } from "react";
import { ChevronDown, Bot, Cpu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const models: AIModel[] = [
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    description: "Más potente y rápido",
    icon: Bot,
    color: "text-green-500"
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI", 
    description: "Rápido y eficiente",
    icon: Zap,
    color: "text-blue-500"
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Razonamiento avanzado",
    icon: Cpu,
    color: "text-purple-500"
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Balance perfecto",
    icon: Bot,
    color: "text-orange-500"
  }
];

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all"
        >
          <div className="flex items-center gap-2">
            <selectedModel.icon className={`h-4 w-4 ${selectedModel.color}`} />
            <span className="font-medium">{selectedModel.name}</span>
            <span className="text-xs text-muted-foreground">({selectedModel.provider})</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white/95 backdrop-blur-sm border-white/20">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelChange(model)}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/50"
          >
            <model.icon className={`h-5 w-5 ${model.color}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {model.provider}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{model.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
