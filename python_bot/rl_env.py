import gymnasium as gym
from gymnasium import spaces
import numpy as np
import pandas as pd

class StockTradingEnv(gym.Env):
    """
    Custom Stock Trading Environment that follows gym interface.
    """
    metadata = {'render_modes': ['human']}

    def __init__(self, df: pd.DataFrame, initial_balance=100000):
        super(StockTradingEnv, self).__init__()

        self.df = df.reset_index(drop=True)
        self.initial_balance = initial_balance
        self.max_steps = len(self.df) - 1

        # Actions of the format Buy x%, Sell x%, Hold, etc.
        # For simplicity: Discrete 3 actions (0: Hold, 1: Buy, 2: Sell)
        self.action_space = spaces.Discrete(3)

        # State space: All indicators from dataframe + balance + shares held + net worth
        # Example features: price, SMA, RSI, MACD, etc.
        # We find the number of numeric columns
        self.feature_cols = [c for c in self.df.columns if pd.api.types.is_numeric_dtype(self.df[c])]
        num_features = len(self.feature_cols) + 3 # + balance, shares held, net worth
        
        # We normalize observation so Box can be -inf to inf
        self.observation_space = spaces.Box(
            low=-np.inf, high=np.inf, shape=(num_features,), dtype=np.float32
        )

        self.reset()

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.current_step = 0
        self.balance = self.initial_balance
        self.shares_held = 0
        self.net_worth = self.initial_balance
        self.max_net_worth = self.initial_balance

        return self._next_observation(), {}

    def _next_observation(self):
        obs = self.df[self.feature_cols].iloc[self.current_step].values
        # Append internal state
        internal_state = np.array([
            self.balance / self.initial_balance,
            self.shares_held,
            self.net_worth / self.initial_balance
        ])
        return np.concatenate((obs, internal_state)).astype(np.float32)

    def step(self, action):
        self._take_action(action)
        self.current_step += 1

        terminated = self.current_step >= self.max_steps
        truncated = self.net_worth <= 0

        reward = self._calculate_reward()

        obs = self._next_observation()

        info = {
            'step': self.current_step,
            'net_worth': self.net_worth,
            'reward': reward
        }

        # Gymnasium v0.26+ returns 5 values: obs, reward, terminated, truncated, info
        return obs, reward, terminated, truncated, info

    def _take_action(self, action):
        current_price = self.df.loc[self.current_step, 'Close']
        
        if action == 1: # Buy
            # Buy as many shares as possible
            shares_bought = self.balance // current_price
            if shares_bought > 0:
                self.balance -= shares_bought * current_price
                self.shares_held += shares_bought
                
        elif action == 2: # Sell
            # Sell all shares
            if self.shares_held > 0:
                self.balance += self.shares_held * current_price
                self.shares_held = 0
        
        # Hold == 0 (do nothing)

        self.net_worth = self.balance + self.shares_held * current_price
        if self.net_worth > self.max_net_worth:
            self.max_net_worth = self.net_worth

    def _calculate_reward(self):
        # Reward is simply the change in net worth (can be improved with Sharpe or log returns)
        # We want to encourage making profit
        # Simple immediate reward approximation:
        return self.net_worth - self.initial_balance

    def render(self, mode='human'):
        profit = self.net_worth - self.initial_balance
        print(f"Step: {self.current_step}")
        print(f"Balance: {self.balance}")
        print(f"Shares held: {self.shares_held}")
        print(f"Net worth: {self.net_worth}")
        print(f"Profit: {profit}")
