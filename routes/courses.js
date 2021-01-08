const {
    Router
} = require('express');
const {
    validationResult
} = require('express-validator');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const {
    courseValidators
} = require('../utils/validators');
const router = Router();

router.get('/', async (req, res) => {
    const courses = await Course.find();

    res.render('courses', {
        title: 'Courses',
        isCourse: true,
        courses
    });
});

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    const course = await Course.findById(req.params.id);

    res.render('course-edit', {
        title: `Edit the ${course.title}`,
        course
    });
});

router.post('/edit', auth, courseValidators, async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
    }

    await Course.findByIdAndUpdate(req.body.id, req.body)
    res.redirect('/courses');
});

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id
        });
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    });
});

module.exports = router;