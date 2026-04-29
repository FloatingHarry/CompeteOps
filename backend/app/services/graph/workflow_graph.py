from __future__ import annotations

from typing import Any

from langgraph.graph import END, START, StateGraph

from .nodes import (
    competitive_analyst_node,
    debate_agent_node,
    discovery_agent_node,
    report_agent_node,
    strategy_agent_node,
)
from .state import ResearchGraphState


def build_research_graph():
    builder = StateGraph(ResearchGraphState)

    builder.add_node("discovery_agent", discovery_agent_node)
    builder.add_node("competitive_analyst", competitive_analyst_node)
    builder.add_node("debate_agent", debate_agent_node)
    builder.add_node("strategy_agent", strategy_agent_node)
    builder.add_node("report_agent", report_agent_node)

    builder.add_edge(START, "discovery_agent")
    builder.add_edge("discovery_agent", "competitive_analyst")
    builder.add_edge("competitive_analyst", "debate_agent")
    builder.add_edge("debate_agent", "strategy_agent")
    builder.add_edge("strategy_agent", "report_agent")
    builder.add_edge("report_agent", END)

    return builder.compile()


def run_research_graph(initial_state: ResearchGraphState) -> dict[str, Any]:
    graph = build_research_graph()
    return graph.invoke(initial_state)
