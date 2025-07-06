import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("⏳ Seeding admins...");
    await prisma.admin.createMany({
      data: [
        { id: "admin1", username: "admin1" },
        { id: "admin2", username: "admin2" },
      ],
      skipDuplicates: true,
    });
    console.log("✅ Admins seeded.");

    console.log("⏳ Seeding grades...");
    await prisma.grade.createMany({
      data: Array.from({ length: 6 }, (_, i) => ({ level: i + 1 })),
      skipDuplicates: true,
    });
    console.log("✅ Grades seeded.");

    console.log("⏳ Seeding subjects...");
    const subjects = [
      "Math",
      "Science",
      "English",
      "History",
      "Geography",
      "Physics",
      "Chemistry",
      "Biology",
      "CS",
      "Art",
    ];
    await prisma.subject.createMany({
      data: subjects.map((name) => ({ name })),
      skipDuplicates: true,
    });
    console.log("✅ Subjects seeded.");

    console.log("⏳ Seeding teachers...");
    const teachersData = Array.from({ length: 20 }, (_, i) => ({
      id: `teacher${i + 1}`,
      username: `teacher${i + 1}`,
      name: `TName${i + 1}`,
      surname: `TSurname${i + 1}`,
      email: `teacher${i + 1}@school.com`,
      phone: `091200000${i + 1}`,
      address: `Teacher St ${i + 1}`,
      bloodType: "A+",
      sex: (i + 1) % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
      birthday: new Date(1980 + ((i + 1) % 10), 0, 1),
      // اینجا چون subjects و classes باید connect بشن، فعلاً جداگانه انجام میدیم پایین‌تر
    }));
    await prisma.teacher.createMany({
      data: teachersData.map(
        ({
          id,
          username,
          name,
          surname,
          email,
          phone,
          address,
          bloodType,
          sex,
          birthday,
        }) => ({
          id,
          username,
          name,
          surname,
          email,
          phone,
          address,
          bloodType,
          sex,
          birthday,
        })
      ),
      skipDuplicates: true,
    });
    console.log("✅ Teachers seeded.");

    console.log("⏳ Connecting teachers to subjects and classes...");
    // برای کانکت کردن، چون createMany این کار رو نمیکنه، باید جدا انجام بدیم:
    for (let i = 0; i < 20; i++) {
      const teacherId = `teacher${i + 1}`;
      await prisma.teacher.update({
        where: { id: teacherId },
        data: {
          subjects: { connect: [{ id: (i % 10) + 1 }] },
          classes: { connect: [{ id: (i % 6) + 1 }] },
        },
      });
    }
    console.log("✅ Teachers connected.");

    console.log("⏳ Seeding classes...");
    const classesData = Array.from({ length: 6 }, (_, i) => ({
      name: `${i + 1}A`,
      capacity: 20,
      gradeId: i + 1,
      supervisorId: `teacher${(i % 20) + 1}`,
    }));
    await prisma.class.createMany({
      data: classesData,
      skipDuplicates: true,
    });
    console.log("✅ Classes seeded.");

    console.log("⏳ Seeding lessons...");
    const lessonsData = Array.from({ length: 60 }, (_, i) => ({
      name: `Lesson${i + 1}`,
      day: Day[Object.keys(Day)[(i + 1) % 5] as keyof typeof Day],
      startTime: new Date(new Date().setHours(8 + ((i + 1) % 5), 0, 0)),
      endTime: new Date(new Date().setHours(9 + ((i + 1) % 5), 0, 0)),
      subjectId: ((i + 1) % 10) + 1,
      classId: ((i + 1) % 6) + 1,
      teacherId: `teacher${((i + 1) % 20) + 1}`,
    }));
    await prisma.lesson.createMany({
      data: lessonsData,
      skipDuplicates: true,
    });
    console.log("✅ Lessons seeded.");

    console.log("⏳ Seeding parents...");
    const parentsData = Array.from({ length: 30 }, (_, i) => ({
      id: `parent${i + 1}`,
      username: `parent${i + 1}`,
      name: `PName${i + 1}`,
      surname: `PSurname${i + 1}`,
      email: `parent${i + 1}@mail.com`,
      phone: `093500000${i + 1}`,
      address: `Parent Blvd ${i + 1}`,
    }));
    await prisma.parent.createMany({
      data: parentsData,
      skipDuplicates: true,
    });
    console.log("✅ Parents seeded.");

    console.log("⏳ Seeding students...");
    const studentsData = Array.from({ length: 100 }, (_, i) => ({
      id: `student${i + 1}`,
      username: `student${i + 1}`,
      name: `SName${i + 1}`,
      surname: `SSurname${i + 1}`,
      email: `student${i + 1}@mail.com`,
      phone: `093600000${i + 1}`,
      address: `Student Ave ${i + 1}`,
      bloodType: "O+",
      sex: (i + 1) % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
      birthday: new Date(2010 + ((i + 1) % 5), 0, 1),
      createdAt: new Date(),
      parentId: `parent${((i + 1) % 30) + 1}`,
      gradeId: ((i + 1) % 6) + 1,
      classId: ((i + 1) % 6) + 1,
    }));
    await prisma.student.createMany({
      data: studentsData,
      skipDuplicates: true,
    });
    console.log("✅ Students seeded.");

    console.log("⏳ Seeding exams...");
    const examsData = Array.from({ length: 30 }, (_, i) => ({
      title: `Exam ${i + 1}`,
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 60 * 60 * 1000),
      lessonId: ((i + 1) % 60) + 1,
    }));
    await prisma.exam.createMany({
      data: examsData,
      skipDuplicates: true,
    });
    console.log("✅ Exams seeded.");

    console.log("⏳ Seeding assignments...");
    const assignmentsData = Array.from({ length: 30 }, (_, i) => ({
      title: `Assignment ${i + 1}`,
      startDate: new Date(),
      dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
      lessonId: ((i + 1) % 60) + 1,
    }));
    await prisma.assignment.createMany({
      data: assignmentsData,
      skipDuplicates: true,
    });
    console.log("✅ Assignments seeded.");

    console.log("⏳ Seeding results...");
    for (let i = 1; i <= 100; i++) {
      await prisma.result.create({
        data: {
          score: Math.floor(Math.random() * 41) + 60,
          studentId: `student${(i % 100) + 1}`,
          ...(i <= 50
            ? { examId: (i % 30) + 1 }
            : { assignmentId: (i % 30) + 1 }),
        },
      });
    }
    console.log("✅ Results seeded.");

    console.log("⏳ Seeding attendances...");
    for (let i = 1; i <= 150; i++) {
      await prisma.attendance.create({
        data: {
          date: new Date(),
          present: i % 5 !== 0,
          studentId: `student${(i % 100) + 1}`,
          lessonId: (i % 60) + 1,
        },
      });
    }
    console.log("✅ Attendances seeded.");

    console.log("⏳ Seeding events...");
    const eventsData = Array.from({ length: 10 }, (_, i) => ({
      title: `Event ${i + 1}`,
      description: `School Event ${i + 1} description.`,
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
      classId: ((i + 1) % 6) + 1,
    }));
    await prisma.event.createMany({
      data: eventsData,
      skipDuplicates: true,
    });
    console.log("✅ Events seeded.");

    console.log("⏳ Seeding announcements...");
    const announcementsData = Array.from({ length: 10 }, (_, i) => ({
      title: `Announcement ${i + 1}`,
      description: `Important notice ${i + 1}`,
      date: new Date(),
      classId: ((i + 1) % 6) + 1,
    }));
    await prisma.announcement.createMany({
      data: announcementsData,
      skipDuplicates: true,
    });
    console.log("✅ Announcements seeded.");

    console.log("🎉 All seeding done!");
  } catch (err) {
    console.error("❌ Error during seeding:", err);
    throw err;
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error("❌ Unhandled seeding error:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
