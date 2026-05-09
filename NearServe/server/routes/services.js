const express = require('express');
const { getAllServices, getServiceById, createService, updateService, deleteService, getProviderServices } = require('../controllers/serviceController');
const { authMiddleware, providerOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.get('/provider/mine', authMiddleware, providerOnly, getProviderServices);
router.post('/', authMiddleware, providerOnly, createService);
router.put('/:id', authMiddleware, providerOnly, updateService);
router.delete('/:id', authMiddleware, providerOnly, deleteService);

module.exports = router;
