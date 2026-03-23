import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from .indicators import add_technical_indicators

def fetch_historical_data(symbol: str, period: str = "1y", interval: str = "1d") -> pd.DataFrame:
    """
    Fetches historical stock data using yfinance.
    """
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period, interval=interval)
    df.dropna(inplace=True)
    return df

def get_live_price(symbol: str) -> float:
    """
    Fetches the current live price (or last previous close if market closed) with high granularity.
    """
    ticker = yf.Ticker(symbol)
    try:
        # Try to get the latest 1-minute bar
        data = ticker.history(period='1d', interval='1m')
        if not data.empty:
            return float(data['Close'].iloc[-1])
        # Fallback to daily data if 1m is unavailable (e.g. over weekend/holidays)
        data = ticker.history(period='5d', interval='1d')
        if not data.empty:
            return float(data['Close'].iloc[-1])
    except Exception:
        pass
    return 0.0

def get_latest_state(symbol: str) -> pd.Series:
    """
    Fetches the most recent historical data and calculates indicators to form the observation state.
    """
    ticker = yf.Ticker(symbol)
    # Using 6 months of daily data to ensure enough periods for 50-SMA and MACD
    try:
        df = ticker.history(period='6mo', interval='1d')
        if not df.empty:
            df = add_technical_indicators(df)
            if not df.empty:
                return df.iloc[-1]
    except Exception as e:
        print(f"Error fetching state for {symbol}: {e}")
    return pd.Series(dtype=float)

def get_watchlist_data(symbols: list) -> list:
    """
    Fetches basic summary data for a watchlist.
    """
    data = []
    for sym in symbols:
        ticker = yf.Ticker(sym)
        info = ticker.info
        current_price = info.get('currentPrice', info.get('previousClose', 0.0))
        previous_close = info.get('previousClose', current_price)
        change = current_price - previous_close
        change_pct = (change / previous_close * 100) if previous_close else 0.0

        data.append({
            "symbol": sym,
            "price": current_price,
            "change": round(change, 2),
            "changePercent": round(change_pct, 2),
            "volume": info.get('volume', 0)
        })
    return data
