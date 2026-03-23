import pandas as pd
from ta.trend import SMAIndicator, EMAIndicator, MACD
from ta.momentum import RSIIndicator
from ta.volatility import BollingerBands

def add_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adds standard technical indicators to the DataFrame using the 'ta' library.
    Assumes df has 'Close', 'High', 'Low', 'Volume' columns.
    """
    if df.empty or len(df) < 30:
        return df

    # We copy to avoid SettingWithCopyWarning
    data = df.copy()

    close = data['Close']

    # 1. Moving Averages
    data['SMA_20'] = SMAIndicator(close, window=20).sma_indicator()
    data['EMA_20'] = EMAIndicator(close, window=20).ema_indicator()
    data['SMA_50'] = SMAIndicator(close, window=50).sma_indicator()

    # 2. RSI
    data['RSI_14'] = RSIIndicator(close, window=14).rsi()

    # 3. MACD
    macd = MACD(close, window_slow=26, window_fast=12, window_sign=9)
    data['MACD'] = macd.macd()
    data['MACD_Signal'] = macd.macd_signal()
    data['MACD_Diff'] = macd.macd_diff()

    # 4. Bollinger Bands
    bb = BollingerBands(close, window=20, window_dev=2)
    data['BB_High'] = bb.bollinger_hband()
    data['BB_Low'] = bb.bollinger_lband()
    data['BB_Mid'] = bb.bollinger_mavg()

    # Drop NaNs created by rolling windows
    data.dropna(inplace=True)

    return data
