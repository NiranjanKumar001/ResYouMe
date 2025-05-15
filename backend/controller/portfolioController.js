const Portfolio = require("../models/portfolio.js");

// Create a new portfolio
exports.createPortfolio = async (req, res) => {
  try {
    const portfolio = new Portfolio(req.body);
    const savedPortfolio = await portfolio.save();
    res.status(201).json(savedPortfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all portfolios
exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find()
      .populate("user", "username email")
      .populate("resume", "filename");
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single portfolio by ID
exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id)
      .populate("user", "username email")
      .populate("resume", "filename");
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a portfolio by ID
exports.updatePortfolio = async (req, res) => {
  try {
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPortfolio) return res.status(404).json({ message: "Portfolio not found" });
    res.json(updatedPortfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a portfolio by ID
exports.deletePortfolio = async (req, res) => {
  try {
    const deleted = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Portfolio not found" });
    res.json({ message: "Portfolio deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
