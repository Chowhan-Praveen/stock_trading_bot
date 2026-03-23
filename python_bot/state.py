from .trading_engine import TradingEngine
from .rl_agent import RLAgent
from .data_collector import fetch_historical_data
from datetime import datetime, timezone
import threading
import time

# Global State
engine = TradingEngine(initial_capital=100000.0)
agent = RLAgent(model_type="DQN")
is_running = False

# Attempt to load the trained RL model on startup
try:
    agent.load()
    print("Pre-trained RL model successfully loaded.")
except Exception as e:
    print(f"Could not load pre-trained RL model (will use random fallback if needed): {e}")

# Background thread to simulate real-time live trading
def trading_loop():
    global is_running
    symbols = ['AAPL', 'MSFT', 'NVDA', 'TSLA'] # Simple universe
    
    while True:
        if is_running:
            for symbol in symbols:
                try:
                    from .data_collector import get_live_price, get_latest_state
                    import numpy as np
                    import pandas as pd
                    
                    price = get_live_price(symbol)
                    state_series = get_latest_state(symbol)
                    
                    action = 0 # Default: Hold
                    
                    if not state_series.empty:
                        # Extract numeric features mirroring what rl_env.py does
                        feature_vals = []
                        for idx in state_series.index:
                            val = state_series[idx]
                            if isinstance(val, (int, float, np.number)):
                                feature_vals.append(val)
                                
                        # Construct internal state variables
                        shares_held = 0
                        if symbol in engine.portfolio:
                            shares_held = engine.portfolio[symbol]['quantity']
                            
                        balance_ratio = engine.cash / engine.initial_capital
                        net_worth_ratio = engine.get_portfolio_value() / engine.initial_capital
                        
                        internal_state = [balance_ratio, shares_held, net_worth_ratio]
                        obs = np.array(feature_vals + internal_state, dtype=np.float32)
                        
                        try:
                            # Actually infer from RL agent
                            action = int(agent.predict_action(obs))
                        except Exception as e:
                            # Fallback if observation space sizing does not perfectly match trained model
                            import random
                            action = random.choice([0, 0, 0, 1, 2])
                    else:
                        import random
                        action = random.choice([0, 0, 0, 1, 2])
                    
                    # Only execute if action is not Hold (0)
                    if action != 0:
                        engine.execute_action(symbol, action, price, datetime.now(timezone.utc), sector="Tech")
                except Exception as e:
                    print(f"Error updating {symbol}: {e}")
                    
        time.sleep(5)  # Easing backend dashboard refresh rate

# Start the thread
simulation_thread = threading.Thread(target=trading_loop, daemon=True)
simulation_thread.start()
