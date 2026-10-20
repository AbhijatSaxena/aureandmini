import { generateText } from "ai";

async function main() {
  const { text } = await generateText({
    model: "moonshotai/kimi-k3",
    prompt: "Invent a new holiday and describe its traditions.",
  });
  console.log(text);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
