"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import type { Message } from "@/lib/messages/types";
import { sendCustomerMessageAction, sendAdminMessageAction } from "@/lib/messages/actions";
import { cn } from "@/lib/utils";

/**
 * Chat thread with live polling (router.refresh every 4s re-pulls the dynamic
 * server page). `mode` decides which side "you" are and which action to call.
 */
export function ChatThread({
  mode,
  convId,
  messages,
  emptyHint,
}: {
  mode: "customer" | "admin";
  convId?: string;
  messages: Message[];
  emptyHint?: string;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Live-ish updates.
  useEffect(() => {
    const t = setInterval(() => router.refresh(), 4000);
    return () => clearInterval(t);
  }, [router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setText("");
    start(async () => {
      if (mode === "customer") await sendCustomerMessageAction(body);
      else if (convId) await sendAdminMessageAction(convId, body);
      router.refresh();
    });
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-fog">{emptyHint ?? "No messages yet. Say hello 👋"}</p>
        )}
        {messages.map((m) => {
          const mine = m.from === mode;
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[75%]", mine ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "px-3.5 py-2.5 text-sm",
                    mine
                      ? "rounded-2xl rounded-br-sm bg-acid text-white"
                      : "rounded-2xl rounded-bl-sm border border-smoke bg-carbon text-bone",
                  )}
                >
                  {m.body}
                </div>
                <p className={cn("mt-1 text-[0.55rem] uppercase tracking-[0.15em] text-ash", mine ? "text-right" : "text-left")}>
                  {mine ? "You" : m.from === "admin" ? "Reckless" : "Customer"} ·{" "}
                  {new Date(m.at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-smoke p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-full border border-smoke bg-ink px-4 py-2.5 text-sm text-bone placeholder:text-ash focus:border-bone focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || !text.trim()}
          aria-label="Send"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-acid text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
