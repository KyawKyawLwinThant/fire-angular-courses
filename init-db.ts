
import {COURSES, findLessonsForCourse} from './db.data'

import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyB_QF3xIWXzU0Hbh8p1dSx8OcqTab2MoL4",
  authDomain: "fire-course-c7496.firebaseapp.com",
  databaseURL: "https://fire-course-c7496.firebaseio.com",
  projectId: "fire-course-c7496",
  storageBucket: "fire-course-c7496.appspot.com",
  messagingSenderId: "864826074044",
  appId: "1:864826074044:web:d4ae2c75e4263e6e1641b9",
  measurementId: "G-RF4Z31SEPT"
};

console.log("Uploading data to the database with the following config:\n");

console.log(JSON.stringify(config));

console.log("\n\n\n\nMake sure that this is your own database, so that you have write access to it.\n\n\n");

const app = firebase.initializeApp(config);
const db = firebase.firestore();

main().then(r => console.log('Done.'));

async function uploadData() {
  const courses = await db.collection('courses');
  for (let course of Object.values(COURSES)) {
    const newCourse = removeId(course);
    const courseRef = await courses.add(newCourse);
    const lessons = await courseRef.collection('lessons');
    const courseLessons = findLessonsForCourse(course['id']);
    console.log(`Uploading course ${course['titles']["description"]}`);
    for (const lesson of courseLessons) {
      const newLesson = removeId(lesson);
      await lessons.add(newLesson);
    }
  }
}

function removeId(data: any) {
  const newData: any = {...data};
  delete newData.id;
  return newData;
}

async function main(){
  try {
    console.log('Start main...\n\n');
    await uploadData();
    console.log('\n\nClosing Application...');
    await app.delete();
  }catch (e) {
    console.log('Data upload failed, reason:', e, '\n\n');
  }
}

