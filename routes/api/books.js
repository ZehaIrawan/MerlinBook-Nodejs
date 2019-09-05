const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Book = require('../../models/Book');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route    POST api/books
// @desc     Create a books entry
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('category', 'Category is required')
        .not()
        .isEmpty(),
      check('author', 'Author is required')
        .not()
        .isEmpty(),
      check('totalChapter', 'TotalChapter is required')
        .not()
        .isEmpty(),
      check('currentChapter', 'currentChapter is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newBook = new Book({
        title: req.body.title,
        category: req.body.category,
        author: req.body.author,
        totalChapter: req.body.totalChapter,
        currentChapter: req.body.currentChapter,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const book = await newBook.save();

      res.json(book);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

// @route    GET api/books
// @desc     Get all books
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find().sort({ date: -1 });
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/books/:id
// @desc     Get book by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    res.json(book);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/books/:id
// @desc     Delete a book
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  console.log(req);
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    // Check user
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await book.remove();

    res.json({ msg: 'Book removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/book/:id
// @desc     Update book data
// @access   Private
router.put(
  '/:id',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('category', 'Category is required')
        .not()
        .isEmpty(),
      check('author', 'Author is required')
        .not()
        .isEmpty(),
      check('totalChapter', 'TotalChapter is required')
        .not()
        .isEmpty(),
      check('currentChapter', 'currentChapter is required')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedData = {
      title: req.body.title,
      category: req.body.category,
      author: req.body.author,
      totalChapter: req.body.totalChapter,
      currentChapter: req.body.currentChapter,
    };

    try {
      const book = await Book.findOne({ _id: req.params.id });


      const result = Object.assign(book, updatedData);

      console.log(book);
      await Book.findByIdAndUpdate(
        req.params.id,
        { $set: result },
        { new: true },
      );

      res.json(result);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

module.exports = router;
