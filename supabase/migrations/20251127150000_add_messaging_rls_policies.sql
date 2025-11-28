
-- Enable RLS for conversations and messages
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for conversations
CREATE POLICY "Enable read access for participants"
ON "public"."conversations"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (
  (
    (participant_1 = auth.uid()) OR
    (participant_2 = auth.uid())
  )
);

CREATE POLICY "Enable insert for participants"
ON "public"."conversations"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (
  (
    (participant_1 = auth.uid()) OR
    (participant_2 = auth.uid())
  )
);

-- Policies for messages
CREATE POLICY "Enable read access for conversation participants"
ON "public"."messages"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (
  (
    conversation_id IN (
      SELECT id
      FROM conversations
      WHERE (
        (conversations.participant_1 = auth.uid()) OR
        (conversations.participant_2 = auth.uid())
      )
    )
  )
);

CREATE POLICY "Enable insert for conversation participants"
ON "public"."messages"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (
  (
    (sender_id = auth.uid()) AND
    (
      conversation_id IN (
        SELECT id
        FROM conversations
        WHERE (
          (conversations.participant_1 = auth.uid()) OR
          (conversations.participant_2 = auth.uid())
        )
      )
    )
  )
);
