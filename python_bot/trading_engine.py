from datetime import datetime
import pandas as pd
from typing import Dict, List, Any

class TradingEngine:
    def __init__(self, initial_capital: float = 100000.0, commission_pct: float = 0.001, slippage_pct: float = 0.0005):
        self.initial_capital = initial_capital
        self.cash = initial_capital
        self.commission_pct = commission_pct
        self.slippage_pct = slippage_pct
        
        # Portfolio structure: symbol -> {quantity, avg_price, current_price, sector}
        self.portfolio: Dict[str, Dict[str, Any]] = {}
        
        self.history = []
        self.trades = []
        
        self.risk_settings = {
            "stopLossPct": 5.0,
            "maxPositionSizePct": 20.0
        }

    def execute_action(self, symbol: str, action: int, current_price: float, timestamp: datetime, sector: str = "Unknown"):
        """
        Executes action (0: Hold, 1: Buy, 2: Sell) with risk constraints.
        """
        if action == 1:
            self._buy(symbol, current_price, timestamp, sector)
        elif action == 2:
            self._sell(symbol, current_price, timestamp)
            
        # Update current price of the asset
        if symbol in self.portfolio:
            self.portfolio[symbol]['current_price'] = current_price
            
        self._check_stop_loss(timestamp)
        self._record_history(timestamp)

    def _buy(self, symbol: str, price: float, timestamp: datetime, sector: str):
        # Apply slippage (buy higher)
        actual_price = price * (1 + self.slippage_pct)
        
        # Calculate max we can spend on one stock (20% of initial capital roughly)
        max_investment = self.initial_capital * (self.risk_settings['maxPositionSizePct'] / 100.0)
        
        current_investment = 0
        if symbol in self.portfolio:
            current_investment = self.portfolio[symbol]['quantity'] * actual_price
            
        available_to_invest = min(self.cash, max_investment - current_investment)
        
        cost_per_share = actual_price * (1 + self.commission_pct)
        if available_to_invest > cost_per_share:
            qty = int(available_to_invest // cost_per_share)
            cost = qty * actual_price
            commission = cost * self.commission_pct
            
            self.cash -= (cost + commission)
            
            if symbol not in self.portfolio:
                self.portfolio[symbol] = {
                    'quantity': qty,
                    'avg_price': actual_price,
                    'current_price': actual_price,
                    'sector': sector
                }
            else:
                old_qty = self.portfolio[symbol]['quantity']
                old_cost = old_qty * self.portfolio[symbol]['avg_price']
                
                new_qty = old_qty + qty
                new_avg = (old_cost + cost) / new_qty
                
                self.portfolio[symbol]['quantity'] = new_qty
                self.portfolio[symbol]['avg_price'] = new_avg
                
            self.trades.append({
                "symbol": symbol,
                "type": "BUY",
                "price": actual_price,
                "quantity": qty,
                "commission": commission,
                "timestamp": timestamp.isoformat()
            })

    def _sell(self, symbol: str, price: float, timestamp: datetime):
        if symbol in self.portfolio and self.portfolio[symbol]['quantity'] > 0:
            qty = self.portfolio[symbol]['quantity']
            # Apply slippage (sell lower)
            actual_price = price * (1 - self.slippage_pct)
            revenue = qty * actual_price
            commission = revenue * self.commission_pct
            net_revenue = revenue - commission
            
            self.cash += net_revenue
            
            del self.portfolio[symbol]
            
            self.trades.append({
                "symbol": symbol,
                "type": "SELL",
                "price": actual_price,
                "quantity": qty,
                "commission": commission,
                "timestamp": timestamp.isoformat()
            })

    def _check_stop_loss(self, timestamp: datetime):
        """
        Sells automatically if position drops below stop loss %
        """
        symbols_to_sell = []
        for sym, data in self.portfolio.items():
            drop_pct = ((data['avg_price'] - data['current_price']) / data['avg_price']) * 100
            if drop_pct >= self.risk_settings['stopLossPct']:
                symbols_to_sell.append((sym, data['current_price']))
                
        for sym, price in symbols_to_sell:
            self._sell(sym, price, timestamp)

    def get_portfolio_value(self) -> float:
        invested = sum(d['quantity'] * d['current_price'] for d in self.portfolio.values())
        return self.cash + invested

    def _record_history(self, timestamp: datetime):
        total_val = self.get_portfolio_value()
        self.history.append({
            "timestamp": timestamp.isoformat(),
            "value": total_val,
            "pnl": total_val - self.initial_capital
        })

    def get_api_portfolio(self):
        positions = []
        total_invested = 0
        total_value = self.get_portfolio_value()
        
        for sym, d in self.portfolio.items():
            current_price = d['current_price']
            market_value = d['quantity'] * current_price
            pnl = market_value - (d['quantity'] * d['avg_price'])
            pnl_percent = (pnl / (d['quantity'] * d['avg_price']) * 100) if d['avg_price'] > 0 else 0
            
            total_invested += market_value
            
            positions.append({
                "symbol": sym,
                "quantity": d['quantity'],
                "avgPrice": round(d['avg_price'], 2),
                "currentPrice": round(current_price, 2),
                "marketValue": round(market_value, 2),
                "pnl": round(pnl, 2),
                "pnlPercent": round(pnl_percent, 2),
                "allocation": round((market_value / total_value) * 100, 2) if total_value > 0 else 0,
                "sector": d['sector']
            })
            
        total_pnl = total_value - self.initial_capital
        
        return {
            "totalValue": round(total_value, 2),
            "cashBalance": round(self.cash, 2),
            "investedValue": round(total_invested, 2),
            "totalPnl": round(total_pnl, 2),
            "totalPnlPercent": round((total_pnl / self.initial_capital) * 100, 2),
            "dayPnl": round(total_pnl, 2), # Simplified
            "dayPnlPercent": round((total_pnl / self.initial_capital) * 100, 2),
            "positions": positions
        }
