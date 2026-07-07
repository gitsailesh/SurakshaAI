import pytest
from app.services.reasoning_engine import StrategicReasoningEngine

@pytest.mark.asyncio
async def test_redistribution_logic():
    engine = StrategicReasoningEngine()
    
    # Mock Data: One PHC has 0 insulin, another has 500
    mock_data = {
        "phcs": [
            {"id": "uuid-1", "name": "PHC High", "insulin_stock": 500, "lat": 18.1, "lng": 73.1},
            {"id": "uuid-2", "name": "PHC Low", "insulin_stock": 0, "lat": 18.2, "lng": 73.2}
        ]
    }
    
    result = await engine.generate_redistribution_plan(mock_data)
    
    # Assertions for functional correctness
    assert len(result['redistributions']) > 0
    assert result['redistributions'][0]['item_name'] == "Insulin"
    assert "reasoning" in result['redistributions'][0]
    print("✅ Functional Test Passed: AI successfully identified redistribution need.")