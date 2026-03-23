import os
from stable_baselines3 import DQN, PPO
from .rl_env import StockTradingEnv
import pandas as pd

class RLAgent:
    def __init__(self, model_type="DQN", model_path="models/dqn_trading.zip"):
        self.model_type = model_type
        self.model_path = model_path
        self.model = None

    def train(self, df: pd.DataFrame, timesteps=10000):
        env = StockTradingEnv(df)
        
        if self.model_type == "DQN":
            self.model = DQN("MlpPolicy", env, verbose=1)
        elif self.model_type == "PPO":
            self.model = PPO("MlpPolicy", env, verbose=1)
            
        print(f"Training {self.model_type} agent for {timesteps} timesteps...")
        self.model.learn(total_timesteps=timesteps)
        
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        self.model.save(self.model_path)
        print("Model saved to", self.model_path)

    def load(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model not found at {self.model_path}")

        if self.model_type == "DQN":
            self.model = DQN.load(self.model_path)
        elif self.model_type == "PPO":
            self.model = PPO.load(self.model_path)

    def predict_action(self, obs):
        if self.model is None:
            raise ValueError("Model not loaded/trained")
        
        action, _states = self.model.predict(obs, deterministic=True)
        return action
