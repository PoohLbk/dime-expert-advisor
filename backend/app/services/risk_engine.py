class RiskEngine:
    @staticmethod
    def calculate_dca_budget(net_income: float, dca_rate: float = 0.20):
        """คำนวณงบ DCA รายเดือนและจัดสรรลงสัดส่วน Core 60%, Growth 30%, Cash Buffer 10%"""
        total_dca = net_income * dca_rate
        return {
            "total_dca": round(total_dca, 2),
            "core_stocks_60": round(total_dca * 0.60, 2),
            "growth_stocks_30": round(total_dca * 0.30, 2),
            "cash_buffer_10": round(total_dca * 0.10, 2)
        }

    @staticmethod
    def calculate_position_size(
        account_balance: float,
        entry_price: float,
        stop_loss_price: float,
        max_risk_pct: float = 0.02
    ):
        """คุมความเสี่ยงไม่เกิน 2% ของเงินทุน และคำนวณจำนวนหุ้นที่ซื้อได้สูงสุด"""
        max_risk_usd = account_balance * max_risk_pct
        risk_per_share = entry_price - stop_loss_price

        if risk_per_share <= 0:
            return {"max_shares": 0, "max_cost_usd": 0.0, "risk_per_share": 0.0}

        max_shares = max_risk_usd / risk_per_share
        max_cost_usd = max_shares * entry_price

        return {
            "max_risk_usd": round(max_risk_usd, 2),
            "risk_per_share": round(risk_per_share, 2),
            "max_shares": round(max_shares, 4),
            "max_cost_usd": round(max_cost_usd, 2)
        }
