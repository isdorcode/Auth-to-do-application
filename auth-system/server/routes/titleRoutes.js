const express = require('express');
const { Title, Form } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new title
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Title name is required' });
    }

    const title = await Title.create({ 
      name, 
      UserId: req.user.id 
    });
    
    res.status(201).json(title);
  } catch (error) {
    console.error('Error creating title:', error);
    res.status(500).json({ error: 'Failed to create title' });
  }
});

// Get all titles for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const titles = await Title.findAll({ 
      where: { UserId: req.user.id },
      include: [{
        model: Form,
        as: 'Forms'
      }]
    });
    
    res.json(titles);
  } catch (error) {
    console.error('Error fetching titles:', error);
    res.status(500).json({ error: 'Failed to fetch titles' });
  }
});

// Get a specific title with its forms
router.get('/:id', auth, async (req, res) => {
  try {
    const title = await Title.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id
      },
      include: [{
        model: Form,
        as: 'Forms'
      }]
    });

    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    res.json(title);
  } catch (error) {
    console.error('Error fetching title:', error);
    res.status(500).json({ error: 'Failed to fetch title' });
  }
});

// Update a title
router.put('/:id', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Title name is required' });
    }

    const [updated] = await Title.update(
      { name },
      { 
        where: { 
          id: req.params.id,
          UserId: req.user.id 
        } 
      }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Title not found' });
    }

    const updatedTitle = await Title.findByPk(req.params.id);
    res.json(updatedTitle);
  } catch (error) {
    console.error('Error updating title:', error);
    res.status(500).json({ error: 'Failed to update title' });
  }
});

// Delete a title and its associated forms
router.delete('/:id', auth, async (req, res) => {
  try {
    const title = await Title.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id
      }
    });

    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    // Delete associated forms first
    await Form.destroy({
      where: { TitleId: title.id }
    });

    await title.destroy();
    res.status(200).json({ message: 'Title and associated forms deleted successfully' });
  } catch (error) {
    console.error('Error deleting title:', error);
    res.status(500).json({ error: 'Failed to delete title' });
  }
});

module.exports = router;