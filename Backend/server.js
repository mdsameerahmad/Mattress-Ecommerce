const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Configurable fees
const LABOR_FEE = 300; // flat units
const MARGIN_PERCENT = 0.15; // 15%
const TAX_PERCENT = 0.18; // 18%

// Materials - keep aligned with Frontend/src/lib/materials.ts
const MATERIALS = [
  { id: 'foam', name: 'Polyurethane Foam', density: 30, price_per_kg: 0.6 },
  { id: 'memory', name: 'Memory Foam', density: 55, price_per_kg: 1.4 },
  { id: 'latex', name: 'Natural Latex', density: 65, price_per_kg: 2.2 },
  { id: 'coir', name: 'Coir', density: 100, price_per_kg: 0.4 },
  { id: 'spring', name: 'Pocket Spring (approx)', density: 7850, price_per_kg: 0.5 },
  { id: 'd1', name: 'Cloth Texture 1', density: 10, price_per_kg: 5.0 },
  { id: 'd2', name: 'Cloth Texture 2', density: 10, price_per_kg: 5.0 },
  { id: 'd3', name: 'Cloth Texture 3', density: 10, price_per_kg: 5.0 },
  { id: 'd4', name: 'Cloth Texture 4', density: 10, price_per_kg: 5.0 }
];

app.get('/api/materials', (req, res) => res.json(MATERIALS));

app.post('/api/calculate', (req, res) => {
  try {
    const { length_cm, width_cm, layers } = req.body;
    if (!length_cm || !width_cm || !Array.isArray(layers) || layers.length === 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const l_m = Number(length_cm) / 100;
    const w_m = Number(width_cm) / 100;

    let materialsCost = 0;
    const breakdown = [];

    for (const layer of layers) {
      const mat = MATERIALS.find(m => m.id === layer.materialId);
      if (!mat) return res.status(400).json({ error: `Material ${layer.materialId} not found` });

      const thickness_m = Number(layer.thickness_mm) / 1000;
      const volume = l_m * w_m * thickness_m; // m^3
      const mass = volume * mat.density; // kg
      const cost = mass * mat.price_per_kg;

      breakdown.push({
        materialId: mat.id,
        materialName: mat.name,
        thickness_mm: layer.thickness_mm,
        volume_m3: Number(volume.toFixed(6)),
        mass_kg: Number(mass.toFixed(3)),
        cost: Number(cost.toFixed(2))
      });

      materialsCost += cost;
    }

    const labor = LABOR_FEE;
    const margin = materialsCost * MARGIN_PERCENT;
    const subtotal = materialsCost + labor + margin;
    const tax = subtotal * TAX_PERCENT;
    const total = subtotal + tax;

    res.json({
      length_cm,
      width_cm,
      materialsCost: Number(materialsCost.toFixed(2)),
      labor: Number(labor.toFixed(2)),
      margin: Number(margin.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      layers: breakdown
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));