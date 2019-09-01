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

// @route    POST api/books/comment/:id
// @desc     Comment on a book
// @access   Private
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const book = await Book.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      book.comments.unshift(newComment);

      await book.save();

      res.json(book.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);
// @route    DELETE api/books/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    // Pull out comment
    const comment = book.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = book.comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

    book.comments.splice(removeIndex, 1);

    await book.save();

    res.json(book.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
