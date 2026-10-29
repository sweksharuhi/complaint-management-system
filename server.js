const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req,res) => res.json({status:'OK'}));

app.post('/api/complaints', async (req,res) => {
  try {
    const {subject, category, department, priority, description} = req.body;
    if (!subject || !category || !department || !priority || !description)
      return res.status(400).json({message:'All fields are required.'});

    const [rows] = await pool.query(
      `SELECT department_id FROM departments WHERE department_name=? LIMIT 1`, [department]
    );
    const departmentId = rows.length ? rows[0].department_id : 1;

    const [result] = await pool.query(
      `INSERT INTO complaints
       (student_id, department_id, subject, description, category, priority, status)
       VALUES (1,?,?,?,?,?,?,?)`,
      [departmentId, subject, description, category, priority, 'Pending']
    );
    res.status(201).json({message:'Complaint created', complaintId: result.insertId});
  } catch (err) {
    console.error(err);
    res.status(500).json({message:'Database error. Check MySQL configuration.'});
  }
});

app.get('/api/complaints', async (req,res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.complaint_id, c.subject, c.category, c.priority, c.status,
             c.created_at, d.department_name
      FROM complaints c
      JOIN departments d ON c.department_id=d.department_id
      ORDER BY c.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({message:'Database error.'});
  }
});

app.patch('/api/complaints/:id', async (req,res) => {
  try {
    const {status, remarks, assigned_to} = req.body;
    await pool.query(
      `UPDATE complaints SET status=?, assigned_to=?, updated_at=NOW() WHERE complaint_id=?`,
      [status, assigned_to || null, req.params.id]
    );
    if (remarks) {
      await pool.query(
        `INSERT INTO complaint_updates (complaint_id, updated_by, status, remarks)
         VALUES (?,1,?,?)`, [req.params.id, status, remarks]
      );
    }
    res.json({message:'Complaint updated'});
  } catch (err) {
    res.status(500).json({message:'Database error.'});
  }
});

app.listen(3000, () => console.log('OCMS API running on http://localhost:3000'));
