// src/pages/ultrasonic/EditUltrasonicPage.jsx

import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

function UltrasonicPage() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    distance_cm: '',
    action: '',
    zone: '',
    etat: 0
  });
  const [editId, setEditId] = useState(null);

  // GET ALL
  const fetchData = async () => {
    try {
      const res = await axios.get('/ultrasonic');
      setData(res.data);
    } catch (err) {
      console.error('Erreur fetch:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId === null) {
        await axios.post('/ultrasonic/data', form);
      } else {
        await axios.put(`/ultrasonic/${editId}`, form);
        setEditId(null);
      }
      setForm({ distance_cm: '', action: '', zone: '', etat: 0 });
      fetchData();
    } catch (err) {
      console.error('Erreur enregistrement:', err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/ultrasonic/${id}`);
      fetchData();
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  // SET EDIT
  const handleEdit = (item) => {
    setForm({
      distance_cm: item.distance_cm,
      action: item.action,
      zone: item.zone,
      etat: item.etat
    });
    setEditId(item.id);
  };

  return (
    <div>
      <h2>Gestion Ultrasonic</h2>

      <form onSubmit={handleSubmit}>
        <input name="distance_cm" value={form.distance_cm} onChange={handleChange} placeholder="Distance (cm)" />
        <input name="action" value={form.action} onChange={handleChange} placeholder="Action" />
        <input name="zone" value={form.zone} onChange={handleChange} placeholder="Zone" />
        <input name="etat" value={form.etat} onChange={handleChange} type="number" placeholder="État (0/1)" />
        <button type="submit">{editId === null ? 'Ajouter' : 'Mettre à jour'}</button>
      </form>

      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.datetime} | {item.distance_cm} cm | {item.action} | {item.zone} | État: {item.etat}
            <button onClick={() => handleEdit(item)}>Modifier</button>
            <button onClick={() => handleDelete(item.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UltrasonicPage;
