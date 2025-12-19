// Middleware de validação usando express-validator
const { body, validationResult } = require('express-validator');

// Middleware para processar resultados da validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validações para registro de usuário
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  handleValidationErrors,
];

// Validações para login
const validateLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  handleValidationErrors,
];

// Validações para transação
const validateTransaction = [
  body('description').trim().notEmpty().withMessage('Descrição é obrigatória'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que zero'),
  body('type').isIn(['income', 'expense']).withMessage('Tipo deve ser income ou expense'),
  body('date').isISO8601().withMessage('Data inválida'),
  handleValidationErrors,
];

// Validações para categoria
const validateCategory = [
  body('name').trim().notEmpty().withMessage('Nome da categoria é obrigatório'),
  body('type').isIn(['income', 'expense']).withMessage('Tipo deve ser income ou expense'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateTransaction,
  validateCategory,
};

