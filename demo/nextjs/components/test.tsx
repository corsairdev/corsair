import { useCorsairMutation } from "@/corsair/client";

export function MyComponent() {
  // Fully typed based on their mutations!
  const lookupMutation = useCorsairMutation(
    "give me the name and email based on this id"
  );

  const summarizeMutation = useCorsairMutation("create album", {});

  const sentimentMutation = useCorsairMutation("create album", {});

  const handleLookup = () => {
    lookupMutation.mutate(
      { id: "123" }, // ✅ TypeScript knows: { id: string }
      {
        onSuccess: (data) => {
          // ✅ TypeScript knows: Array<{ name: string, email_address: string }>
          console.log(data[0].name);
          console.log(data[0].name);
        },
      }
    );
  };

  const handleSummarize = () => {
    summarizeMutation.mutate(
      {
        text: "Long text here...",
        maxLength: 100,
      },
      {
        onSuccess: (data) => {
          // ✅ TypeScript knows: { summary: string, wordCount: number }
          console.log(data.summary);
          console.log(data.wordCount);
        },
      }
    );
  };

  const handleSentiment = () => {
    sentimentMutation.mutate(
      { content: "I love this!" },
      {
        onSuccess: (data) => {
          // ✅ TypeScript knows: { sentiment: 'positive' | 'negative' | 'neutral', confidence: number }
          console.log(data.sentiment);
          console.log(data.confidence);
        },
      }
    );
  };

  return (
    <div>
      <button onClick={handleLookup} disabled={lookupMutation.isPending}>
        Lookup User
      </button>

      <button onClick={handleSummarize} disabled={summarizeMutation.isPending}>
        Summarize Text
      </button>

      <button onClick={handleSentiment} disabled={sentimentMutation.isPending}>
        Analyze Sentiment
      </button>

      {lookupMutation.data && (
        <div>
          {lookupMutation.data.map((user, i) => (
            <div key={i}>{user.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
