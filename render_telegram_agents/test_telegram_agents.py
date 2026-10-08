import os,unittest
os.environ["AGENT_ROLE"]="KATAKURI"
from render_telegram_agents.bot import risk,portfolio,fundamentals,command
class GuardrailTests(unittest.TestCase):
    def test_budget(self):
        r=risk(10000,5,0.5)
        self.assertEqual(r["status"],"PRELIMINARY")
        self.assertEqual(r["risk_budget_usd"],50)
        self.assertEqual(r["max_new_position_usd"],1000)
    def test_risk_above_one_percent_is_veto(self):
        self.assertEqual(risk(10000,5,2)["status"],"VETO")
    def test_stop_above_limit_veto(self):
        self.assertEqual(risk(10000,40,0.5)["status"],"VETO")
    def test_portfolio_overweight(self):
        r=portfolio(10000,2500,4000)
        self.assertEqual(r["status"],"OVERWEIGHT")
        self.assertEqual(r["allocation_headroom_usd"],0)
    def test_portfolio_healthy(self):
        self.assertEqual(portfolio(10000,300,2000)["status"],"REVIEW")
    def test_fundamentals_missing_data_is_unverified(self):
        r=fundamentals({"market_cap":100,"fdv":1000})
        self.assertIn("High dilution risk",r["warnings"])
        self.assertEqual(r["status"],"NEEDS_FUNDAMENTAL_EVIDENCE")
    def test_help_clear_no_execution(self):
        self.assertIn("Tidak ada transaksi",command(123,"/help"))
    def test_owner_id_query(self):
        self.assertIn("123",command(123,"/id"))
if __name__=="__main__":unittest.main()
