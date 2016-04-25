'use strict';

module.exports = academyManager();

function academyManager() {
	const STUDENT_EXECUTOR_TYPE = 1;
	const TEAM_EXECUTOR_TYPE = 2;

	var mentors = [];			// менторы
	var students = [];			// студенты
	var teams = [];				// команды
	var tasks = [];				// задачи
	var assignments = [];		// назначения задач студентам или командам
	var studentPriorities = [];	// приоритизированный список студентов
	var mentorPriorities = [];	// приоритизированный список менторов
	var mentorGroups = [];		// распределенние группы студентов у менторов

	return {
		addMentor: addMentor,
		addStudent: addStudent,
		addTeam: addTeam,
		addStudentToTeam: addStudentToTeam,
		addTask: addTask,
		assignTaskToStudent: assignTaskToStudent,
		assignTaskToTeam: assignTaskToTeam,

		evaluateStudentAssignment: evaluateStudentAssignment,
		evaluateTeamAssignment: evaluateTeamAssignment,

		getMentors: getMentors,
		getStudents: getStudents,
		getTeams: getTeams,
		getTasks: getTasks,
		getStudentsAssignments: getStudentsAssignments,
		getTeamsAssignments: getTeamsAssignments,
		getStudentPriorities: getStudentPriorities,
		getMentorPriorities: getMentorPriorities,
		getMentorById: getMentorById,
		getStudentById: getStudentById,
		getTeamById: getTeamById,
		getTaskById: getTaskById,

		setMentorPriority: setMentorPriority,
		setStudentPriority: setStudentPriority,
		formMentorGroups: formMentorGroups,

		importJson: importJson,
		exportJson: exportJson,
		resetData: resetData
	};

	// Добавить ментора
	function addMentor(mentorName) {
		// Проверка входных параметров
		if (mentorName === undefined) {
			throw new Error('Неверные входные параметры.');
		}

		// Добавление ментора
		var mentorId = mentors.length + 1;
		mentors.push({
			mentorId: mentorId,
			mentorName: mentorName
		});
		return mentorId;
	}

	// Добавить студента
	function addStudent(studentName) {
		// Проверка входных параметров
		if (studentName === undefined) {
			throw new Error('Неверные входные параметры.');
		}

		// Добавление студента
		var studentId = students.length + 1;
		students.push({
			studentId: studentId,
			studentName: studentName
		});
		return studentId;
	}

	// Добавить команду
	function addTeam(teamName, studentIds) {
		// Проверка входных параметров
		if (teamName === undefined) {
			throw new Error('Имя команды не указано.');
		}
		if (studentIds !== undefined) {
			studentIds.forEach(function(studentId){
				var studentsWithIds = students.filter(function (student){
					return student.studentId === studentId;					
				});
				if (studentsWithIds.length == 0)
					throw new Error('Студент с индетификатором ' + studentId + ' не существует');
			});
		}

		// Добавление команды
		var teamId = teams.length + 1;
		var teamStudentsIds = [];
		if (studentIds !== undefined)
			teamStudentsIds = studentIds;
		teams.push({
			teamId: teamId,
			teamName: teamName,
			teamStudentsIds: teamStudentsIds
		});
		return teamId;
	}

	// Добавить студента в команду
	function addStudentToTeam(teamId, studentId) {	
		// Проверка входных параметров
		if (teamId === undefined || studentId === undefined) {
			throw new Error('Неверные входные параметры.');
		}
		var studentsWithIds = students.filter(function (student){
			return student.studentId === studentId;					
		});
		if (studentsWithIds.length == 0)
			throw new Error('Студент с индетификатором ' + studentId + ' не существует');
		var teamsWithIds = teams.filter(function (team){
			return team.teamId === teamId;					
		});
		if (teamsWithIds.length == 0)
			throw new Error('Команда с индетификатором ' + teamId + ' не существует');
					
		// Удаляем студента из всех команд, в которых он присутствует
		teams.forEach(function(element, index, array) {
			var studentIndex = element.teamStudentsIds.indexOf(studentId);
			while(studentIndex >= 0) {
				element.teamStudentsIds.splice(studentIndex, 1);	
				studentIndex = element.teamStudentsIds.indexOf(studentId);
			}
		});
		
		// Поиск команды для добавления студента
		var result = teams.filter(function(t) {
    		return t.teamId === teamId; 
		});
		if (result.length === 1) {
			// Добавление студента в команду
			var team = result[0];
			team.teamStudentsIds.push(studentId);
			return true;
		} else {
			return false;
		}
	}

	// Создать задание
	function addTask(taskDescription) {
		// Проверка входных параметров
		if (taskDescription === undefined) {
			throw new Error('Неверные входные параметры.');
		}

		// Добавление задания
		var taskId = tasks.length + 1;
		tasks.push({
			taskId: taskId,
			taskDescription: taskDescription
		});
		return taskId;		
	}

	// Назначить задачу студенту
	function assignTaskToStudent(taskId, studentId) {
		// Проверка входных параметров
		if (taskId === undefined || studentId === undefined) {
			throw new Error('Неверные входные параметры.');
		}
		var studentsWithIds = students.filter(function (student){
			return student.studentId === studentId;					
		});
		if (studentsWithIds.length == 0)
			throw new Error('Студент с индетификатором ' + studentId + ' не существует');
		var tasksWithIds = tasks.filter(function (task){
			return task.taskId === taskId;					
		});
		if (tasksWithIds.length == 0)
			throw new Error('Задание с индетификатором ' + taskId + ' не существует');

		// Назначение задания студенту
		var assignment = getAssignment(taskId, STUDENT_EXECUTOR_TYPE, studentId);
		if (assignment !== undefined) 			
			throw new Error('Задание с идентификатором ' + taskId + ' уже назначено студенту');

		assignments.push({
			taskId: taskId,
			executorType: STUDENT_EXECUTOR_TYPE,
			executorId: studentId,			
			evaluation: ''
		});
	}

	// Назначить задачу команде
	function assignTaskToTeam(taskId, teamId) {
		// Проверка входных параметров
		if (taskId === undefined || teamId === undefined) {
			throw new Error('Неверные входные параметры.');
		}
		var teamsWithIds = teams.filter(function (team){
			return team.teamId === teamId;					
		});
		if (teamsWithIds.length == 0)
			throw new Error('Команда с индетификатором ' + teamId + ' не существует');
		var tasksWithIds = tasks.filter(function (task){
			return task.taskId === taskId;					
		});
		if (tasksWithIds.length == 0)
			throw new Error('Задание с индетификатором ' + taskId + ' не существует');

		// Назначение задания команде
		var assignment = getAssignment(taskId, TEAM_EXECUTOR_TYPE, teamId);
		if (assignment !== undefined) 
			throw new Error('Задание с идентификатором ' + taskId + ' уже назначено команде');

		assignments.push({
			taskId: taskId,
			executorType: TEAM_EXECUTOR_TYPE,
			executorId: teamId,			
			evaluation: ''
		});
	}

	// Поставить оценку за задание студенту
	function evaluateStudentAssignment(taskId, studentId, evaluation) {
		// Проверка входных параметров
		if (taskId === undefined || studentId === undefined || evaluation === undefined) {
			throw new Error('Неверные входные параметры.');
		}
		var studentsWithIds = students.filter(function (student){
			return student.studentId === studentId;					
		});
		if (studentsWithIds.length == 0)
			throw new Error('Студент с индетификатором ' + studentId + ' не существует');
		var tasksWithIds = tasks.filter(function (task){
			return task.taskId === taskId;					
		});
		if (tasksWithIds.length == 0)
			throw new Error('Задание с индетификатором ' + taskId + ' не существует');

		// Выставление оценки студенту за задание 
		var assignment = getAssignment(taskId, STUDENT_EXECUTOR_TYPE, studentId);
		if (assignment === undefined)
			throw new Error('Задание с идентификатором ' + taskId + ' не было назначено студенту');

		assignment.evaluation = evaluation;
	}

	// Поставить оценку за задание команде
	function evaluateTeamAssignment(taskId, teamId, evaluation) {
		// Проверка входных параметров
		if (taskId === undefined || teamId === undefined || evaluation === undefined) {
			throw new Error('Неверные входные параметры.');
		}
		var teamsWithIds = teams.filter(function (team){
			return team.teamId === teamId;					
		});
		if (teamsWithIds.length == 0)
			throw new Error('Команда с индетификатором ' + teamId + ' не существует');
		var tasksWithIds = tasks.filter(function (task){
			return task.taskId === taskId;					
		});
		if (tasksWithIds.length == 0)
			throw new Error('Задание с индетификатором ' + taskId + ' не существует');

		// Выставление оценки коменде за задание 
		var assignment = getAssignment(taskId, TEAM_EXECUTOR_TYPE, teamId);
		if (assignment === undefined) 
			throw new Error('Задание с идентификатором ' + taskId + ' не было назначено команде');
		assignment.evaluation = evaluation;		
	}

	// Получить назначение задачи исполнителю (приватный метод)
	function getAssignment(taskId, executorType, executorId) {
		var result = assignments.filter(function(a) {
    		return a.taskId === taskId && a.executorType === executorType && a.executorId === executorId; 
		});
		if (result.length === 1) {
			return result[0];
		} 
		return undefined;
	}

	// Установить приоритезированный список студента
	function setStudentPriority(studentId, mentorsIds) {
		// Проверка входных параметров
		if (studentId === undefined || mentorsIds === undefined ) {
			throw new Error('Неверные входные параметры.');
		}
		
		var studentsWithIds = students.filter(function (student){
			return student.studentId === studentId;					
		});
		if (studentsWithIds.length == 0)
			throw new Error('Студент с индетификатором ' + studentId + ' не существует');

		if (mentorsIds.length !== mentors.length)
			throw new Error('Неправильное количество приоритетов для менторов. Всего менторов: ' + mentors.length);
		
		mentorsIds.forEach(function(mentorId){
			var mentorsWithIds = mentors.filter(function (mentor){
				return mentor.mentorId === mentorId;					
			});
			if (mentorsWithIds.length == 0)
				throw new Error('Ментор с индетификатором ' + mentorId + ' не существует');
		});
		
		var studentPrioritiesWithIds = studentPriorities.filter(function (studentPriority) {
			return studentPriority.studentId === studentId;
		});
		// Удаление старого приоритезированного списка если он существует
		if (studentPrioritiesWithIds.length === 1) {
			
			var index = studentPriorities.indexOf(studentPrioritiesWithIds[0]);
			studentPriorities.splice(index, 1);
		}

		// Установка у студента приоритезированного списка менторов
		studentPriorities.push({
			studentId: studentId,
			mentorsIds: mentorsIds
		});
	}

	// Установить приоритезированный список ментора
	function setMentorPriority(mentorId, studentsIds) {
		// Проверка входных параметров
		if (mentorId === undefined || studentsIds === undefined ) {
			throw new Error('Неверные входные параметры.');
		}
		
		var mentorssWithIds = mentors.filter(function (mentor){
			return mentor.mentorId === mentorId;					
		});
		if (mentorssWithIds.length == 0)
			throw new Error('Ментор с индетификатором ' + mentorId + ' не существует');

		if (studentsIds.length !== students.length)
			throw new Error('Неправильное количество приоритетов для студентов. Всего студентов: ' + students.length);
		
		studentsIds.forEach(function(studentId){
			var studentsWithIds = students.filter(function (student){
				return student.studentId === studentId;					
			});
			if (studentsWithIds.length == 0)
				throw new Error('Студент с индетификатором ' + studentId + ' не существует');
		});
		
		var mentorPrioritiesWithIds = mentorPriorities.filter(function (mentorPriority) {
			return mentorPriority.mentorId === mentorId;
		});
		// Удаление старого приоритезированного списка если он существует
		if (mentorPrioritiesWithIds.length === 1) {
			var index = mentorPriorities.indexOf(mentorPrioritiesWithIds[0]);
			mentorPriorities.splice(index, 1);
		}

		// Установка у ментора приоритезированного списка студентов
		mentorPriorities.push({
			mentorId: mentorId,
			studentsIds: studentsIds
		});
	}

	// Получить список менторов
	function getMentors() {
		return mentors;
	}

	// Получить список студентов
	function getStudents() {
		return students;
	}

	// Получить список команд
	function getTeams() {
		return teams;
	}	

	// Получить список задач
	function getTasks() {
		return tasks;
	}	

	// Получить приоретизированный список менторов у студентов
	function getStudentPriorities() {
		return studentPriorities;
	}

	// Получить приоретизированный список студентов у менторов
	function getMentorPriorities() {
		return mentorPriorities;
	}

	// Получить список назначенных задач студентам
	function getStudentsAssignments() {
		var studentsAssignments = [];
		assignments.forEach(function(a){
			if (a.executorType === STUDENT_EXECUTOR_TYPE)
				studentsAssignments.push(a);
		});
		return studentsAssignments;
	}	

	// Получить список назначенных задач командам
	function getTeamsAssignments() {
		var teamsAssignments = [];
		assignments.forEach(function(a){
			if (a.executorType === TEAM_EXECUTOR_TYPE)
				teamsAssignments.push(a);
		});
		return teamsAssignments;
	}

	// Получить ментора по идентификатору
	function getMentorById(mentorId) {
		var result = mentors.filter(function(m) {
	    	return m.mentorId === mentorId; 
		});
		if (result.length === 1) {
			return result[0];
		}
		return undefined;
	}

	// Получить студента по идентификатору
	function getStudentById(studentId) {
		var result = students.filter(function(s) {
	    	return s.studentId === studentId; 
		});
		if (result.length === 1) {
			return result[0];
		}
		return undefined;
	}

	// Получить команду по идентификатору
	function getTeamById(teamId) {
		var result = teams.filter(function(t) {
	    	return t.teamId === teamId; 
		});
		if (result.length === 1) {
			return result[0];
		}
		return undefined;
	}

	// Получить задачу по идентификатору
	function getTaskById(taskId) {
		var result = tasks.filter(function(t) {
	    	return t.taskId === taskId; 
		});
		if (result.length === 1) {
			return result[0];
		}
		return undefined;
	}

	// Распределить студентов среди менторов в соответствии с приоритизированными списками
	function formMentorGroups () {
		var rateArray = [];
		mentorGroups = [];

		const IS_MENTOR_PRIMARY = true;
		const MAX_MEMBERS_IN_TEAM = Math.ceil(students.length / mentors.length);
		
		validateData();		
		initMentorGroups();
		fillRateArray();
		associateStudentsWithMentor();	
		return mentorGroups;

		// Валидация данных
		function validateData () {
			if (mentors.length !== mentorPriorities.length)
				throw new Error('Не все менторы указали приоритезированные списки студентов.');
			if (students.length !== studentPriorities.length)
				throw new Error('Не все студенты указали приоритезированные списки менторов.');
			mentorPriorities.forEach(function (mentorPriority){
				if (mentorPriority.studentsIds.length !== students.length)
					throw new Error('Ментор ' + mentorPriority.mentorId  + ' указал приоритет не для всех студентов');
			});
			studentPriorities.forEach(function (studentPriority){
				if (studentPriority.mentorsIds.length !== mentors.length)
					throw new Error('Студент ' + studentPriority.studentId  + ' указал приоритет не для всех менторов');
			});
		}

		// Инициализация команд менторов 
		function initMentorGroups () {
			mentors.forEach(function(mentor, i, arr) {
		    	mentorGroups.push({
		    		mentorId: mentor.mentorId,		    		
		    		members: []
		    	})
			});
		}

		// Заполнение двумерного массива: сумма и разница приоритетов студентов и менторов
		function fillRateArray () {
			var values = [];
			var sortedGroups = {};

			// Заполняем список элементами для каждого сопоставленного приоритета ментора и студента
			studentPriorities.forEach(function(student, i, arr) {							
				var mentorId;
				var studentPriority;
				var mentorPriority;
				var studentId = student.studentId;
				mentorPriorities.forEach(function(mentor, i, arr) {
					mentorId = mentor.mentorId;				
					mentorPriority = student.mentorsIds.indexOf(mentorId) + 1;
					studentPriority = mentor.studentsIds.indexOf(studentId) + 1;
					
					var priorityDif = mentorPriority - studentPriority;
					var priorityDifCoeff = (priorityDif === 0) ? 1 : priorityDif;
					var priorityMult = mentorPriority * studentPriority * Math.abs(priorityDifCoeff);
					values.push({
						studentId: studentId,
						mentorId: mentorId,
						priorityMult: priorityMult,
						priorityDif: priorityDif
					});
				});				
			});

			// Группируем полученные элементы по значению свойства priorityMult
			var groups = {};
			values.forEach(function(value) {
			var key = value.priorityMult;
			    if (key in groups == false) {
			        groups[key] = [];
			    }
			    groups[key].push(value);
			});
					
			sortedGroups = Object.keys(groups).map(function(key) {
			    return {
			        key: key,
			        values: groups[key]
			    };
			});

			// Сортируем элементы внутри каждой группы по значению свойства priorityDif,
			// чем ближе это значение к 0 тем приоритетнее этот элемент 
			// (для сбалансированного соблюдения интересов менторов и студентов), 
			// если элементы равно удалены от 0,
			// отдаем предпочтение priorityDif со знаком минус, что соответствует интересам менторов 
			sortedGroups.forEach (function (group) {
				group.values.sort(function(a, b) {
					var modA = Math.abs(a.priorityDif);
					var modB = Math.abs(b.priorityDif);
					if (modA - modB == 0)
						return a.priorityDif - b.priorityDif;
					else
						return modA - modB;				
				});	
				group.values.forEach(function (value) {
					// Добавляем элементы в линейноый спискок в правильном порядке
					rateArray.push(value);
				});		
			});
		}

		// Распределение студентов по командам
		function associateStudentsWithMentor() {
			var mentorId;
			var mentorTeam;
			var studentsInTeams = [];

			// Если у ментора есть свободные места в команде,
			// и текущий обрабатываемый студент еще не был распределен в команду,
			// определяем его в нужную команду
			rateArray.forEach(function(rate) {
				mentorId = rate.mentorId;
				mentorTeam = mentorGroups.filter(function (team){
					return team.mentorId == mentorId;
				})[0];
				if (mentorTeam.members.length < MAX_MEMBERS_IN_TEAM &&
					studentsInTeams.indexOf(rate.studentId) < 0) {
					mentorTeam.members.push(rate.studentId);
					studentsInTeams.push(rate.studentId);
				}
			});
		}
	}

	// Импорт данных из JSON
	function importJson(jsonString) {
		var importObject = JSON.parse(jsonString);  
		importData(importObject);
	}

	// Экспорт данных в JSON
	function exportJson() {				
		return JSON.stringify(exportData());
	}

	// Импортированные все данные из объекта
	function importData(importObject) {
		mentors = importObject.mentors;
		students = importObject.students;
		teams = importObject.teams;
		tasks = importObject.tasks;
		assignments = importObject.assignments;
		studentPriorities = importObject.studentPriorities;
		mentorPriorities = importObject.mentorPriorities;
		mentorGroups = [];
	}

	// Экспортировать все данные в объект
	function exportData() {
		return {
			mentors: mentors,
			students: students,
			teams: teams,
			tasks: tasks,
			assignments: assignments,
			studentPriorities: studentPriorities,
			mentorPriorities: mentorPriorities
		};
	}

	// Сбросить данные
	function resetData() {
		mentors = [];
		students = [];
		teams = [];
		tasks = [];
		assignments = [];
		studentPriorities = [];
		mentorPriorities = [];
		mentorGroups = [];
	}
}