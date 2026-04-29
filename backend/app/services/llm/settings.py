from __future__ import annotations

from dataclasses import dataclass
import os

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class LLMSettings:
    enabled: bool
    api_key: str | None
    base_url: str
    model: str
    timeout_seconds: float


def get_llm_settings() -> LLMSettings:
    return LLMSettings(
        enabled=_truthy(os.getenv("ENABLE_LLM_STRATEGY", "false")),
        api_key=os.getenv("OPENAI_API_KEY"),
        base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/"),
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        timeout_seconds=float(os.getenv("OPENAI_TIMEOUT_SECONDS", "30")),
    )


def _truthy(value: str) -> bool:
    return value.strip().lower() in {"1", "true", "yes", "on"}
