const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 4966;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_4966", // PostgreSQLのユーザー名に置き換えてください
  host: "db",
  database: "crm_4966", // PostgreSQLのデータベース名に置き換えてください
  password: "pass_4966", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.use(express.static("public"));

app.delete("/customers/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "該当する顧客が見つかりません" });
    } else {
      res.status(200).json({ message: "削除に成功しました" });
    }
  } catch (err) {
    console.error("削除エラー:", err);
    res.status(500).json({ error: "削除に失敗しました" });
  }
});

app.put("/customers/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { company_name, industry, contact, location } = req.body;

  try {
    const result = await pool.query(
      "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4, updated_date = CURRENT_TIMESTAMP WHERE customer_id = $5 RETURNING *",
      [company_name, industry, contact, location, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "該当する顧客が見つかりません" });
    } else {
      res.status(200).json({ message: "更新に成功しました", customer: result.rows[0] });
    }
  } catch (err) {
    console.error("更新エラー:", err);
    res.status(500).json({ error: "更新に失敗しました" });
  }
});