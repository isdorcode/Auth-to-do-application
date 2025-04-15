const express = require('express');
const { Form, Title } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new form under a title
router.post('/', auth, async (req, res) => {
  try {
    const { name, titleId } = req.body;
    
    if (!name || !titleId) {
      return res.status(400).json({ error: 'Form name and titleId are required' });
    }

    // Verify the title belongs to the user
    const title = await Title.findOne({
      where: {
        id: titleId,
        UserId: req.user.id
      }
    });

    if (!title) {
      return res.status(404).json({ error: 'Title not found or access denied' });
    }

    const form = await Form.create({ 
      name, 
      TitleId: titleId 
    });
    
    res.status(201).json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

// Get all forms for a specific title
router.get('/:titleId', auth, async (req, res) => {
  try {
    // Verify the title belongs to the user
    const title = await Title.findOne({
      where: {
        id: req.params.titleId,
        UserId: req.user.id
      }
    });

    if (!title) {
      return res.status(404).json({ error: 'Title not found or access denied' });
    }

    const forms = await Form.findAll({ 
      where: { TitleId: req.params.titleId } 
    });
    
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

// Get a specific form
router.get('/single/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOne({
      where: { id: req.params.id },
      include: [{
        model: Title,
        where: { UserId: req.user.id }
      }]
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found or access denied' });
    }

    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// Update a form
router.put('/:id', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Form name is required' });
    }

    const [updated] = await Form.update(
      { name },
      { 
        where: { 
          id: req.params.id 
        } 
      }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const updatedForm = await Form.findByPk(req.params.id);
    res.json(updatedForm);
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ error: 'Failed to update form' });
  }
});

// Delete a form
router.delete('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOne({
      where: { id: req.params.id },
      include: [{
        model: Title,
        where: { UserId: req.user.id }
      }]
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found or access denied' });
    }

    await form.destroy();
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ error: 'Failed to delete form' });
  }
});

module.exports = router;