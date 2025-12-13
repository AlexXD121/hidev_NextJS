import asyncio
import websockets

async def test_ws():
    uri = "ws://localhost:8000/api/ws/debug_client"
    print(f"Attempting connection to {uri}...")
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected successfully!")
            await websocket.send("Hello")
            print("Message sent")
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_ws())
