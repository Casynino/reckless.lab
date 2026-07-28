import { listConversations } from "@/lib/messages/store";
import { PageTitle } from "@/components/admin/ui";
import { AdminInbox } from "@/components/admin/admin-inbox";

export const dynamic = "force-dynamic";

export default async function AdminMessages() {
  const conversations = await listConversations();
  const unread = conversations.reduce((n, c) => n + c.unreadAdmin, 0);
  return (
    <div>
      <PageTitle
        title="Messages"
        subtitle={`${conversations.length} conversation${conversations.length === 1 ? "" : "s"}${unread ? ` · ${unread} unread` : ""}.`}
      />
      <AdminInbox conversations={conversations} />
    </div>
  );
}
