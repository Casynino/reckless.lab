"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import type { Conversation } from "@/lib/messages/types";
import { markReadAction } from "@/lib/messages/actions";
import { ChatThread } from "@/components/chat/chat-thread";
import { cn } from "@/lib/utils";

export function AdminInbox({ conversations }: { conversations: Conversation[] }) {
  const router = useRouter();
  const [selId, setSelId] = useState<string | null>(conversations[0]?.id ?? null);

  // Keep the inbox list fresh.
  useEffect(() => {
    const t = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(t);
  }, [router]);

  const selected = conversations.find((c) => c.id === selId) ?? conversations[0];

  function select(id: string) {
    setSelId(id);
    void markReadAction(id, "admin");
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 rounded-2xl border border-smoke bg-ink-soft text-center">
        <MessageSquare className="h-8 w-8 text-ash" />
        <p className="text-mono text-xs uppercase tracking-[0.15em] text-ash">No conversations yet</p>
        <p className="max-w-xs text-sm text-fog">When a customer messages support, their thread appears here.</p>
      </div>
    );
  }

  return (
    <div className="grid h-[68vh] grid-cols-1 overflow-hidden rounded-2xl border border-smoke bg-ink-soft md:grid-cols-[300px_1fr]">
      {/* Conversation list */}
      <div className="hidden flex-col overflow-y-auto border-r border-smoke md:flex">
        {conversations.map((c) => {
          const last = c.messages[c.messages.length - 1];
          const active = c.id === selected?.id;
          return (
            <button
              key={c.id}
              onClick={() => select(c.id)}
              className={cn(
                "flex items-start gap-3 border-b border-smoke/60 p-4 text-left transition-colors",
                active ? "bg-carbon" : "hover:bg-carbon/50",
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-acid/15 font-display text-sm text-acid">
                {c.customerName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm text-bone">{c.customerName}</p>
                  {c.unreadAdmin > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-acid px-1 text-[0.55rem] font-bold text-white">
                      {c.unreadAdmin}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-fog">{last ? `${last.from === "admin" ? "You: " : ""}${last.body}` : "No messages yet"}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Thread */}
      <div className="flex min-h-0 flex-col">
        {selected && (
          <>
            <div className="flex items-center justify-between border-b border-smoke px-4 py-3">
              <div>
                <p className="text-sm text-bone">{selected.customerName}</p>
                <p className="text-[0.7rem] uppercase tracking-[0.15em] text-ash">{selected.customerEmail}</p>
              </div>
              {/* Mobile selector */}
              <select
                value={selected.id}
                onChange={(e) => select(e.target.value)}
                className="border border-smoke bg-ink px-2 py-1 text-xs text-bone md:hidden"
              >
                {conversations.map((c) => (
                  <option key={c.id} value={c.id} className="bg-ink">
                    {c.customerName}
                  </option>
                ))}
              </select>
            </div>
            <ChatThread mode="admin" convId={selected.id} messages={selected.messages} emptyHint="No messages yet — start the conversation." />
          </>
        )}
      </div>
    </div>
  );
}
