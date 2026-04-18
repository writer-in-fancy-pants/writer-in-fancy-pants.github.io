---
id: 06-llm-usage-2026
title: "LLM Model Comparison & Usage Efficiency Guide"
date: "2026-04-18"
topic: "Vibe Research"
excerpt: "Understanding which models to use for which task, and how much they cost."
---

## Table of Contents
1. [Claude Model Comparison](#1-claude-model-comparison)
2. [Major Proprietary Models (Non-Anthropic)](#2-major-proprietary-models-non-anthropic)
3. [Top Open-Weight Models for Self-Hosting](#3-top-open-weight-models-for-self-hosting)
4. [Self-Hosting: Top Models by Size Category](#4-self-hosting-top-models-by-size-category)
5. [Usage Efficiency: Maximizing Output, Minimizing Cost](#5-usage-efficiency-maximizing-output-minimizing-cost)

---

## 1. Claude Model Comparison

### Overview

Anthropic currently offers three production models: **Opus 4.7** (flagship, released April 16 2026), **Sonnet 4.6** (mid-tier, February 2026), and **Haiku 4.5** (budget/fast, October 2025). A restricted research model, **Claude Mythos**, exists above Opus but is invitation-only for cybersecurity workflows.

### Spec Comparison Table

| Attribute | **Claude Opus 4.7** | **Claude Sonnet 4.6** | **Claude Haiku 4.5** |
|---|---|---|---|
| **Release Date** | Apr 16, 2026 | Feb 17, 2026 | Oct 15, 2025 |
| **Context Window** | 1M tokens | 1M tokens | 200K tokens |
| **Max Output** | 128K tokens | 128K tokens (300K on Batch API) | 8,192 tokens |
| **Input Price ($/MTok)** | $5.00 | $3.00 | $1.00 |
| **Output Price ($/MTok)** | $25.00 | $15.00 | $5.00 |
| **Prompt Cache Read** | ~$0.50/MTok (90% off) | ~$0.30/MTok | ~$0.10/MTok |
| **Batch API Discount** | 50% off | 50% off | 50% off |
| **Output Speed** | ~20–30 tok/s | ~40–60 tok/s | ~80–120 tok/s |
| **Time-to-First-Token** | 1–2 sec | 0.5–0.8 sec | < 0.5 sec |
| **SWE-bench Verified** | ~70% (CursorBench) | ~74% | ~73% |
| **Vision / Multimodal** | ✅ High-res (3.75MP, 98.5% accuracy) | ✅ Standard vision | ✅ Basic vision |
| **Extended Thinking** | ✅ (xhigh effort level) | ✅ | ✅ |
| **Computer Use** | ✅ | ✅ | ✅ |
| **Tokenizer** | New (up to 35% more tokens vs 4.6) | Standard | Standard |
| **Knowledge Cutoff** | ~Mar 2026 | ~Mar 2026 | Feb 2025 |

### Performance & Specialization

**Claude Opus 4.7** is Anthropic's most capable generally available model. Key improvements over Opus 4.6 include a 12-point CursorBench gain (70% vs 58%), near-perfect vision accuracy (98.5% vs 54.5%), 3x image resolution (3.75MP), a new `xhigh` effort level, and a `/ultrareview` command in Claude Code for deep bug detection. It introduces **task budgets** to control token spend in agentic loops and **adaptive thinking** (reasoning is hidden by default; opt in with `"display": "summarized"`). It is the only Claude model on the public frontier that can write a C compiler from scratch. The new tokenizer improves capability but may increase token counts by up to 35% for identical inputs — effective cost can be 10–15% higher than sticker price suggests.

**Claude Sonnet 4.6** delivers near-Opus performance at 40% lower cost. It is preferred over Sonnet 4.5 by ~70% of developers and over the previous-generation Opus by ~59% on coding evaluations. Computer use accuracy hit 94%. It is the **default model in Claude Code** and the recommended default for most production use cases. Supports 1M context at standard pricing.

**Claude Haiku 4.5** is the fastest model, reaching 80–120 tokens/second. Despite being the budget tier, it includes extended thinking, computer use, and context awareness — capabilities previously limited to Sonnet/Opus. It performs within ~5 percentage points of Sonnet 4.5 on SWE-bench (73.3% vs 77.2%) at roughly one-third the cost. Limited to a 200K context window and 8K max output. **Not suitable for complex multi-step reasoning or very long outputs.**

### When to Use Each Claude Model

| Use Case | Recommended Model | Rationale |
|---|---|---|
| Autonomous coding agents, CI/CD | Opus 4.7 | Best agentic coding, self-checks logic |
| Complex architecture / full codebase analysis | Opus 4.7 | 1M context + deepest reasoning |
| Vision: UI review, document parsing, diagrams | Opus 4.7 | 3.75MP + 98.5% visual acuity |
| Multi-day project management | Opus 4.7 | Carries context across sessions |
| Production coding assistant (default) | Sonnet 4.6 | Best quality-to-cost ratio |
| RAG / search-augmented responses | Sonnet 4.6 | Strong synthesis + speed |
| Long-form drafting, summarization | Sonnet 4.6 | Coherence + 128K output |
| Real-time chat, customer support | Sonnet 4.6 | Sub-second TTFT |
| High-volume classification / routing | Haiku 4.5 | 80–120 tok/s, cheapest option |
| Simple Q&A, data extraction, form parsing | Haiku 4.5 | Fast + cost-effective |
| Multi-agent sub-tasks (simple delegation) | Haiku 4.5 | Route simple work to reduce cost |

---

## 2. Major Proprietary Models (Non-Anthropic)

### Comparison Table

| Model | Provider | Context Window | Input $/MTok | Output $/MTok | Key Strength | Notable Weakness |
|---|---|---|---|---|---|---|
| **GPT-5.4** | OpenAI | 1M | ~$2.50 | ~$20.00 | Coding, desktop agents, math | Most expensive output |
| **GPT-5.2** | OpenAI | 400K | ~$1.75 | ~$14.00 | Reasoning, near-perfect AIME | Smaller context than rivals |
| **GPT-5 (base)** | OpenAI | ~200K | ~$1.25 | ~$10.00 | Value flagship | Older benchmark scores |
| **Gemini 3.1 Pro** | Google | 2M | ~$2.00 | ~$12.00 | Long context, multimodal, price | Slightly behind on writing |
| **Gemini 3 Flash** | Google | 1M | ~$0.50 | ~$3.00 | Mid-tier efficiency | Less reasoning depth |
| **Gemini 2.5 Pro** | Google | 1M | ~$1.25 | ~$10.00 | Stable, well-priced | Older generation |
| **Grok 3** | xAI | ~256K | ~$0.20 | ~$1.00 | Cheapest frontier-class | Smaller ecosystem |
| **DeepSeek V3.2** (API) | DeepSeek | 160K | ~$0.27–0.35 | ~$1.10 | Extreme cost efficiency | Chinese data sovereignty concerns |

### Narrative Notes

**GPT-5.4** absorbed the Codex line and is the first mainstream model to exceed the human baseline on OSWorld (75%), making it best-in-class for desktop automation. It scores 84/100 on BenchLM overall, effectively tied with Gemini 3.1 Pro (83/100). It is the right choice for: coding, computer use, structured output speed, and math at competition level.

**Gemini 3.1 Pro** offers the largest available context window (2M tokens — double Claude's 1M) and is natively multimodal, handling text, images, audio, and video in a single API call. At roughly half the per-token cost of GPT-5.4, it is the price-performance king for document-heavy and RAG-heavy workloads. It leads on BrowseComp (web agent benchmark) and GPQA Diamond (PhD-level science).

**Grok 3** from xAI offers the lowest pricing of any frontier-class model (~$0.20 input), but has a smaller ecosystem and fewer third-party integrations. Best for cost-sensitive internal tools where quality is still needed.

**DeepSeek V3.2** (API) is the most affordable of all at $0.27–0.35/MTok input, with open weights (MIT license). Scores 73.1% on SWE-bench Verified. For teams comfortable with the geopolitical considerations around a Chinese provider, it is an extraordinary value play.

---

## 3. Top Open-Weight Models for Self-Hosting

Open-weight models now match proprietary models on most benchmarks. The key decision factors are hardware requirements, licensing, and whether the breakeven point on compute costs has been reached (~3–5B tokens/day favors self-hosting).

### Overall Capability Leaders (Large-Scale Deployment)

| Model | Params (Total / Active) | Architecture | BenchLM / SWE-bench | License | VRAM (INT4) |
|---|---|---|---|---|---|
| **GLM-5** | ~355B | Dense | 85 overall / 77.8% SWE | MIT | ~180GB |
| **Qwen 3.5 397B** | 397B / ~17B active | MoE | 81 overall / 76.4% SWE | Apache 2.0 | ~50GB active |
| **Mistral Large 3** | 675B | Dense | ~78 overall | Apache 2.0 | ~340GB |
| **DeepSeek V3.2** | 685B / 37B active | MoE | ~65 overall / 73.1% SWE | MIT | ~46GB active |
| **Llama 4 Maverick** | ~400B | MoE (native multimodal) | ~74 overall | Llama community | ~50GB active |
| **Llama 4 Scout** | ~109B | Dense, **10M context** | ~70 overall | Llama community | ~55GB |

### Specialized Models

| Specialization | Model | Params | SWE-bench / Key Score | License |
|---|---|---|---|---|
| **Coding (large)** | Devstral-2 (Mistral) | 123B | 72.2% SWE | Apache 2.0 |
| **Coding (mid)** | Devstral Small 2 | 24B | 68% SWE | Apache 2.0 |
| **Coding (Alibaba)** | Qwen3-Coder-Next | 80B | Competitive on LiveCodeBench | Apache 2.0 |
| **Reasoning** | DeepSeek R1 | 671B / 37B active | 84 MMLU-Pro / 49.2% SWE | MIT |
| **Multilingual** | Qwen 3.5 | 397B | 201 languages | Apache 2.0 |
| **Multilingual (EU)** | Mistral Large 3 | 675B | 80+ languages | Apache 2.0 |
| **Long Context** | Llama 4 Scout | 109B | **10M token context** | Llama community |

### License Quick Reference

| License | Commercial Use | Modify/Fine-tune | Notes |
|---|---|---|---|
| **Apache 2.0** | ✅ Free | ✅ | Best for enterprise; Qwen 3.5, Mistral, Devstral |
| **MIT** | ✅ Free | ✅ | DeepSeek, GLM-5 |
| **Llama Community** | ✅ (< 700M MAU) | ✅ | MAU cap matters at scale; EU restrictions |
| **CC-BY-NC** | ❌ Non-commercial only | ✅ | Cohere Command R+ default |

---

## 4. Self-Hosting: Top Models by Size Category

Self-hosting economics: running a 400B+ model costs ~$2,000–$5,000/month in cloud GPU compute — only economical above ~50M tokens/month vs. API pricing. Smaller models are viable on consumer or prosumer hardware.

### Tiny (≤ 4B params) — Single Consumer GPU / Edge Devices

| Model | Params | VRAM (FP16) | VRAM (INT4) | Context | License | Best For |
|---|---|---|---|---|---|---|
| **Gemma 3 4B** | 4B | 8 GB | 4.2 GB | 256K | Google Open | Most RAM-efficient; edge/mobile |
| **Phi-4-mini** | 3.8B | 7.6 GB | ~2 GB | 128K | MIT | High reasoning-per-param |
| **Qwen3.5-4B** | 4B | 8 GB | ~2.5 GB | 256K | Apache 2.0 | Multilingual edge |

### Small (7B–14B params) — 1× Consumer GPU (24 GB)

| Model | Params | VRAM (INT4) | Context | License | Best For |
|---|---|---|---|---|---|
| **Qwen2.5 7B** | 7B | ~4.5 GB | 128K | Apache 2.0 | Best overall small model |
| **Gemma 3 12B** | 12B | ~8 GB | 256K | Google Open | Strong coding + reasoning |
| **Phi-4** | 14B | ~9 GB | 16K | MIT | Best reasoning per GB |
| **DeepSeek-R1-Distill-Qwen-14B** | 14B | ~9 GB | 64K | MIT | Reasoning distilled from R1 |

### Medium (24B–35B params) — 1× Pro GPU or Mac with 32+ GB RAM

| Model | Params | VRAM (INT4) | Context | License | Best For |
|---|---|---|---|---|---|
| **Qwen2.5-Coder 32B** | 32B | ~20 GB | 128K | Apache 2.0 | **Best mid-range coding model** |
| **Devstral Small 2** | 24B | ~15 GB | 256K | Apache 2.0 | Coding agents, 68% SWE-bench |
| **Mistral Small 3.1** | 24B | ~15 GB | 256K | Apache 2.0 | Best quality-per-resource ratio |
| **Gemma 4 31B** | 31B | ~20 GB | 256K | Google Open | 80 LiveCodeBench; laptop-viable |
| **DeepSeek-R1-Distill-Qwen-32B** | 32B | ~20 GB | 64K | MIT | Reasoning tasks on one GPU |

> **Note on VRAM estimates:** FP16 uses ~2 bytes/param; INT4 uses ~0.5 bytes/param. Add 10–20% overhead for KV cache and framework. Ollama defaults to 4-bit quantization.

### Large (70B–125B params) — Multi-GPU or Cloud Instance

| Model | Params | VRAM (INT4) | Context | License | Best For |
|---|---|---|---|---|---|
| **Llama 3.3 70B** | 70B | ~35 GB | 128K | Llama community | Best community support & tooling |
| **DeepSeek-R1-Distill-Llama-70B** | 70B | ~35 GB | 64K | MIT | Strong reasoning via distillation |
| **Qwen3-235B-A22B** | 235B / 22B active | ~14 GB active | 256K | Apache 2.0 | Runs on 2× A100 effectively |
| **GPT-oss 120B** | 117B | ~60 GB | ~200K | Apache 2.0 | OpenAI open-weight release |
| **Llama 4 Scout** | 109B | ~55 GB | **10M** | Llama community | Unmatched long context |

### Frontier Scale (400B+ params) — Cluster Required

| Model | Params (Total / Active) | Architecture | Best For |
|---|---|---|---|
| **Qwen 3.5 397B** | 397B / ~17B active | MoE | **Top-tier open benchmark scores; runs more cheaply than param count suggests** |
| **GLM-5** | ~355B | Dense | **Leads open-weight leaderboard at 85/100 overall** |
| **DeepSeek V3.2** | 685B / 37B active | MoE | Best cost-efficient API alternative; MIT license |
| **Mistral Large 3** | 675B | Dense | European data sovereignty needs |

---

## 5. Usage Efficiency: Maximizing Output, Minimizing Cost

These strategies apply across all models but are most impactful with paid APIs like Claude, GPT, and Gemini.

---

### Recommendation 1: Use Prompt Caching Aggressively

**What:** Cache static portions of your prompt (system prompt, tool definitions, RAG documents) so repeat calls pay only ~10% of the standard input rate.

**Why it matters:** Anthropic cache reads cost ~$0.50/MTok for Opus vs. $5.00/MTok standard — a 90% discount. For applications with a stable 2K-token system prompt, this alone can reduce input costs by 30–60%.

**How:**
- Place static content (system prompt, tool schemas, reference docs) **at the top** of the context — before dynamic user input.
- Use Anthropic's automatic caching with a single top-level `cache_control` field; it manages breakpoints as the conversation grows.
- For fine-grained control, use explicit `cache_control` on individual content blocks.

**Example (Anthropic API):**
```json
{
  "system": [
    {
      "type": "text",
      "text": "You are a senior software engineer at Acme Corp... [2000 tokens of static context]",
      "cache_control": {"type": "ephemeral"}
    }
  ],
  "messages": [{"role": "user", "content": "Review this PR diff: ..."}]
}
```

---

### Recommendation 2: Route Tasks to the Cheapest Capable Model

**What:** Classify tasks by complexity and automatically route them to Haiku, Sonnet, or Opus.

**Why it matters:** Haiku 4.5 is 5× cheaper than Opus on output tokens. Sending simple tasks (e.g., data extraction, classification) to Haiku instead of Opus can save $7,200/year at 100M tokens/month.

**How:**
- Use a small, fast model (Haiku or even a local 7B model) as a **routing layer** that classifies query complexity (simple / medium / complex).
- Route to Haiku for: classification, short Q&A, form parsing, summarization of well-defined data.
- Route to Sonnet for: general coding, RAG responses, long-form drafting, real-time chat.
- Reserve Opus for: multi-file refactors, agentic pipelines, vision-heavy work, research synthesis.

**Example routing logic:**
```python
complexity = classify_query(user_input)  # cheap Haiku call
model = {
  "simple": "claude-haiku-4-5-20251001",
  "medium": "claude-sonnet-4-6",
  "complex": "claude-opus-4-7"
}[complexity]
response = call_claude(model, user_input)
```

---

### Recommendation 3: Compress Context Before Sending

**What:** Never dump raw documents, logs, or entire conversation histories into the prompt. Preprocess them first.

**Why it matters:** In agent workflows, an agent taking 10 reasoning steps can process 50K–100K tokens per task. Tools like LLMLingua can compress prompts by up to 20× while preserving answer quality.

**Techniques:**
- **Summarize retrieved RAG chunks** before sending to the main model. A 10,000-token document can often be compressed to 500 relevant tokens.
- **Truncate conversation history** by keeping only the last N turns plus a rolling summary of earlier turns.
- **Use Anthropic's Compaction API** (beta, Feb 2026): automatically summarizes and compresses conversation history for Opus 4.6, enabling effectively infinite conversations without manual trimming.
- **Filter RAG results**: pass 2–3 tightly relevant chunks instead of 4–8 loose ones. Irrelevant context degrades output quality *and* inflates cost.

**Example (compressing a support ticket pipeline):**
```
Instead of: [system_prompt=500 tok] + [conversation_history=3000 tok] + [5 docs=5000 tok]
Use:        [system_prompt=500 tok] + [history_summary=300 tok] + [1 relevant doc excerpt=800 tok]
Total: 8500 tokens → 1600 tokens (81% reduction)
```

---

### Recommendation 4: Write Tight, Direct Prompts

**What:** Eliminate pleasantries, redundant context, and vague phrasing from prompts.

**Why it matters:** "Could you please provide me with a comprehensive overview of my scheduled appointments for today?" costs ~18 tokens. "List today's appointments." costs ~5 tokens — same result, 72% fewer input tokens.

**Principles:**
- Be declarative, not conversational. Skip "please", "could you", "I'd love it if you".
- Specify format upfront: `"Return JSON with keys: title, date, priority"` saves tokens on both input instruction and output generation.
- Use persona priming to implicitly guide output length: `"You are a concise technical writer."` reduces verbose responses without explicit length instructions.
- Avoid restating context the model already has. If a document is already in the prompt, don't say "Based on the document I just provided, which you should have read above...".

**Example:**
```
# Before (28 tokens):
"Could you please analyze the provided text and give me a fairly detailed summary? 
I would appreciate if it's not too long."

# After (6 tokens):
"Summarize in 3 bullet points."
```

---

### Recommendation 5: Use Batch Processing for Non-Real-Time Workloads

**What:** Use the Message Batches API (Anthropic) or equivalent for asynchronous bulk requests — 50% off all pricing.

**Why it matters:** Any pipeline that doesn't need real-time responses (nightly reports, classification jobs, document processing, eval runs) can halve its API costs instantly. Opus 4.7 at batch rates ($2.50 input / $12.50 output) is cheaper than Sonnet 4.6 at standard rates ($3.00 / $15.00).

**When to use:**
- Nightly data processing or summarization pipelines.
- Bulk document classification or extraction.
- Running evals against a large dataset.
- Generating embeddings or structured metadata at scale.

**Latency trade-off:** Batch requests complete within minutes to hours — not suitable for user-facing flows.

---

### Recommendation 6: Separate Specification from Implementation Sessions

**What:** Use one conversation to spec/plan and a fresh conversation to implement.

**Why it matters:** Conversation history grows with every turn. A spec session that generates 5,000 tokens of discussion doesn't need to be re-read when you're doing implementation — resetting context removes this overhead for free.

**How:**
- When moving from design to implementation, start a new session with a clean, distilled spec (not the full conversation).
- In Claude Code, use `/compact` or `/new` to reset between major phases.
- The token optimization guide notes this is "free to implement and immediately reduces token usage on every subsequent turn."

---

### Recommendation 7: Request Structured Output Formats

**What:** Ask for JSON, bullet lists, or tables instead of prose when the downstream task requires parsing.

**Why it matters:** A JSON object with 5 fields is more token-efficient than a prose paragraph explaining the same information. Structured output is also easier to parse and less likely to require a follow-up clarification call.

**Examples:**
```
# Instead of:
"Explain the pros and cons of each approach"
→ 400 tokens of prose

# Use:
"List pros and cons of each approach as JSON: {'approach': str, 'pros': [str], 'cons': [str]}"
→ 150 tokens of structured data
```

For reasoning tasks, use **Chain of Draft (CoD)** instead of Chain of Thought (CoT). CoD matches CoT accuracy while using as little as **7.6% of the reasoning tokens**.

---

### Recommendation 8: Implement Semantic Caching at the Application Layer

**What:** Cache LLM responses at the application level so similar (not just identical) queries hit the cache instead of the API.

**Why it matters:** Semantic caching can cut API costs by up to **73%** in high-repetition workloads (e.g., customer support bots where many users ask the same question in different words).

**How it works:**
1. Embed each incoming query as a vector.
2. Check if any cached query has cosine similarity above a threshold (e.g., 0.92).
3. If yes, return the cached response. If no, call the LLM and cache the result.

**Tools:** Redis (built-in vector search), Langchain semantic cache, GPTCache.

---

### Recommendation 9: Monitor Where Tokens Actually Go

**What:** Before optimizing, measure. Most teams optimize prompt length when the real driver is context bloat.

**Key insight:** Research shows that **review and rework loops consume ~59% of tokens on average** — not initial generation. Context growth (stale conversation history, over-broad RAG retrieval) is usually the main cost driver, not prompt length.

**Tools:**
- **Claude Code**: `/cost`, `/context`, `/mcp` commands show real-time token usage.
- **Anthropic API**: Token Count API (pre-flight) and Usage & Cost API (post-hoc breakdowns by model, cache tier, context tier).
- **Third-party**: Portkey, Braintrust, LangSmith all provide prompt versioning + token analytics.

---

### Recommendation 10: Self-Host for High-Volume Workloads

**What:** Run open-weight models on your own infrastructure when token volume crosses the breakeven point.

**When it makes sense:** ~3–5B tokens/day is the typical breakeven where self-hosting becomes cheaper than API pricing. Below this, APIs win on convenience and reliability.

**Cost comparison example (daily at 250M tokens input + output):**
- DeepSeek V3.2 API: ~$1,250/day
- Self-hosting 8× H100 cluster: ~$35,700/day
- → API wins at this volume; self-hosting wins above ~3B tokens/day

**Hybrid strategy:** Use cloud APIs for customer-facing, latency-sensitive paths. Use self-hosted Qwen or Mistral for internal batch processing where latency tolerance exists.

---

### Efficiency Summary Table

| Strategy | Typical Savings | Complexity | Best For |
|---|---|---|---|
| Prompt caching | Up to 90% input cost | Low | Any app with static system prompts |
| Model routing | 40–80% overall cost | Medium | Apps with mixed task complexity |
| Context compression | 50–80% input tokens | Medium | RAG pipelines, long agent loops |
| Tight prompts | 20–40% input tokens | Low | All use cases |
| Batch API | 50% across the board | Low | Non-real-time pipelines |
| Separate spec/impl sessions | 20–40% per project | Low | Development workflows |
| Structured output | 20–50% output tokens | Low | Data extraction, classification |
| Semantic caching | Up to 73% API calls | High | High-volume, repetitive queries |
| Token monitoring | Reveals hidden waste | Low | All production systems |
| Self-hosting | Variable (breakeven at scale) | High | > 3–5B tokens/day |

---

*Prices as of April 2026. Always verify at [anthropic.com/pricing](https://www.anthropic.com/pricing), [platform.openai.com](https://platform.openai.com), and [ai.google.dev](https://ai.google.dev) before making cost projections. Open-weight model rankings change frequently; check [BenchLM.ai](https://benchlm.ai) and [Hugging Face Leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard) for current standings.*
