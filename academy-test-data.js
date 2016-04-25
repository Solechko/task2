var academy = require('./academy');

module.exports = academyTestData();

function academyTestData()
{
	return {
		add: function() {
			academy.resetData();

			academy.addStudent('Иванов');
			academy.addStudent('Петров');
			academy.addStudent('Сидоров');
			academy.addStudent('Васечкин');
			academy.addStudent('Пупкин');
			academy.addStudent('Попов');

			academy.addMentor('Ментор 1');
			academy.addMentor('Ментор 2');
			academy.addMentor('Ментор 3');
			academy.addMentor('Ментор 4');

			academy.addTeam('Команда 1', [1, 4, 5]);
			academy.addTeam('Команда 2', [3, 2]);

			academy.addTask('Задание 1');
			academy.addTask('Задание 2');
			academy.addTask('Задание 3');
			academy.addTask('Задание 4');

			academy.assignTaskToStudent(1, 2);
			academy.assignTaskToStudent(1, 1);
			academy.assignTaskToStudent(3, 1);
			academy.assignTaskToStudent(4, 5);
			academy.assignTaskToTeam(1, 1);
			academy.assignTaskToTeam(2, 1);
			academy.assignTaskToTeam(3, 2);
			academy.assignTaskToTeam(4, 2);
			academy.evaluateStudentAssignment(3, 1, '5');
			academy.evaluateTeamAssignment(4, 2, '4');

			academy.setStudentPriority(1, [1, 3, 2, 4]);	
			academy.setStudentPriority(2, [4, 1, 2, 3]);
			academy.setStudentPriority(3, [1, 2, 4, 3]);
			academy.setStudentPriority(4, [4, 3, 1, 2]);
			academy.setStudentPriority(5, [1, 3, 2, 4]);
			academy.setStudentPriority(6, [2, 1, 3, 4]);

			academy.setMentorPriority(1, [1, 6, 3, 2, 5, 4]);
			academy.setMentorPriority(2, [3, 6, 2, 5, 1, 4]);
			academy.setMentorPriority(3, [5, 6, 2, 1, 4, 3]);
			academy.setMentorPriority(4, [6, 5, 3, 4, 1, 2]);
		}
	}
}