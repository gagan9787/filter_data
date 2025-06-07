const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-');
}

const filter_data = async (req, res) => {
    try {
        const cities = await prisma.city.findMany();
        const states = await prisma.state.findMany();
        const courses = await prisma.course.findMany();
        const streams = await prisma.stream.findMany();
        const exams = await prisma.accepted_exam.findMany();
        universities = await prisma.university.findMany();

        res.json({
            city: cities,
            state: states,
            course: courses,
            stream: streams,
            accepted_exam: exams,
            university: universities,
        });
    } catch (error) {
        console.error('Error fetching filter data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
};

const university_data = async (req, res) => {
    let { slug, category } = req.query;
    try {
        if(category == 'exam'){
            category = 'accepted_exam';
        }
        const where = {};
        if (slug && category) {
            const data = await prisma[category].findMany({
                where: {
                    slug: slug
                }
            });

            if (category === 'city') {
                where.city_id = data[0].id;
            }
            else if (category === 'state') {
                where.state_id = data[0].id;
            }
            else if (category === 'course') {
                const course_id = data[0].id;
                const rec = await prisma.university_course.findMany({
                    where: {
                        course_id: course_id
                    },
                    select: {
                        university_id: true
                    }
                });
                where.id = { in: rec.map(r => r.university_id) };
            }
            else if (category === 'stream') {
                const stream_id = data[0].id;
                const rec = await prisma.university_course.findMany({
                    where: {
                        stream_id: stream_id
                    },
                    select: {
                        university_id: true
                    }
                });
                where.id = { in: rec.map(r => r.university_id) };
            }
            else if (category === 'accepted_exam') {
                const exam_id = data[0].id;
                const rec = await prisma.university_exam.findMany({
                    where: {
                        exam_id: exam_id
                    },
                    select: {
                        university_id: true
                    }
                });
                where.id = { in: rec.map(r => r.university_id) };
            }
            else if (category === 'program_type') {
                
            }
        }

        const universities = await prisma.university.findMany(
            {
                where: where,
                include: {
                    city: {
                        select: {
                            name: true,
                        }
                    },
                    state: {
                        select: {
                            name: true,
                        }
                    },
                }
            }
        );
        res.json(universities);
    } catch (error) {
        console.error('Error fetching university data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = {
    filter_data,
    university_data
};