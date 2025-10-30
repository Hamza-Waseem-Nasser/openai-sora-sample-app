"use client";

import { useEffect, useState } from "react";
import { User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserManagerProps {
  onUserChange: (userId: string | null) => void;
}

export default function UserManager({ onUserChange }: UserManagerProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Load user ID from localStorage on mount
    const stored = localStorage.getItem("aries-user-id");
    if (stored) {
      setUserId(stored);
      onUserChange(stored);
    } else {
      setIsEditing(true);
    }
  }, [onUserChange]);

  const handleLogin = () => {
    if (inputValue.trim()) {
      const trimmedId = inputValue.trim();
      localStorage.setItem("aries-user-id", trimmedId);
      setUserId(trimmedId);
      onUserChange(trimmedId);
      setIsEditing(false);
      setInputValue("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("aries-user-id");
    setUserId(null);
    onUserChange(null);
    setIsEditing(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  if (!isEditing && userId) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 shadow-sm">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600">
          <User className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] text-muted-foreground leading-none">Worker ID</p>
          <p className="text-sm font-semibold text-foreground leading-tight">{userId}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          aria-label="Logout"
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 shadow-sm">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
        <User className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder="Enter Worker ID"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        className="h-7 w-32 border-0 bg-transparent px-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogin}
        disabled={!inputValue.trim()}
        className="h-7 w-7 rounded-full text-muted-foreground hover:text-primary disabled:opacity-50"
        aria-label="Login"
      >
        <LogIn className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
